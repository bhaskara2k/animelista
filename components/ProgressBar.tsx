
import React from 'react';

interface ProgressBarProps {
  current: number;
  total?: number;
  showPercentageText?: boolean;
  barHeight?: string;
  textClassName?: string;
  wrapperClassName?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showPercentageText = false,
  barHeight = "h-2.5",
  textClassName = "text-xs text-text-primary", // Use theme variable
  wrapperClassName = "",
}) => {
  const anEffectiveTotal = total !== undefined && total > 0 ? total : 0;
  const percentage = anEffectiveTotal > 0 ? Math.min(Math.max(0, (current / anEffectiveTotal) * 100), 100) : 0;

  return (
    <div className={`flex items-center space-x-2 ${wrapperClassName}`}>
      <div 
        className={`flex-grow bg-bg-tertiary rounded-full ${barHeight} my-1 overflow-hidden`} // Use theme variable
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={anEffectiveTotal || 100}
        aria-label={`Progresso: ${current} de ${anEffectiveTotal > 0 ? anEffectiveTotal : 'desconhecido'}`}
      >
        <div
          className={`bg-[var(--accent-500)] ${barHeight} rounded-full transition-all duration-500 ease-out`} // Use accent variable
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentageText && (
        <span className={`${textClassName} w-10 text-right shrink-0`}>
          {`${percentage.toFixed(0)}%`}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
