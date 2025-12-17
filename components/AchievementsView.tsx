import React, { useState } from 'react';
import { UserAchievement, AchievementDefinition, AchievementTier } from '../types';
import ProgressBar from './ProgressBar';
import { LockClosedIcon, CheckCircleIcon, TrophyIcon, SparklesIcon } from './Icons';

interface AchievementsViewProps {
  userAchievements: UserAchievement[];
  achievementDefinitions: AchievementDefinition[];
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ userAchievements, achievementDefinitions }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!userAchievements || userAchievements.length === 0 || !achievementDefinitions || achievementDefinitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-primary/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse-subtle">
          <TrophyIcon className="w-12 h-12 text-white" />
        </div>
        <p className="text-2xl font-bold text-white mb-2">Carregando Conquistas...</p>
        <p className="text-white opacity-70">Em breve você verá suas proezas aqui!</p>
      </div>
    );
  }

  // Calculate stats
  const totalAchievements = userAchievements.length;
  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-amber-900/30 p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-amber-500/10 animate-gradient-shift opacity-50"></div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-4 shadow-xl">
            <TrophyIcon className="w-10 h-10 text-white animate-bounce-subtle" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Suas Conquistas
          </h1>

          <p className="text-white opacity-80 mb-6 text-lg">
            Acompanhe seu progresso e celebre suas vitórias!
          </p>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-yellow-400">{unlockedCount}</div>
              <div className="text-sm text-white opacity-70 uppercase tracking-wider">Desbloqueadas</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-white">{totalAchievements}</div>
              <div className="text-sm text-white opacity-70 uppercase tracking-wider">Total</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-emerald-400">{progressPercentage}%</div>
              <div className="text-sm text-white opacity-70 uppercase tracking-wider">Completo</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 transition-all duration-1000 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3">
        {[
          { id: 'all', label: 'Todas', icon: SparklesIcon },
          { id: 'unlocked', label: 'Desbloqueadas', icon: CheckCircleIcon },
          { id: 'locked', label: 'Bloqueadas', icon: LockClosedIcon },
        ].map((btn) => {
          const isActive = filter === btn.id;
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-[1.02]
                ${isActive
                  ? 'bg-gradient-to-r from-accent-600 to-purple-600 text-white shadow-lg shadow-accent-600/20'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
            >
              <Icon className="w-5 h-5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Achievement Categories */}
      <div className="space-y-6">
        {achievementDefinitions.map(category => {
          const categoryUserAchievements = category.tiers.map(tierDef =>
            userAchievements.find(ua => ua.id === tierDef.id)
          ).filter(Boolean) as UserAchievement[];

          const isAnyTierUnlockedInCategory = categoryUserAchievements.some(ua => ua.unlocked);
          const categoryUnlockedCount = categoryUserAchievements.filter(ua => ua.unlocked).length;

          return (
            <div key={category.categoryId} className="bg-surface-primary/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg hover:border-white/20 transition-all">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isAnyTierUnlockedInCategory ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-white/5'}`}>
                    {React.createElement(category.categoryIcon, {
                      className: `w-7 h-7 ${isAnyTierUnlockedInCategory ? 'text-white' : 'text-white opacity-50'}`
                    })}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isAnyTierUnlockedInCategory ? 'text-white' : 'text-white opacity-70'}`}>
                      {category.categoryTitle}
                    </h2>
                    <p className="text-sm text-white opacity-60">
                      {categoryUnlockedCount} de {category.tiers.length} desbloqueadas
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievement Tiers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.tiers.map(tierDef => {
                  const userTierData = userAchievements.find(ua => ua.id === tierDef.id);
                  if (!userTierData) return null;

                  const isUnlocked = userTierData.unlocked;
                  const progress = userTierData.currentProgress || 0;
                  const target = tierDef.target;
                  const IconComponent = tierDef.icon || category.categoryIcon;

                  // Filter logic
                  if (filter === 'unlocked' && !isUnlocked) return null;
                  if (filter === 'locked' && isUnlocked) return null;

                  return (
                    <div
                      key={tierDef.id}
                      className={`group relative p-5 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]
                        ${isUnlocked
                          ? 'bg-gradient-to-br from-emerald-900/40 to-green-900/30 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                          : 'bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/30'
                        }`}
                    >
                      {/* Unlocked Badge */}
                      {isUnlocked && (
                        <div className="absolute top-3 right-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-3 rounded-xl ${isUnlocked ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                          <IconComponent className={`w-8 h-8 ${isUnlocked ? 'text-emerald-400' : 'text-white opacity-50'}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-emerald-300' : 'text-white'}`}>
                            {tierDef.title}
                          </h3>
                          <p className={`text-sm mb-3 ${isUnlocked ? 'text-emerald-400/90' : 'text-white opacity-70'}`}>
                            {tierDef.description}
                          </p>

                          {/* Progress Bar for Locked */}
                          {!isUnlocked && target > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-white opacity-70">Progresso</span>
                                <span className="text-white font-bold">{progress} / {target}</span>
                              </div>
                              <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
                                <div
                                  className="h-full bg-gradient-to-r from-accent-500 to-purple-600 transition-all duration-500"
                                  style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Unlock Date */}
                          {isUnlocked && userTierData.unlockedAt && (
                            <div className="flex items-center gap-2 text-xs text-emerald-400/80 mt-2">
                              <SparklesIcon className="w-3 h-3" />
                              Desbloqueado em {new Date(userTierData.unlockedAt).toLocaleDateString("pt-BR")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Locked Overlay */}
                      {!isUnlocked && (
                        <div className="absolute top-3 right-3">
                          <LockClosedIcon className="w-6 h-6 text-white opacity-30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsView;