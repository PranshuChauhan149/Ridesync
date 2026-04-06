import React, { ReactNode } from "react";

type ActionCardProps = {
  icon: ReactNode;
  title: string;
  button: string;
  onClick: () => void;
  desc?: string;
};

const ActionCard = ({ icon, title, button, onClick, desc }: ActionCardProps) => {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-blue-100 p-2 text-blue-700">{icon}</div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-blue-900 sm:text-lg">{title}</h3>
          {desc ? <p className="mt-2 text-sm text-blue-800">{desc}</p> : null}

          <button 
            type="button"
            onClick={onClick}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
