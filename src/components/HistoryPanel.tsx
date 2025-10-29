import React from 'react';
import type { HistoryItem } from '../types';
import { MagicWandIcon, ColorSwatchIcon, CloseIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onReuseSettings: (item: HistoryItem) => void;
  t: any; // Translation object
}

const getModeInfo = (mode: HistoryItem['mode'], t: any) => {
  switch (mode) {
    case 'mono-single': return { name: t.modeMono, icon: <MagicWandIcon className="w-5 h-5 text-indigo-500" /> };
    case 'mono-batch': return { name: t.modeMonoBatch, icon: <MagicWandIcon className="w-5 h-5 text-indigo-500" /> };
    case 'mix-known-single': return { name: t.modeColorMix, icon: <ColorSwatchIcon className="w-5 h-5 text-teal-500" /> };
    case 'mix-known-batch': return { name: t.modeColorMixBatch, icon: <ColorSwatchIcon className="w-5 h-5 text-teal-500" /> };
    case 'mix-help': return { name: t.modeAiColorMix, icon: <ColorSwatchIcon className="w-5 h-5 text-teal-500" /> };
    default: return { name: t.modeGeneration, icon: null };
  }
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onReuseSettings, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose}>
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{t.historyTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="text-lg font-semibold">{t.historyEmpty}</p>
              <p className="mt-1">{t.historyEmptyHint}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => {
                const modeInfo = getModeInfo(item.mode, t);
                return (
                  <li key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-md">
                    <div className="flex gap-4">
                      <img src={item.generatedImageUrl} alt="Generated mockup thumbnail" className="w-20 h-20 object-cover rounded-md bg-gray-200" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {modeInfo.icon}
                          <h3 className="font-semibold text-gray-800">{modeInfo.name}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                        <button 
                          onClick={() => onReuseSettings(item)}
                          className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {t.reuseSettings}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

export default HistoryPanel;