import React, { useState } from 'react';
import { Maximize2, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface QuestionMediaProps {
  imageUri: string | null | undefined;
  altText?: string;
  allowZoom?: boolean;
}

export function normalizeMediaSrc(uri: string): string {
  if (!uri) return '';
  const trimmed = uri.trim();
  // If raw SVG XML string was provided
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmed)}`;
  }
  // If data:image/svg+xml;utf8, was used instead of charset=utf-8
  if (trimmed.startsWith('data:image/svg+xml;utf8,')) {
    return trimmed.replace('data:image/svg+xml;utf8,', 'data:image/svg+xml;charset=utf-8,');
  }
  return trimmed;
}

export const QuestionMedia: React.FC<QuestionMediaProps> = ({
  imageUri,
  altText = 'Question diagram',
  allowZoom = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!imageUri) return null;

  const normalizedSrc = normalizeMediaSrc(imageUri);

  return (
    <>
      <div className="relative my-3.5 w-full rounded-2xl overflow-hidden border border-purple-200/90 bg-gradient-to-b from-gray-900 via-gray-950 to-black shadow-md group">
        {/* Figure stem badge */}
        <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-white/95 flex items-center gap-1.5 pointer-events-none border border-white/10">
          <ImageIcon className="w-3.5 h-3.5 text-purple-300" />
          <span>Figure in Question Stem</span>
        </div>

        {allowZoom && !hasError && (
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            aria-label="Enlarge media diagram"
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white transition-opacity opacity-85 hover:opacity-100 border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center justify-center p-3 min-h-[170px] max-h-[300px]">
          {hasError ? (
            <div className="p-6 text-center text-gray-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <div className="text-xs font-semibold text-gray-200">{altText}</div>
              <div className="text-[11px] text-gray-400">Figure attachment loaded in question stem</div>
            </div>
          ) : (
            <img
              src={normalizedSrc}
              alt={altText}
              onError={() => {
                // If it failed and was not already normalized, retry
                setHasError(true);
              }}
              draggable={false}
              className="max-h-[270px] w-auto max-w-full object-contain rounded-xl select-none"
            />
          )}
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && !hasError && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-gray-950 p-3 rounded-3xl border border-gray-700 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              aria-label="Close enlarged diagram"
              className="absolute -top-3 -right-3 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg border border-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={normalizedSrc}
              alt={altText}
              draggable={false}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl select-none"
            />
            <p className="text-xs text-gray-300 mt-2 font-mono">{altText}</p>
          </div>
        </div>
      )}
    </>
  );
};
