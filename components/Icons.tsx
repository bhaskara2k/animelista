

import React from 'react';

// Helper component for Material Symbols
export const MaterialSymbol: React.FC<{ iconName: string; className?: string; filled?: boolean, weight?: number, grade?: number, opticalSize?: number }> =
  ({ iconName, className, filled, weight, grade, opticalSize }) => {
    const style: React.CSSProperties = {};
    if (filled !== undefined || weight !== undefined || grade !== undefined || opticalSize !== undefined) {
      style.fontVariationSettings = [
        filled !== undefined ? `'FILL' ${filled ? 1 : 0}` : null,
        weight !== undefined ? `'wght' ${weight}` : null,
        grade !== undefined ? `'GRAD' ${grade}` : null,
        opticalSize !== undefined ? `'opsz' ${opticalSize}` : null,
      ].filter(Boolean).join(', ');
    }
    return (
      <span className={`material-symbols-outlined ${className || ''}`} style={style} aria-hidden="true">
        {iconName}
      </span>
    );
  };

export const PlusIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="add" className={className} opticalSize={opticalSize} />
);

export const PencilIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="edit" className={className} opticalSize={opticalSize} />
);

export const TrashIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="delete" className={className} opticalSize={opticalSize} />
);

export const ChevronDownIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="expand_more" className={className} opticalSize={opticalSize} />
);

export const ChevronUpIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="expand_less" className={className} opticalSize={opticalSize} />
);

export const XMarkIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="close" className={className} opticalSize={opticalSize} />
);

export const CheckIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="check" className={className} weight={600} opticalSize={opticalSize} />
);

export const MinusIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="remove" className={className} opticalSize={opticalSize} />
);

export const EyeIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="visibility" className={className} opticalSize={opticalSize} />
);

export const CalendarDaysIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="calendar_month" className={className} opticalSize={opticalSize} />
);

export const ListBulletIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="list" className={className} opticalSize={opticalSize} />
);

export const ChevronLeftIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="chevron_left" className={className} opticalSize={opticalSize} />
);

export const ChevronRightIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="chevron_right" className={className} opticalSize={opticalSize} />
);

export const StarIcon: React.FC<{ className?: string; filled?: boolean, opticalSize?: number }> = ({ className = "w-5 h-5", filled, opticalSize }) => (
  <MaterialSymbol iconName={filled ? "star" : "star_border"} className={className} filled={filled} opticalSize={opticalSize !== undefined ? opticalSize : 20} />
);

export const StarHalfIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="star_half" className={className} opticalSize={opticalSize !== undefined ? opticalSize : 20} />
);

export const TrophyIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="emoji_events" className={className} opticalSize={opticalSize} />
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="help_outline" className={className} opticalSize={opticalSize} />
);

export const SearchIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="search" className={className} opticalSize={opticalSize} />
);

export const BellIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="notifications" className={className} opticalSize={opticalSize} />
);

export const BellSlashIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="notifications_off" className={className} opticalSize={opticalSize} />
);

export const BellAlertIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="notification_important" className={className} opticalSize={opticalSize} />
);

export const AdjustmentsHorizontalIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="tune" className={className} opticalSize={opticalSize} />
);

export const ArrowUpIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="arrow_upward" className={className} opticalSize={opticalSize} />
);

export const ArrowDownIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="arrow_downward" className={className} opticalSize={opticalSize} />
);

export const ChartPieIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="pie_chart" className={className} opticalSize={opticalSize} />
);

export const Cog6ToothIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="settings" className={className} opticalSize={opticalSize} />
);

export const ArrowDownTrayIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="download" className={className} opticalSize={opticalSize} />
);

export const ArrowUpTrayIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="upload" className={className} opticalSize={opticalSize} />
);

export const SparklesIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="auto_awesome" className={className} opticalSize={opticalSize} />
);

export const MedalIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="military_tech" className={className} opticalSize={opticalSize} />
);

export const FilmIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="movie" className={className} opticalSize={opticalSize} />
);

export const BookOpenIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="menu_book" className={className} opticalSize={opticalSize} />
);

export const AcademicCapIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="school" className={className} opticalSize={opticalSize} />
);

export const TrendingUpIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="trending_up" className={className} opticalSize={opticalSize} />
);

export const LockClosedIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="lock" className={className} opticalSize={opticalSize} />
);

export const CheckCircleIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="check_circle" className={className} filled opticalSize={opticalSize} />
);

export const LogoutIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="logout" className={className} opticalSize={opticalSize} />
);

export const UsersIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="group" className={className} opticalSize={opticalSize} />
);

export const PlayIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="play_arrow" className={className} filled opticalSize={opticalSize} />
);

export const ArrowRightOnRectangleIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="logout" className={className} opticalSize={opticalSize} />
);

export const UserIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="person" className={className} opticalSize={opticalSize} />
);

export const EnvelopeIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="mail" className={className} opticalSize={opticalSize} />
);

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-6 h-6", opticalSize }) => (
  <MaterialSymbol iconName="chat_bubble" className={className} opticalSize={opticalSize} />
);
