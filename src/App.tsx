import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateMockup, generateColorMixMockup, generateColorMixWithInspiration, generateColorMixForBatch } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import HistoryPanel from './components/HistoryPanel';
import InstructionManual from './components/InstructionManual';
import { PaletteIcon, ImageIcon, MagicWandIcon, DownloadIcon, CollectionIcon, RefreshIcon, ColorSwatchIcon, ChevronLeftIcon, LightbulbIcon, UserIcon, LogoutIcon, HistoryIcon, HelpCircleIcon, GlobeIcon } from './components/icons';
import type { HistoryItem } from './types';
import { translations } from './lib/translations';

const MAX_MOCKUPS = 5;
const MAX_COLOR_MIX_COLORS = 3;

const App: React.FC = () => {
  // Language & Manual states
  const [language, setLanguage] = useState<'en' | 'pt-br'>('en');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = translations[language];

  // Auth & History states
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [allHistory, setAllHistory] = useState<{ [key: string]: HistoryItem[] }>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  
  // App states
  const [macroMode, setMacroMode] = useState<'monochromatic' | 'colorMix' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(90);
  
  // Monochromatic states
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [additionalPrompt, setAdditionalPrompt] = useState<string>('');
  const [colorSampleFile, setColorSampleFile] = useState<File | null>(null);
  const [productMockupFile, setProductMockupFile] = useState<File | null>(null);
  const [colorSamplePreview, setColorSamplePreview] = useState<string | null>(null);
  const [productMockupPreview, setProductMockupPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [batchColorSampleFile, setBatchColorSampleFile] = useState<File | null>(null);
  const [batchColorSamplePreview, setBatchColorSamplePreview] = useState<string | null>(null);
  const [productMockupFiles, setProductMockupFiles] = useState<(File | null)[]>(Array(MAX_MOCKUPS).fill(null));
  const [productMockupPreviews, setProductMockupPreviews] = useState<(string | null)[]>(Array(MAX_MOCKUPS).fill(null));
  const [generatedImages, setGeneratedImages] = useState<(string | null | 'error')[]>(Array(MAX_MOCKUPS).fill(null));
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  // Color Mix states
  const [colorMixMode, setColorMixMode] = useState<'selection' | 'knowsColors' | 'needsHelp'>('selection');
  const [cmKnowsColorsMode, setCmKnowsColorsMode] = useState<'single' | 'batch'>('single');
  const [colorMixInputType, setColorMixInputType] = useState<'separate' | 'palette'>('separate');
  const [cmProductFile, setCmProductFile] = useState<File | null>(null);
  const [cmProductPreview, setCmProductPreview] = useState<string | null>(null);
  const [cmSeparateColorFiles, setCmSeparateColorFiles] = useState<(File | null)[]>(Array(MAX_COLOR_MIX_COLORS).fill(null));
  const [cmSeparateColorPreviews, setCmSeparateColorPreviews] = useState<(string | null)[]>(Array(MAX_COLOR_MIX_COLORS).fill(null));
  const [cmPaletteFile, setCmPaletteFile] = useState<File | null>(null);
  const [cmPalettePreview, setCmPalettePreview] = useState<string | null>(null);
  const [cmGeneratedImage, setCmGeneratedImage] = useState<string | null>(null);
  const [cmAdditionalPrompt, setCmAdditionalPrompt] = useState('');
  const [cmNumColors, setCmNumColors] = useState(2);
  const [cmContextPrompt, setCmContextPrompt] = useState('');
  const [cmGroupingPrompt, setCmGroupingPrompt] = useState('');
  const [cmBatchProductFiles, setCmBatchProductFiles] = useState<(File | null)[]>(Array(MAX_MOCKUPS).fill(null));
  const [cmBatchProductPreviews, setCmBatchProductPreviews] = useState<(string | null)[]>(Array(MAX_MOCKUPS).fill(null));
  const [cmColorInstructions, setCmColorInstructions] = useState<{ file: File | null; preview: string | null; prompt: string }[]>(
    Array(MAX_COLOR_MIX_COLORS).fill({}).map(() => ({ file: null, preview: null, prompt: '' }))
  );
  const [cmBatchGeneratedImages, setCmBatchGeneratedImages] = useState<(string | null | 'error')[]>(Array(MAX_MOCKUPS).fill(null));
  const [cmBatchRegeneratingIndex, setCmBatchRegeneratingIndex] = useState<number | null>(null);

  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetAllStates = () => {
    setIsLoading(false);
    setError(null);
    setQuality(90);
    
    // Monochromatic
    setActiveTab('single');
    setAdditionalPrompt('');
    setColorSampleFile(null); setProductMockupFile(null);
    setColorSamplePreview(null); setProductMockupPreview(null);
    setGeneratedImage(null);
    setBatchColorSampleFile(null); setBatchColorSamplePreview(null);
    setProductMockupFiles(Array(MAX_MOCKUPS).fill(null)); setProductMockupPreviews(Array(MAX_MOCKUPS).fill(null));
    setGeneratedImages(Array(MAX_MOCKUPS).fill(null));
    setRegeneratingIndex(null);

    // Color Mix
    setColorMixMode('selection');
    setCmKnowsColorsMode('single');
    setColorMixInputType('separate');
    setCmProductFile(null); setCmProductPreview(null);
    setCmSeparateColorFiles(Array(MAX_COLOR_MIX_COLORS).fill(null)); setCmSeparateColorPreviews(Array(MAX_COLOR_MIX_COLORS).fill(null));
    setCmPaletteFile(null); setCmPalettePreview(null);
    setCmGeneratedImage(null);
    setCmAdditionalPrompt('');
    setCmNumColors(2);
    setCmContextPrompt('');
    setCmGroupingPrompt('');
    setCmBatchProductFiles(Array(MAX_MOCKUPS).fill(null)); setCmBatchProductPreviews(Array(MAX_MOCKUPS).fill(null));
    setCmColorInstructions(Array(MAX_COLOR_MIX_COLORS).fill({}).map(() => ({ file: null, preview: null, prompt: '' })));
    setCmBatchGeneratedImages(Array(MAX_MOCKUPS).fill(null));
    setCmBatchRegeneratingIndex(null);
  };

  // --- Auth & History Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUser = usernameInput.trim();
    if (trimmedUser) {
      setCurrentUser(trimmedUser);
      setHistory(allHistory[trimmedUser] || []);
      setUsernameInput('');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      setAllHistory(prev => ({ ...prev, [currentUser]: history }));
    }
    setCurrentUser(null);
    setHistory([]);
    setMacroMode(null);
    resetAllStates();
  };
  
  const handleReuseSettings = (item: HistoryItem) => {
    resetAllStates();
    setQuality(item.settings.quality);
    
    switch (item.mode) {
      case 'mono-single':
        setMacroMode('monochromatic');
        setActiveTab('single');
        setAdditionalPrompt(item.settings.additionalPrompt || '');
        setColorSamplePreview(item.settings.colorSamplePreview || null);
        setProductMockupPreview(item.settings.productMockupPreview || null);
        break;
      case 'mono-batch':
        setMacroMode('monochromatic');
        setActiveTab('batch');
        setAdditionalPrompt(item.settings.additionalPrompt || '');
        setBatchColorSamplePreview(item.settings.colorSamplePreview || null);
        setProductMockupPreviews(item.settings.productMockupPreviews || Array(MAX_MOCKUPS).fill(null));
        break;
      case 'mix-known-single':
        setMacroMode('colorMix');
        setColorMixMode('knowsColors');
        setCmKnowsColorsMode('single');
        setCmAdditionalPrompt(item.settings.cmAdditionalPrompt || '');
        setColorMixInputType(item.settings.cmInputType || 'separate');
        setCmProductPreview(item.settings.cmProductPreview || null);
        setCmSeparateColorPreviews(item.settings.cmSeparateColorPreviews || Array(MAX_COLOR_MIX_COLORS).fill(null));
        setCmPalettePreview(item.settings.cmPalettePreview || null);
        break;
      case 'mix-known-batch':
        setMacroMode('colorMix');
        setColorMixMode('knowsColors');
        setCmKnowsColorsMode('batch');
        setCmBatchProductPreviews(item.settings.cmBatchProductPreviews || Array(MAX_MOCKUPS).fill(null));
        // FIX: Reconstruct color instructions from history, adding `file: null` because File objects are not persisted.
        const instructions = item.settings.cmColorInstructions || [];
        const restoredInstructions = Array(MAX_COLOR_MIX_COLORS)
          .fill(null)
          .map((_, i) => ({
            file: null,
            preview: instructions[i]?.preview || null,
            prompt: instructions[i]?.prompt || '',
          }));
        setCmColorInstructions(restoredInstructions);
        break;
      case 'mix-help':
        setMacroMode('colorMix');
        setColorMixMode('needsHelp');
        setCmProductPreview(item.settings.cmProductPreview || null);
        setCmNumColors(item.settings.cmNumColors || 2);
        setCmContextPrompt(item.settings.cmContextPrompt || '');
        setCmGroupingPrompt(item.settings.cmGroupingPrompt || '');
        break;
    }
    setIsHistoryPanelOpen(false);
    alert(t.settingsRestored);
  };

  const handleModeSelect = (mode: 'monochromatic' | 'colorMix') => {
    resetAllStates();
    setMacroMode(mode);
  };
  
  // --- Monochromatic Handlers ---
  const handleTabChange = (tab: 'single' | 'batch') => { setActiveTab(tab); setError(null); };
  const handleColorSampleSelect = (file: File) => { setColorSampleFile(file); setColorSamplePreview(URL.createObjectURL(file)); setGeneratedImage(null); setError(null); };
  const handleProductMockupSelect = (file: File) => { setProductMockupFile(file); setProductMockupPreview(URL.createObjectURL(file)); setGeneratedImage(null); setError(null); };
  const handleGenerate = useCallback(async () => {
    if (!colorSampleFile || !productMockupFile) { setError(t.errorSelectBoth); return; }
    setIsLoading(true); setError(null);
    try {
      const result = await generateMockup(colorSampleFile, productMockupFile, quality, additionalPrompt);
      setGeneratedImage(result);
      const newHistoryItem: HistoryItem = { id: Date.now().toString(), timestamp: new Date().toISOString(), generatedImageUrl: result, mode: 'mono-single', settings: { quality, additionalPrompt, colorSamplePreview, productMockupPreview }};
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) { console.error(err); setError(t.errorGenerate); } 
    finally { setIsLoading(false); }
  }, [colorSampleFile, productMockupFile, quality, additionalPrompt, colorSamplePreview, productMockupPreview, t]);
  const handleBatchColorSampleSelect = (file: File) => { setBatchColorSampleFile(file); setBatchColorSamplePreview(URL.createObjectURL(file)); setGeneratedImages(Array(MAX_MOCKUPS).fill(null)); setError(null); };
  const handleBatchProductMockupSelect = (file: File, index: number) => {
    const newFiles = [...productMockupFiles]; newFiles[index] = file; setProductMockupFiles(newFiles);
    const newPreviews = [...productMockupPreviews]; newPreviews[index] = URL.createObjectURL(file); setProductMockupPreviews(newPreviews);
    setGeneratedImages(Array(MAX_MOCKUPS).fill(null)); setError(null);
  };
  const handleBatchGenerate = useCallback(async () => {
    const filesToProcess = productMockupFiles.filter(f => f !== null) as File[];
    if (!batchColorSampleFile || filesToProcess.length === 0) { setError(t.errorSelectColorAndMockup); return; }
    setIsLoading(true); setError(null); setGeneratedImages(Array(MAX_MOCKUPS).fill(null));
    try {
      const mockupsWithIndices = productMockupFiles.map((file, index) => ({ file, index })).filter(item => item.file !== null);
      const promises = mockupsWithIndices.map(item => generateMockup(batchColorSampleFile, item.file!, quality, additionalPrompt));
      const results = await Promise.allSettled(promises);
      const newGeneratedImages = Array(MAX_MOCKUPS).fill(null);
      results.forEach((result, i) => {
        const originalIndex = mockupsWithIndices[i].index;
        if (result.status === 'fulfilled') { 
          newGeneratedImages[originalIndex] = result.value;
          const newHistoryItem: HistoryItem = { id: `${Date.now()}-${originalIndex}`, timestamp: new Date().toISOString(), generatedImageUrl: result.value, mode: 'mono-batch', settings: { quality, additionalPrompt, colorSamplePreview: batchColorSamplePreview, productMockupPreviews }};
          setHistory(prev => [newHistoryItem, ...prev]);
        } 
        else { console.error(`Failed for mockup ${originalIndex}:`, result.reason); newGeneratedImages[originalIndex] = 'error'; }
      });
      setGeneratedImages(newGeneratedImages);
    } catch (err) { console.error(err); setError(t.errorBatch); } 
    finally { setIsLoading(false); }
  }, [batchColorSampleFile, productMockupFiles, quality, additionalPrompt, batchColorSamplePreview, productMockupPreviews, t]);
  const handleRegenerateSingle = useCallback(async (index: number) => {
    const colorFile = batchColorSampleFile; const mockupFile = productMockupFiles[index];
    if (!colorFile || !mockupFile) { setError(t.errorCannotRegenerate(index + 1)); return; }
    setRegeneratingIndex(index); setError(null);
    const newGeneratedImages = [...generatedImages];
    try {
      const result = await generateMockup(colorFile, mockupFile, quality, additionalPrompt);
      newGeneratedImages[index] = result;
      setGeneratedImages(newGeneratedImages);
      const newHistoryItem: HistoryItem = { id: `${Date.now()}-${index}`, timestamp: new Date().toISOString(), generatedImageUrl: result, mode: 'mono-batch', settings: { quality, additionalPrompt, colorSamplePreview: batchColorSamplePreview, productMockupPreviews }};
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error(`Failed to regenerate mockup ${index}:`, err); newGeneratedImages[index] = 'error'; setGeneratedImages(newGeneratedImages);
      setError(t.errorFailedToRegenerate(index + 1));
    } finally { setRegeneratingIndex(null); }
  }, [batchColorSampleFile, productMockupFiles, quality, additionalPrompt, generatedImages, batchColorSamplePreview, productMockupPreviews, t]);

  // --- Color Mix Handlers ---
  const handleCmProductSelect = (file: File) => { setCmProductFile(file); setCmProductPreview(URL.createObjectURL(file)); setCmGeneratedImage(null); setError(null); };
  const handleCmSeparateColorSelect = (file: File, index: number) => {
    const newFiles = [...cmSeparateColorFiles]; newFiles[index] = file; setCmSeparateColorFiles(newFiles);
    const newPreviews = [...cmSeparateColorPreviews]; newPreviews[index] = URL.createObjectURL(file); setCmSeparateColorPreviews(newPreviews);
    setCmGeneratedImage(null); setError(null);
  };
  const handleCmPaletteSelect = (file: File) => { setCmPaletteFile(file); setCmPalettePreview(URL.createObjectURL(file)); setCmGeneratedImage(null); setError(null); };
  const handleGenerateColorMixKnows = useCallback(async () => {
    const isPalette = colorMixInputType === 'palette';
    const colorFiles = isPalette ? (cmPaletteFile ? [cmPaletteFile] : []) : cmSeparateColorFiles.filter(f => f !== null) as File[];
    if (!cmProductFile || colorFiles.length === 0) { setError(t.errorSelectProductAndColor); return; }
    
    setIsLoading(true); setError(null);
    try {
      const result = await generateColorMixMockup(cmProductFile, colorFiles, isPalette, quality, cmAdditionalPrompt);
      setCmGeneratedImage(result);
      const newHistoryItem: HistoryItem = { id: Date.now().toString(), timestamp: new Date().toISOString(), generatedImageUrl: result, mode: 'mix-known-single', settings: { quality, cmAdditionalPrompt, cmInputType: colorMixInputType, cmProductPreview, cmSeparateColorPreviews, cmPalettePreview }};
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) { console.error(err); setError(t.errorGenerate); } 
    finally { setIsLoading(false); }
  }, [cmProductFile, colorMixInputType, cmPaletteFile, cmSeparateColorFiles, quality, cmAdditionalPrompt, cmProductPreview, cmSeparateColorPreviews, cmPalettePreview, t]);
  const handleGenerateColorMixHelp = useCallback(async () => {
    if (!cmProductFile) { setError(t.errorSelectProduct); return; }
    if (!cmContextPrompt) { setError(t.errorProvideContext); return; }
    
    setIsLoading(true); setError(null);
    try {
      const result = await generateColorMixWithInspiration(cmProductFile, cmNumColors, cmContextPrompt, cmGroupingPrompt, quality);
      setCmGeneratedImage(result);
      const newHistoryItem: HistoryItem = { id: Date.now().toString(), timestamp: new Date().toISOString(), generatedImageUrl: result, mode: 'mix-help', settings: { quality, cmProductPreview, cmNumColors, cmContextPrompt, cmGroupingPrompt }};
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) { console.error(err); setError(t.errorGenerate); } 
    finally { setIsLoading(false); }
  }, [cmProductFile, cmNumColors, cmContextPrompt, cmGroupingPrompt, quality, cmProductPreview, t]);
  
  // --- Color Mix Batch Handlers ---
  const handleCmBatchProductSelect = (file: File, index: number) => {
    const newFiles = [...cmBatchProductFiles]; newFiles[index] = file; setCmBatchProductFiles(newFiles);
    const newPreviews = [...cmBatchProductPreviews]; newPreviews[index] = URL.createObjectURL(file); setCmBatchProductPreviews(newPreviews);
    setCmBatchGeneratedImages(Array(MAX_MOCKUPS).fill(null)); setError(null);
  };
  const handleCmColorInstructionFile = (file: File, index: number) => {
    const newInstructions = [...cmColorInstructions];
    newInstructions[index] = { ...newInstructions[index], file, preview: URL.createObjectURL(file) };
    setCmColorInstructions(newInstructions);
    setCmBatchGeneratedImages(Array(MAX_MOCKUPS).fill(null)); setError(null);
  };
  const handleCmColorInstructionPrompt = (prompt: string, index: number) => {
    const newInstructions = [...cmColorInstructions];
    newInstructions[index] = { ...newInstructions[index], prompt };
    setCmColorInstructions(newInstructions);
  };
  const handleGenerateColorMixBatch = useCallback(async () => {
    const productFiles = cmBatchProductFiles.filter(f => f) as File[];
    const instructions = cmColorInstructions.filter(i => i.file && i.prompt) as { file: File; prompt: string }[];
    if (productFiles.length === 0 || instructions.length === 0) { setError(t.errorBatchInstruction); return; }
    
    setIsLoading(true); setError(null); setCmBatchGeneratedImages(Array(MAX_MOCKUPS).fill(null));
    try {
      const mockupsWithIndices = cmBatchProductFiles.map((file, index) => ({ file, index })).filter(item => item.file);
      const promises = mockupsWithIndices.map(item => generateColorMixForBatch(item.file!, instructions, quality));
      const results = await Promise.allSettled(promises);
      const newGeneratedImages = Array(MAX_MOCKUPS).fill(null);
      results.forEach((result, i) => {
        const originalIndex = mockupsWithIndices[i].index;
        if (result.status === 'fulfilled') { 
          newGeneratedImages[originalIndex] = result.value;
          const newHistoryItem: HistoryItem = { id: `${Date.now()}-${originalIndex}`, timestamp: new Date().toISOString(), generatedImageUrl: result.value, mode: 'mix-known-batch', settings: { quality, cmBatchProductPreviews, cmColorInstructions: cmColorInstructions.map(c => ({ preview: c.preview, prompt: c.prompt })) }};
          setHistory(prev => [newHistoryItem, ...prev]);
        }
        else { console.error(`Failed for mockup ${originalIndex}:`, result.reason); newGeneratedImages[originalIndex] = 'error'; }
      });
      setCmBatchGeneratedImages(newGeneratedImages);
    } catch (err) { console.error(err); setError(t.errorBatch); }
    finally { setIsLoading(false); }
  }, [cmBatchProductFiles, cmColorInstructions, quality, cmBatchProductPreviews, t]);
  const handleRegenerateSingleColorMixBatch = useCallback(async (index: number) => {
    const mockupFile = cmBatchProductFiles[index];
    const instructions = cmColorInstructions.filter(i => i.file && i.prompt) as { file: File; prompt: string }[];
    if (!mockupFile || instructions.length === 0) { setError(t.errorCannotRegenerate(index + 1)); return; }
    
    setCmBatchRegeneratingIndex(index); setError(null);
    const newGeneratedImages = [...cmBatchGeneratedImages];
    try {
      const result = await generateColorMixForBatch(mockupFile, instructions, quality);
      newGeneratedImages[index] = result;
      setCmBatchGeneratedImages(newGeneratedImages);
      const newHistoryItem: HistoryItem = { id: `${Date.now()}-${index}`, timestamp: new Date().toISOString(), generatedImageUrl: result, mode: 'mix-known-batch', settings: { quality, cmBatchProductPreviews, cmColorInstructions: cmColorInstructions.map(c => ({ preview: c.preview, prompt: c.prompt })) }};
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error(`Failed to regenerate mockup ${index}:`, err); newGeneratedImages[index] = 'error'; setCmBatchGeneratedImages(newGeneratedImages);
      setError(t.errorFailedToRegenerate(index + 1));
    } finally { setCmBatchRegeneratingIndex(null); }
  }, [cmBatchProductFiles, cmColorInstructions, quality, cmBatchGeneratedImages, cmBatchProductPreviews, t]);


  // --- Shared Handlers ---
  const handleSaveImage = (imageUrl: string, filename: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a'); link.href = imageUrl; link.download = filename;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const renderPromptHint = () => language === 'pt-br' && <p className="text-xs text-amber-600 mt-1 text-center">{t.promptHint}</p>;

  // --- Render Methods ---
  const renderQualitySlider = () => (
    <div className="w-full max-w-sm">
      <label htmlFor="quality-slider" className="block text-sm font-medium text-gray-700 mb-2 text-center">
        {t.quality}: <span className="font-bold text-indigo-600">{quality}</span>
      </label>
      <input id="quality-slider" type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" disabled={isLoading || regeneratingIndex !== null || cmBatchRegeneratingIndex !== null} />
      <div className="flex justify-between text-xs text-gray-500 mt-1"><span>{t.lowerQuality}</span><span>{t.higherQuality}</span></div>
    </div>
  );

  const renderLoadingSpinner = () => (
    <div className="mt-8 flex flex-col items-center text-indigo-700">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 font-medium">{t.loading}</p>
    </div>
  );

  const renderError = () => error && (
    <div className="mt-8 text-center p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg animate-fade-in w-full max-w-md">
      <p>{error}</p>
    </div>
  );
  
  const baseLayout = (children: React.ReactNode) => (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8 relative">
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <header className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 z-20">
        <div className="relative" ref={langMenuRef}>
            <button onClick={() => setIsLangMenuOpen(prev => !prev)} className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200">
                <GlobeIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'PT'}</span>
            </button>
            <div className={`absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ${isLangMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'font-bold text-indigo-600' : 'text-gray-700'} hover:bg-gray-100 rounded-t-lg`}>English</button>
                <button onClick={() => { setLanguage('pt-br'); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'pt-br' ? 'font-bold text-indigo-600' : 'text-gray-700'} hover:bg-gray-100 rounded-b-lg`}>Português (BR)</button>
            </div>
        </div>
        <button onClick={() => setIsManualOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200">
            <HelpCircleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t.howToUse}</span>
        </button>
      </header>
      {currentUser && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-20">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">{t.welcome}, <span className="font-bold">{currentUser}</span></span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200">
            <LogoutIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      )}
      <div className="text-center mb-8 pt-16 sm:pt-8">
        <div className="inline-flex items-center">
          <MagicWandIcon className="w-12 h-12 text-indigo-600 mr-3"/>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">{t.mainTitle}</h1>
        </div>
        <p className="mt-2 text-lg text-gray-600">{t.mainSubtitle}</p>
      </div>
      <main className="flex flex-col items-center">{children}</main>
      {currentUser && (
        <>
          <button onClick={() => setIsHistoryPanelOpen(true)} title={t.history} className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 z-30">
            <HistoryIcon className="w-7 h-7" />
          </button>
          <HistoryPanel history={history} isOpen={isHistoryPanelOpen} onClose={() => setIsHistoryPanelOpen(false)} onReuseSettings={handleReuseSettings} t={t} />
        </>
      )}
      <InstructionManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} t={t} />
    </div>
  );

  if (!currentUser) {
    return baseLayout(
      <div className="w-full max-w-md text-center animate-fade-in mt-16">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.welcome}</h2>
          <p className="text-gray-600 mb-6">{t.pleaseLogin}</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={t.usernamePlaceholder}
                className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
                aria-label="Username"
              />
            </div>
            <button type="submit" className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">
              {t.login}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">{t.loginHint}</p>
        </div>
      </div>
    );
  }

  if (!macroMode) {
    return baseLayout(
      <div className="w-full max-w-4xl text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t.chooseMode}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <button onClick={() => handleModeSelect('monochromatic')} className="group text-left p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <MagicWandIcon className="w-12 h-12 text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.monoTitle}</h3>
            <p className="text-gray-600">{t.monoDescription}</p>
          </button>
          <button onClick={() => handleModeSelect('colorMix')} className="group text-left p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <ColorSwatchIcon className="w-12 h-12 text-teal-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.colorMixTitle}</h3>
            <p className="text-gray-600">{t.colorMixDescription}</p>
          </button>
        </div>
      </div>
    );
  }

  return baseLayout(
    <div className="w-full max-w-6xl">
      <div className="mb-6">
        <button onClick={() => setMacroMode(null)} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" /> {t.changeMode}
        </button>
      </div>

      {macroMode === 'monochromatic' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          <div className="flex justify-center w-full max-w-4xl border-b border-gray-300 mb-8">
            <button onClick={() => handleTabChange('single')} className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300 border-b-4 ${activeTab === 'single' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-200'}`}>
              <ImageIcon className="w-6 h-6" /> {t.singleMockup}
            </button>
            <button onClick={() => handleTabChange('batch')} className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300 border-b-4 ${activeTab === 'batch' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-200'}`}>
              <CollectionIcon className="w-6 h-6" /> {t.batchMockups}
            </button>
          </div>
          {activeTab === 'single' && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center"><h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><PaletteIcon className="w-6 h-6 mr-2 text-indigo-500" /> {t.colorSample}</h2><ImageUploader onImageSelect={handleColorSampleSelect} previewUrl={colorSamplePreview} t={t}/></div>
                  <div className="flex flex-col items-center"><h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><ImageIcon className="w-6 h-6 mr-2 text-indigo-500" /> {t.productMockup}</h2><ImageUploader onImageSelect={handleProductMockupSelect} previewUrl={productMockupPreview} t={t}/></div>
              </div>
              {colorSamplePreview && productMockupPreview && !generatedImage && !isLoading && (
                <div className="mt-8 w-full max-w-md flex flex-col items-center gap-6 animate-fade-in">
                  <div className="w-full max-w-sm">
                    <label htmlFor="additional-prompt" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.additionalInstructions}</label>
                    <textarea id="additional-prompt" value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value)} placeholder={t.additionalInstructionsPlaceholder}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
                      rows={3} disabled={isLoading || regeneratingIndex !== null} />
                    {renderPromptHint()}
                  </div>
                  {renderQualitySlider()}
                  <button onClick={handleGenerate} className="mt-2 px-10 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{t.generateMockup}</button>
                </div>
              )}
              {isLoading && renderLoadingSpinner()}
              {renderError()}
              {generatedImage && (
                <div className="mt-12 w-full max-w-2xl animate-fade-in text-center">
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.mockupReady}</h2>
                  <div className="bg-white p-4 rounded-2xl shadow-2xl"><img src={generatedImage} alt="Generated product mockup" className="w-full h-auto object-contain rounded-xl" /></div>
                  <div className="mt-8 flex flex-col items-center gap-6">
                      <div className="w-full max-w-sm">
                        <label htmlFor="additional-prompt-regen" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.additionalInstructions}</label>
                        <textarea id="additional-prompt-regen" value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value)} placeholder={t.additionalInstructionsPlaceholder}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
                          rows={3} disabled={isLoading} />
                        {renderPromptHint()}
                      </div>
                      {renderQualitySlider()}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full">
                          <button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{isLoading ? t.generating : t.generateAgain}</button>
                          <button onClick={() => handleSaveImage(generatedImage, 'product-mockup.png')} className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 text-lg"><DownloadIcon className="w-6 h-6 mr-2" />{t.saveImage}</button>
                      </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'batch' && (
            <div className="w-full flex flex-col items-center animate-fade-in">
                <div className="w-full max-w-5xl mb-8">
                    <div className="flex flex-col items-center mb-10"><h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><PaletteIcon className="w-6 h-6 mr-2 text-indigo-500" /> {t.colorSample}</h2><ImageUploader onImageSelect={handleBatchColorSampleSelect} previewUrl={batchColorSamplePreview} t={t} /></div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center"><ImageIcon className="w-6 h-6 mr-2 text-indigo-500 inline-block" /> {t.productMockupsBatch(MAX_MOCKUPS)}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{[...Array(MAX_MOCKUPS)].map((_, index) => (<ImageUploader key={index} onImageSelect={(file) => handleBatchProductMockupSelect(file, index)} previewUrl={productMockupPreviews[index]} t={t} />))}</div>
                </div>
                {batchColorSamplePreview && productMockupFiles.some(f => f) && !generatedImages.some(i => i) && !isLoading && (<div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-in"><div className="w-full max-w-sm"><label htmlFor="additional-prompt-batch" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.additionalInstructions}</label><textarea id="additional-prompt-batch" value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value)} placeholder={t.additionalInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" rows={3} disabled={isLoading || regeneratingIndex !== null} />{renderPromptHint()}</div>{renderQualitySlider()}<button onClick={handleBatchGenerate} className="mt-2 px-10 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{t.generateAll}</button></div>)}
                {isLoading && renderLoadingSpinner()}
                {renderError()}
                {generatedImages.some(i => i) && (
                  <div className="mt-12 w-full max-w-5xl animate-fade-in text-center">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.mockupsReady}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {generatedImages.map((image, index) => (<div key={index} className="flex flex-col items-center gap-2">{image === 'error' ? (<div className="w-full h-full bg-red-100 border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center p-4 text-red-700 aspect-square"><p className="text-sm font-semibold text-center">{t.generationFailed}</p><button onClick={() => handleRegenerateSingle(index)} disabled={isLoading || regeneratingIndex !== null} className="mt-2 flex items-center justify-center gap-1 px-4 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow hover:bg-indigo-700 transition-colors disabled:bg-gray-400"><RefreshIcon className="w-3 h-3"/>{regeneratingIndex === index ? t.retrying : t.retry}</button></div>) : image ? (<div className="bg-white p-2 rounded-xl shadow-lg w-full"><div className="relative"><img src={image} alt={`Generated mockup ${index + 1}`} className="w-full h-auto object-contain rounded-lg" />{regeneratingIndex === index && (<div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg"><div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>)}</div><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={() => handleSaveImage(image, `mockup-${index+1}.png`)} className="flex items-center justify-center gap-1 px-2 py-2 bg-green-600 text-white text-xs font-semibold rounded-full shadow hover:bg-green-700 transition-colors"><DownloadIcon className="w-3 h-3" />{t.save}</button><button onClick={() => handleRegenerateSingle(index)} disabled={isLoading || regeneratingIndex !== null} className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-600 text-white text-xs font-semibold rounded-full shadow hover:bg-gray-700 transition-colors disabled:bg-gray-400"><RefreshIcon className="w-3 h-3" />{t.regen}</button></div></div>) : productMockupFiles[index] ? (<div className="w-full aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center"><p className="text-xs text-gray-500">{t.notGenerated}</p></div>) : null}</div>))}
                    </div>
                    <div className="mt-8 w-full max-w-md flex flex-col items-center gap-6 mx-auto"><div className="w-full max-w-sm"><label htmlFor="additional-prompt-batch-regen" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.additionalInstructions}</label><textarea id="additional-prompt-batch-regen" value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value)} placeholder={t.additionalInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" rows={3} disabled={isLoading || regeneratingIndex !== null} />{renderPromptHint()}</div>{renderQualitySlider()}<button onClick={handleBatchGenerate} disabled={isLoading || regeneratingIndex !== null} className="mt-2 px-10 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{isLoading ? t.generating : t.generateAgain}</button></div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {macroMode === 'colorMix' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          {colorMixMode === 'selection' && (
            <div className="w-full max-w-4xl text-center animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t.colorMixChoose}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <button onClick={() => setColorMixMode('knowsColors')} className="group text-left p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <PaletteIcon className="w-12 h-12 text-teal-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.knowsColorsTitle}</h3>
                  <p className="text-gray-600">{t.knowsColorsDescription}</p>
                </button>
                <button onClick={() => setColorMixMode('needsHelp')} className="group text-left p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <LightbulbIcon className="w-12 h-12 text-amber-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.needsHelpTitle}</h3>
                  <p className="text-gray-600">{t.needsHelpDescription}</p>
                </button>
              </div>
            </div>
          )}

          {colorMixMode === 'knowsColors' && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <button onClick={() => { setColorMixMode('selection'); setCmGeneratedImage(null); setError(null);}} className="flex items-center gap-2 text-sm mb-6 font-semibold text-teal-600 hover:text-teal-800 transition-colors self-start">
                <ChevronLeftIcon className="w-5 h-5" /> {t.backToColorMix}
              </button>
              <div className="flex justify-center w-full max-w-4xl border-b border-gray-300 mb-8">
                <button onClick={() => setCmKnowsColorsMode('single')} className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300 border-b-4 ${cmKnowsColorsMode === 'single' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-teal-500 hover:border-teal-200'}`}>
                  <ImageIcon className="w-6 h-6" /> {t.singleProduct}
                </button>
                <button onClick={() => setCmKnowsColorsMode('batch')} className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300 border-b-4 ${cmKnowsColorsMode === 'batch' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-teal-500 hover:border-teal-200'}`}>
                  <CollectionIcon className="w-6 h-6" /> {t.batchMultipleViews}
                </button>
              </div>

              {cmKnowsColorsMode === 'single' && (
                <div className="w-full flex flex-col items-center animate-fade-in">
                  <div className="w-full max-w-5xl mb-8">
                    <div className="flex flex-col items-center mb-10"><h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><ImageIcon className="w-6 h-6 mr-2 text-indigo-500" /> {t.productMockup}</h2><ImageUploader onImageSelect={handleCmProductSelect} previewUrl={cmProductPreview} t={t} /></div>
                    <div className="flex justify-center w-full max-w-md border-b border-gray-300 mb-6 mx-auto"><button onClick={() => setColorMixInputType('separate')} className={`px-6 py-2 text-md font-semibold rounded-t-lg transition-colors duration-300 border-b-2 ${colorMixInputType === 'separate' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-teal-500'}`}>{t.separateColors}</button><button onClick={() => setColorMixInputType('palette')} className={`px-6 py-2 text-md font-semibold rounded-t-lg transition-colors duration-300 border-b-2 ${colorMixInputType === 'palette' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-teal-500'}`}>{t.colorPalette}</button></div>
                    {colorMixInputType === 'separate' ? (<div><h2 className="text-xl font-semibold text-gray-700 mb-3 text-center"><PaletteIcon className="w-6 h-6 mr-2 text-indigo-500 inline-block" /> {t.colorSamples(MAX_COLOR_MIX_COLORS)}</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[...Array(MAX_COLOR_MIX_COLORS)].map((_, index) => (<ImageUploader key={index} onImageSelect={(file) => handleCmSeparateColorSelect(file, index)} previewUrl={cmSeparateColorPreviews[index]} t={t} />))}</div></div>) : (<div className="flex flex-col items-center"><h2 className="text-xl font-semibold text-gray-700 mb-3 text-center"><PaletteIcon className="w-6 h-6 mr-2 text-indigo-500 inline-block" /> {t.colorPalette}</h2><ImageUploader onImageSelect={handleCmPaletteSelect} previewUrl={cmPalettePreview} t={t} /></div>)}
                  </div>
                  {cmProductPreview && !cmGeneratedImage && !isLoading && ((colorMixInputType === 'palette' ? cmPaletteFile : cmSeparateColorFiles.some(f=>f))) && (<div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-in"><div className="w-full max-w-sm"><label htmlFor="cm-additional-prompt" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.applicationInstructions}</label><textarea id="cm-additional-prompt" value={cmAdditionalPrompt} onChange={(e) => setCmAdditionalPrompt(e.target.value)} placeholder={t.applicationInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={3} disabled={isLoading} />{renderPromptHint()}</div>{renderQualitySlider()}<button onClick={handleGenerateColorMixKnows} className="mt-2 px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{t.generateColorMix}</button></div>)}
                  {isLoading && renderLoadingSpinner()}{renderError()}
                  {cmGeneratedImage && (<div className="mt-12 w-full max-w-2xl animate-fade-in text-center"><h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.colorMixReady}</h2><div className="bg-white p-4 rounded-2xl shadow-2xl"><img src={cmGeneratedImage} alt="Generated color mix mockup" className="w-full h-auto object-contain rounded-xl" /></div><div className="mt-8 flex flex-col items-center gap-6"><div className="w-full max-w-sm"><label htmlFor="cm-additional-prompt-regen" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.applicationInstructions}</label><textarea id="cm-additional-prompt-regen" value={cmAdditionalPrompt} onChange={(e) => setCmAdditionalPrompt(e.target.value)} placeholder={t.applicationInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={3} disabled={isLoading} />{renderPromptHint()}</div>{renderQualitySlider()}<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full"><button onClick={handleGenerateColorMixKnows} disabled={isLoading} className="w-full sm:w-auto px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{isLoading ? t.generating : t.generateAgain}</button><button onClick={() => handleSaveImage(cmGeneratedImage, 'product-mockup-mix.png')} className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 text-lg"><DownloadIcon className="w-6 h-6 mr-2" />{t.saveImage}</button></div></div></div>)}
                </div>
              )}
              
              {cmKnowsColorsMode === 'batch' && (
                <div className="w-full flex flex-col items-center animate-fade-in">
                   <div className="w-full max-w-5xl mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center"><ImageIcon className="w-6 h-6 mr-2 text-indigo-500 inline-block" /> {t.productViews(MAX_MOCKUPS)}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">{[...Array(MAX_MOCKUPS)].map((_, index) => (<ImageUploader key={index} onImageSelect={(file) => handleCmBatchProductSelect(file, index)} previewUrl={cmBatchProductPreviews[index]} t={t} />))}</div>
                        
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center"><PaletteIcon className="w-6 h-6 mr-2 text-indigo-500 inline-block" /> {t.colorInstructions(MAX_COLOR_MIX_COLORS)}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cmColorInstructions.map((instr, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                              <label className="block text-sm font-bold text-gray-600 mb-2">{t.color} {index + 1}</label>
                              <ImageUploader onImageSelect={(file) => handleCmColorInstructionFile(file, index)} previewUrl={instr.preview} t={t}/>
                              <textarea value={instr.prompt} onChange={(e) => handleCmColorInstructionPrompt(e.target.value, index)} placeholder={t.colorInstructionPlaceholder} className="mt-3 w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm text-sm" rows={3} disabled={isLoading || cmBatchRegeneratingIndex !== null} />
                              {renderPromptHint()}
                            </div>
                          ))}
                        </div>
                   </div>
                   {cmBatchProductFiles.some(f => f) && cmColorInstructions.some(i => i.file && i.prompt) && !cmBatchGeneratedImages.some(i => i) && !isLoading && (
                    <div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-in">
                        {renderQualitySlider()}
                        <button onClick={handleGenerateColorMixBatch} className="mt-2 px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{t.generateAllViews}</button>
                    </div>
                   )}
                   {isLoading && renderLoadingSpinner()}{renderError()}
                   {cmBatchGeneratedImages.some(i => i) && (
                      <div className="mt-12 w-full max-w-5xl animate-fade-in text-center">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.batchReady}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {cmBatchGeneratedImages.map((image, index) => (<div key={index} className="flex flex-col items-center gap-2">{image === 'error' ? (<div className="w-full h-full bg-red-100 border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center p-4 text-red-700 aspect-square"><p className="text-sm font-semibold text-center">{t.generationFailed}</p><button onClick={() => handleRegenerateSingleColorMixBatch(index)} disabled={isLoading || cmBatchRegeneratingIndex !== null} className="mt-2 flex items-center justify-center gap-1 px-4 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full shadow hover:bg-teal-700 transition-colors disabled:bg-gray-400"><RefreshIcon className="w-3 h-3"/>{cmBatchRegeneratingIndex === index ? t.retrying : t.retry}</button></div>) : image ? (<div className="bg-white p-2 rounded-xl shadow-lg w-full"><div className="relative"><img src={image} alt={`Generated mockup ${index + 1}`} className="w-full h-auto object-contain rounded-lg" />{cmBatchRegeneratingIndex === index && (<div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg"><div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>)}</div><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={() => handleSaveImage(image, `mockup-mix-${index+1}.png`)} className="flex items-center justify-center gap-1 px-2 py-2 bg-green-600 text-white text-xs font-semibold rounded-full shadow hover:bg-green-700 transition-colors"><DownloadIcon className="w-3 h-3" />{t.save}</button><button onClick={() => handleRegenerateSingleColorMixBatch(index)} disabled={isLoading || cmBatchRegeneratingIndex !== null} className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-600 text-white text-xs font-semibold rounded-full shadow hover:bg-gray-700 transition-colors disabled:bg-gray-400"><RefreshIcon className="w-3 h-3" />{t.regen}</button></div></div>) : cmBatchProductFiles[index] ? (<div className="w-full aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center"><p className="text-xs text-gray-500">{t.notGenerated}</p></div>) : null}</div>))}
                        </div>
                        <div className="mt-8 w-full max-w-md flex flex-col items-center gap-6 mx-auto">
                            {renderQualitySlider()}
                            <button onClick={handleGenerateColorMixBatch} disabled={isLoading || cmBatchRegeneratingIndex !== null} className="mt-2 px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{isLoading ? t.generating : t.generateAgain}</button>
                        </div>
                      </div>
                   )}
                </div>
              )}
            </div>
          )}

          {colorMixMode === 'needsHelp' && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <button onClick={() => { setColorMixMode('selection'); setCmGeneratedImage(null); setError(null);}} className="flex items-center gap-2 text-sm mb-6 font-semibold text-teal-600 hover:text-teal-800 transition-colors self-start">
                  <ChevronLeftIcon className="w-5 h-5" /> {t.backToColorMix}
              </button>
              <div className="w-full max-w-5xl mb-8">
                <div className="flex flex-col items-center mb-10"><h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><ImageIcon className="w-6 h-6 mr-2 text-indigo-500" /> {t.productMockup}</h2><ImageUploader onImageSelect={handleCmProductSelect} previewUrl={cmProductPreview} t={t} /></div>
                <div className="w-full max-w-md mx-auto flex flex-col gap-6">
                    <div><label htmlFor="num-colors" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.howManyColors}</label><div className="flex justify-center gap-4">{[2, 3].map(num => <button key={num} onClick={() => setCmNumColors(num)} className={`px-6 py-2 rounded-full font-semibold transition-all ${cmNumColors === num ? 'bg-teal-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>{t.colors(num)}</button>)}</div></div>
                    <div><label htmlFor="context-prompt" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.describeContext}</label><textarea id="context-prompt" value={cmContextPrompt} onChange={(e) => setCmContextPrompt(e.target.value)} placeholder={t.describeContextPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={3} disabled={isLoading} />{renderPromptHint()}</div>
                    <div><label htmlFor="grouping-prompt" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.groupingInstructions}</label><textarea id="grouping-prompt" value={cmGroupingPrompt} onChange={(e) => setCmGroupingPrompt(e.target.value)} placeholder={t.groupingInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={2} disabled={isLoading} />{renderPromptHint()}</div>
                </div>
              </div>
              {cmProductPreview && !cmGeneratedImage && !isLoading && (cmContextPrompt) && (<div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-in">{renderQualitySlider()}<button onClick={handleGenerateColorMixHelp} className="mt-2 px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{t.generateColorMix}</button></div>)}
              {isLoading && renderLoadingSpinner()}{renderError()}
              {cmGeneratedImage && (<div className="mt-12 w-full max-w-2xl animate-fade-in text-center"><h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.colorMixReady}</h2><div className="bg-white p-4 rounded-2xl shadow-2xl"><img src={cmGeneratedImage} alt="Generated color mix mockup" className="w-full h-auto object-contain rounded-xl" /></div><div className="mt-8 flex flex-col items-center gap-6"><div className="w-full max-w-md mx-auto flex flex-col gap-6"><div><label htmlFor="context-prompt-regen" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.describeContext}</label><textarea id="context-prompt-regen" value={cmContextPrompt} onChange={(e) => setCmContextPrompt(e.target.value)} placeholder={t.describeContextPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={3} disabled={isLoading} />{renderPromptHint()}</div><div><label htmlFor="grouping-prompt-regen" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t.groupingInstructions}</label><textarea id="grouping-prompt-regen" value={cmGroupingPrompt} onChange={(e) => setCmGroupingPrompt(e.target.value)} placeholder={t.groupingInstructionsPlaceholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm" rows={2} disabled={isLoading} />{renderPromptHint()}</div></div>{renderQualitySlider()}<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full"><button onClick={handleGenerateColorMixHelp} disabled={isLoading} className="w-full sm:w-auto px-10 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 text-lg">{isLoading ? t.generating : t.generateAgain}</button><button onClick={() => handleSaveImage(cmGeneratedImage, 'product-mockup-mix.png')} className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 text-lg"><DownloadIcon className="w-6 h-6 mr-2" />{t.saveImage}</button></div></div></div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;