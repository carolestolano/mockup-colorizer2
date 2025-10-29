import React from 'react';
import { CloseIcon, MagicWandIcon, ColorSwatchIcon, UserIcon } from './icons';

interface InstructionManualProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const InstructionManual: React.FC<InstructionManualProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <aside
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">{t.manualTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 text-gray-700 space-y-6">
          <p className="text-base">{t.manualIntro}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MagicWandIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-gray-900">{t.manualFeature1Title}</h3>
            </div>
            <p>{t.manualFeature1Desc}</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li dangerouslySetInnerHTML={{ __html: t.manualFeature1a }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualFeature1b }} />
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ColorSwatchIcon className="w-8 h-8 text-teal-500 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-gray-900">{t.manualFeature2Title}</h3>
            </div>
            <p>{t.manualFeature2Desc}</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li dangerouslySetInnerHTML={{ __html: t.manualFeature2a }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualFeature2b }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualFeature2c }} />
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-gray-900">{t.manualUserAccountsTitle}</h3>
            </div>
            <p>{t.manualUserAccountsDesc}</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{t.manualGeneralTitle}</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li dangerouslySetInnerHTML={{ __html: t.manualTip1 }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualTip2 }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualTip3 }} />
              <li dangerouslySetInnerHTML={{ __html: t.manualTip4 }} />
            </ul>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default InstructionManual;