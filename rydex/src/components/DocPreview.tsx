import React, { useEffect, useState } from 'react'
import { X } from "lucide-react";

type DocPreviewProps = {
  url?: string;
  label: string;
};

const DocPreview = ({ url, label }: DocPreviewProps) => {
  const [open, setOpen] = useState(false);

  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url || "");
  const isPdf = url?.toLowerCase().endsWith(".pdf");
  const hasFile = Boolean(url);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <>
      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        
        {/* Label */}
        <div className="text-sm font-medium text-gray-700">
          {label}
        </div>

        {/* Preview */}
        <div className="w-full h-52 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          
          {!hasFile ? (
            <span className="text-gray-500 text-sm">No file uploaded</span>
          ) : isImage ? (
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : isPdf ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={label}
            />
          ) : (
            <span className="text-gray-500 text-sm">
              Unsupported file
            </span>
          )}

        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            disabled={!hasFile}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            View Full
          </button>
        </div>

      </div>

      {/* 🔥 Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          
          <div
            className="bg-white rounded-xl w-full max-w-4xl h-[80vh] relative overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close preview"
              className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/95 border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>

            {/* Full Preview */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              
              {isImage ? (
                <img
                  src={url}
                  alt={label}
                  className="max-w-full max-h-full object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  title={label}
                />
              ) : (
                <span>Unsupported file</span>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  )
}

export default DocPreview