import React from "react";
import { AlertTriangle } from "lucide-react";

type RejectionCardProps = {
  title: string;
  reason?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const RejectionCard = ({
  title,
  reason,
  actionLabel = "Update Details",
  onAction,
}: RejectionCardProps) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-100 backdrop-blur-sm p-5 sm:p-6 shadow-md">
      
      <div className="flex items-start gap-4">
        
        {/* Icon */}
        <div className="flex-shrink-0 rounded-full bg-white p-2.5 text-red-600 shadow-sm">
          <AlertTriangle className="text-red-500" size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          
          <h3 className="text-base sm:text-lg font-semibold text-black">
            {title}
          </h3>

          <p className="text-sm text-red-700 leading-relaxed">
            {reason?.trim() ||
              "Your onboarding was rejected. Please review and update your details."}
          </p>

          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 active:scale-95"
            >
              {actionLabel}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default RejectionCard;