
export type GenerationMode = 
  | 'mono-single' 
  | 'mono-batch' 
  | 'mix-known-single'
  | 'mix-known-batch'
  | 'mix-help';

export interface HistoryItem {
  id: string;
  timestamp: string;
  generatedImageUrl: string;
  mode: GenerationMode;
  settings: {
    quality: number;
    // Monochromatic
    additionalPrompt?: string;
    colorSamplePreview?: string | null;
    productMockupPreview?: string | null; // For single
    productMockupPreviews?: (string | null)[]; // For batch
    
    // Color Mix - Knows
    cmAdditionalPrompt?: string;
    cmInputType?: 'separate' | 'palette';
    cmProductPreview?: string | null;
    cmSeparateColorPreviews?: (string | null)[];
    cmPalettePreview?: string | null;
    cmBatchProductPreviews?: (string | null)[];
    cmColorInstructions?: { preview: string | null; prompt: string }[];
    
    // Color Mix - Help
    cmNumColors?: number;
    cmContextPrompt?: string;
    cmGroupingPrompt?: string;
  };
}
