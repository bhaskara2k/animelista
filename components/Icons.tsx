

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

export const ClockIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="schedule" className={className} opticalSize={opticalSize} />
);

export const CalendarPlusIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="calendar_add_on" className={className} opticalSize={opticalSize} />
);

export const ArrowTopRightOnSquareIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-4 h-4", opticalSize }) => (
  <MaterialSymbol iconName="open_in_new" className={className} opticalSize={opticalSize} />
);

export const ShareIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="share" className={className} opticalSize={opticalSize} />
);

export const FireIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="local_fire_department" className={className} opticalSize={opticalSize} />
);

export const BoltIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="bolt" className={className} opticalSize={opticalSize} />
);

export const CrownIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="crown" className={className} opticalSize={opticalSize} />
);

export const ShieldIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="shield" className={className} opticalSize={opticalSize} />
);

export const HeartIcon: React.FC<{ className?: string, opticalSize?: number, filled?: boolean }> = ({ className = "w-5 h-5", opticalSize, filled = true }) => (
  <MaterialSymbol iconName="favorite" className={className} filled={filled} opticalSize={opticalSize} />
);

export const TvIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="tv" className={className} opticalSize={opticalSize} />
);

export const PencilSquareIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="edit_note" className={className} opticalSize={opticalSize} />
);

export const RocketLaunchIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="rocket_launch" className={className} opticalSize={opticalSize} />
);

export const FaceSmileIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="mood" className={className} opticalSize={opticalSize} />
);

export const LanguageIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="translate" className={className} opticalSize={opticalSize} />
);

export const BookmarkIcon: React.FC<{ className?: string, opticalSize?: number, filled?: boolean }> = ({ className = "w-5 h-5", opticalSize, filled = true }) => (
  <MaterialSymbol iconName="bookmark" className={className} filled={filled} opticalSize={opticalSize} />
);

export const MiniLockIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

export const SparkIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export const RadioIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="radio" className={className} opticalSize={opticalSize} />
);

export const MusicalNoteIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="music_note" className={className} opticalSize={opticalSize} />
);

export const SpeakerWaveIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="volume_up" className={className} opticalSize={opticalSize} />
);

export const SpeakerXMarkIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="volume_off" className={className} opticalSize={opticalSize} />
);

export const BackwardIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="skip_previous" className={className} opticalSize={opticalSize} />
);

export const ForwardIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="skip_next" className={className} opticalSize={opticalSize} />
);

export const PauseIcon: React.FC<{ className?: string, opticalSize?: number }> = ({ className = "w-5 h-5", opticalSize }) => (
  <MaterialSymbol iconName="pause" className={className} filled opticalSize={opticalSize} />
);




