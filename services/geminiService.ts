import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getQualityPrompt = (quality: number): string => {
  if (quality <= 33) {
    return "Generate a draft-quality image suitable for quick previews. Some artifacts and loss of detail are acceptable to optimize for a smaller file size.";
  }
  if (quality <= 66) {
    return "Generate a standard-quality image with a good balance between visual detail and file size.";
  }
  return "Generate a high-fidelity, realistic image with maximum detail and no visible artifacts. Prioritize quality over file size.";
};

const CRITICAL_CONSTRAINT = `**CRITICAL CONSTRAINT: YOU MUST NOT ALTER THE PRODUCT.** Only change the colors as instructed. Preserve all original characteristics of the product: texture, shadows, lighting, highlights, material feel, perspective, and structure. The background must also be preserved. The result must look like a photograph of a real product, not a digital edit. Any alteration to the product's form or position is a failure.`;

export const generateMockup = async (
  colorSampleFile: File, 
  productMockupFile: File,
  quality: number,
  additionalPrompt: string
): Promise<string> => {
  const colorPart = await fileToGenerativePart(colorSampleFile);
  const productPart = await fileToGenerativePart(productMockupFile);

  const additionalInstructions = additionalPrompt
    ? `**Additional User Instructions:**\n- ${additionalPrompt}`
    : "";

  const prompt = `
    You are an expert product mockup designer with a keen eye for realism and detail. Your task is to recolor a product based on a provided color sample.

    **Instructions:**
    1.  Analyze the 'Color sample' image to understand its color, texture, and material properties.
    2.  Apply this color and texture to the main product in the 'Product mockup' image.
    3.  ${CRITICAL_CONSTRAINT}

    ${additionalInstructions}

    **Output Image Requirements (Mandatory):**
    -   **Format:** PNG
    -   **Size:** 1000 x 1000 pixels
    -   **Resolution:** 300 ppi
    -   **Quality:** ${getQualityPrompt(quality)}

    Return *only* the newly generated image. Do not return any text, just the image file.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: "Color sample:" },
        colorPart,
        { text: "Product mockup:" },
        productPart,
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Could not generate image from the response.");
};

export const generateColorMixMockup = async (
  productMockupFile: File,
  colorFiles: File[],
  isPalette: boolean,
  quality: number,
  additionalPrompt: string
): Promise<string> => {
  const productPart = await fileToGenerativePart(productMockupFile);

  const additionalInstructions = additionalPrompt
    ? `The user has provided specific instructions on how to apply the colors. Follow them carefully:\n- ${additionalPrompt}`
    : `The user has not provided specific instructions. Use your creative expertise to decide where to apply each color for the best result.`;
  
  const prompt = `
    You are an expert product mockup designer specializing in creative and realistic color compositions. Your task is to recolor a product using a set of provided colors.

    **Instructions:**
    1.  Analyze the 'Product mockup' image to understand its form, texture, and lighting.
    2.  Analyze the provided color sources.
        ${isPalette 
          ? `- The user has provided a 'Color Palette'. Select 2-3 harmonious colors from this palette to use for the recoloring.`
          : `- The user has provided up to three separate 'Color' images. Use the primary color from each provided image.`
        }
    3.  Apply these colors to the product in a visually appealing and realistic composition.
    4.  ${CRITICAL_CONSTRAINT}

    **User Guidance:**
    ${additionalInstructions}

    **Output Image Requirements (Mandatory):**
    -   **Format:** PNG
    -   **Size:** 1000 x 1000 pixels
    -   **Resolution:** 300 ppi
    -   **Quality:** ${getQualityPrompt(quality)}

    Return *only* the newly generated image. Do not return any text, just the image file.
  `;

  const colorParts = await Promise.all(colorFiles.map(file => fileToGenerativePart(file)));
  
  const parts: Part[] = [{ text: "Product mockup:" }, productPart];

  if (isPalette) {
    parts.push({ text: "Color Palette:" });
    parts.push(colorParts[0]);
  } else {
    colorParts.forEach((part, index) => {
      parts.push({ text: `Color ${index + 1}:` });
      parts.push(part);
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Could not generate image from the response.");
};

export const generateColorMixWithInspiration = async (
  productMockupFile: File,
  numColors: number,
  contextPrompt: string,
  groupingPrompt: string,
  quality: number,
): Promise<string> => {
  const productPart = await fileToGenerativePart(productMockupFile);

  const contextInstructions = contextPrompt 
    ? `**Desired Vibe/Context:** ${contextPrompt}`
    : `**Desired Vibe/Context:** The user has not provided a specific context. Create a generally appealing and modern color palette.`;
  
  const groupingInstructions = groupingPrompt
    ? `**Color Grouping:** The user has provided specific instructions on how to group colors. Follow them carefully: "${groupingPrompt}".`
    : `**Color Grouping:** The user has not provided grouping instructions. Use your creative expertise to decide where to apply each color for the best result.`;

  const prompt = `
    You are an expert product mockup designer AND a color theory specialist. Your task is to invent a color palette and apply it to a product. This is a two-step task in one go.

    **Step 1: Generate a Color Palette**
    First, you must invent a harmonious color palette based on the user's request.
    - **Number of Colors to Generate:** ${numColors}
    - ${contextInstructions}

    **Step 2: Recolor the Product**
    Next, apply the color palette you just invented to the 'Product mockup'.
    - ${groupingInstructions}
    - Apply the colors in a visually appealing and realistic composition.
    
    **Crucial Design Constraints:**
    - ${CRITICAL_CONSTRAINT}

    **Output Image Requirements (Mandatory):**
    - **Format:** PNG
    - **Size:** 1000 x 1000 pixels
    - **Resolution:** 300 ppi
    - **Quality:** ${getQualityPrompt(quality)}

    Return *only* the newly generated image. Do not return any text, just the image file.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: "Product mockup:" },
        productPart,
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Could not generate image from the response.");
};


export const generateColorMixForBatch = async (
  productMockupFile: File,
  colorInstructions: { file: File; prompt: string }[],
  quality: number,
): Promise<string> => {
  const productPart = await fileToGenerativePart(productMockupFile);

  const instructionsText = colorInstructions
    .map((instr, index) => `- **Color ${index + 1}:** Apply to the parts described as: "${instr.prompt}". The AI must intelligently identify these parts in the mockup.`)
    .join('\n');

  const prompt = `
    You are an expert product mockup designer with a keen eye for realism and detail.
    
    **Task:** Recolor the single 'Product Mockup' image provided based on a precise set of instructions.

    **Color Instructions:**
    You have been provided with several colors (labeled 'Color 1', 'Color 2', etc.) and text instructions for each. You must follow these instructions exactly.
    ${instructionsText}

    ${CRITICAL_CONSTRAINT}

    **Output Image Requirements (Mandatory):**
    - **Format:** PNG
    - **Size:** 1000 x 1000 pixels
    - **Resolution:** 300 ppi
    - **Quality:** ${getQualityPrompt(quality)}

    Return *only* the newly generated image. Do not return any text, just the image file.
  `;

  const colorParts = await Promise.all(colorInstructions.map(instr => fileToGenerativePart(instr.file)));
  
  const parts: Part[] = [
    { text: "Product Mockup:" }, 
    productPart
  ];

  colorInstructions.forEach((_, index) => {
    parts.push({ text: `Color ${index + 1}:` });
    parts.push(colorParts[index]);
  });

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Could not generate image from the response.");
};