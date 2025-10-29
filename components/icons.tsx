
import React from 'react';

// From Heroicons (https://heroicons.com/) - ArrowUpTrayIcon
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

// From Heroicons - ArrowDownTrayIcon
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Custom artist palette icon
export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 10.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 10.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.25 13.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.612 3.287a2.25 2.25 0 0 1 2.138 2.138v.25a2.25 2.25 0 0 0 2.25 2.25h.25a2.25 2.25 0 0 0 2.25-2.25v-.25a2.25 2.25 0 0 1 2.138-2.138 2.25 2.25 0 0 1 2.25 2.25v9.525c0 1.132-.782 2.1-1.875 2.237a23.234 23.234 0 0 1-11.25 0C5.782 17.562 5 16.597 5 15.462V5.537a2.25 2.25 0 0 1 2.25-2.25 2.25 2.25 0 0 1 1.362.5z" />
    </svg>
);

// From Heroicons - PhotoIcon
export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

// From Heroicons - SparklesIcon
export const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

// From Heroicons - RectangleStackIcon
export const CollectionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L12 15.25l5.571-3m-11.142 0L12 6.75l5.571 3M3.255 19.095l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247l.004.002 4.179-2.252a1.125 1.125 0 0 0 0-1.994l-4.179-2.252-.004-.002-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0l-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0l-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0L3.255 4.905a1.125 1.125 0 0 0 0 1.994l4.179 2.252.004.002.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247a1.125 1.125 0 0 0 1.125 0l.416-.247a1.125 1.125 0 0 1 1.125 0l.417.247l.004.002 4.179 2.252a1.125 1.125 0 0 0 0-1.994l-4.179-2.252-.004-.002-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0l-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0l-.417-.247a1.125 1.125 0 0 0-1.125 0l-.416.247a1.125 1.125 0 0 1-1.125 0L3.255 19.095Z" />
    </svg>
);

// From Heroicons - ArrowPathIcon
export const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-11.664 0-3.181 3.183m0 0-3.181-3.183m3.181 3.183L9.348 16.023m-1.423-.001L2.985 19.644M16.023 9.348l4.992 5.304M9.348 16.023l-4.992-5.304m16.015 0a8.25 8.25 0 0 0-11.664 0l-3.181 3.183m11.664 0-3.181 3.183" />
  </svg>
);

// From Heroicons - SwatchIcon
export const ColorSwatchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.6c-.32.32-.502.753-.502 1.202v3.3c0 .45.182.882.502 1.202Zm-1.148 0c-.32.32-.502.753-.502 1.202v3.3c0 .45.182.882.502 1.202a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L2.95 14.6c-.32.32-.502.753-.502 1.202v3.3c0 .45.182.882.502 1.202Zm1.148 0a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.6c-.32.32-.502.753-.502 1.202v3.3c0 .45.182.882.502 1.202Z" />
    </svg>
);

// From Heroicons - ChevronLeftIcon
export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

// From Heroicons - LightBulbIcon
export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.662-2.5-1.72-2.5-3.122V11a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v5.625c0 1.402-1.079 2.46-2.5 3.122Z" />
  </svg>
);

// From Heroicons (Solid) - UserCircleIcon
export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
  </svg>
);

// From Heroicons - ArrowLeftOnRectangleIcon
export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
);

// From Heroicons - ClockIcon
export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// From Heroicons - XMarkIcon
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

// From Heroicons (Solid) - QuestionMarkCircleIcon
export const HelpCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.35-.777-3.24 0-1.152.992-1.152 2.589 0 3.58l.793.692c.712.622 1.258 1.437 1.258 2.427v.75h1.5v-.75c0-1.332-.626-2.55-1.546-3.39l-.793-.691c-.398-.348-.398-.923 0-1.272.398-.347 1.05-.347 1.448 0 .43.375.832.955.832 1.571h1.5c0-1.533-.919-2.922-2.25-3.829Zm-1.628 9.32a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
  </svg>
);

// From Heroicons - GlobeAltIcon
export const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.358 0 2.662-.331 3.757-.932M12 21c-1.358 0-2.662-.331-3.757-.932m0 0A9.007 9.007 0 0 1 12 3c1.358 0 2.662.331 3.757.932m-7.514 0A9.007 9.007 0 0 0 12 3c1.358 0 2.662.331 3.757.932M3 12a9.008 9.008 0 0 1 2.047-5.511m13.906 0A9.008 9.008 0 0 1 21 12m-18 0h18" />
    </svg>
);
