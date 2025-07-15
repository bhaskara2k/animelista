import React from 'react';
import { UserAchievement, AchievementDefinition, AchievementTier } from '../types';
import ProgressBar from './ProgressBar'; // Assuming ProgressBar can show text
import { LockClosedIcon, CheckCircleIcon, MedalIcon } from './Icons'; // Placeholder icons

interface AchievementsViewProps {
  userAchievements: UserAchievement[];
  achievementDefinitions: AchievementDefinition[];
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ userAchievements, achievementDefinitions }) => {
  if (!userAchievements || userAchievements.length === 0 || !achievementDefinitions || achievementDefinitions.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-xl border border-border-primary">
        <MedalIcon className="w-20 h-20 mx-auto text-text-tertiary mb-6" opticalSize={48} />
        <p className="text-2xl text-text-secondary">Carregando Conquistas...</p>
        <p className="text-text-tertiary">Em breve você verá suas proezas aqui!</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 md:p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-accent flex items-center justify-center">
          <MedalIcon className="w-10 h-10 mr-3 text-yellow-400" opticalSize={40} />
          Suas Conquistas
        </h1>
        <p className="text-text-secondary mt-2">Veja seu progresso e as medalhas que você ganhou!</p>
      </div>

      {achievementDefinitions.map(category => {
        // Find user achievements for this category to determine overall category progress feel
        const categoryUserAchievements = category.tiers.map(tierDef => 
            userAchievements.find(ua => ua.id === tierDef.id)
        ).filter(Boolean) as UserAchievement[];

        const isAnyTierUnlockedInCategory = categoryUserAchievements.some(ua => ua.unlocked);
        
        return (
          <div key={category.categoryId} className="bg-surface-primary p-6 rounded-xl shadow-custom-xl">
            <div className="flex items-center mb-6">
              {React.createElement(category.categoryIcon, { className: `w-8 h-8 mr-3 ${isAnyTierUnlockedInCategory ? 'text-accent' : 'text-text-tertiary'}`, opticalSize: 32 })}
              <h2 className={`text-2xl font-semibold ${isAnyTierUnlockedInCategory ? 'text-accent' : 'text-text-secondary'}`}>
                {category.categoryTitle}
              </h2>
            </div>
            
            <div className="space-y-5">
              {category.tiers.map(tierDef => {
                const userTierData = userAchievements.find(ua => ua.id === tierDef.id);
                if (!userTierData) return null; // Should not happen if initialized correctly

                const isUnlocked = userTierData.unlocked;
                const progress = userTierData.currentProgress || 0;
                const target = tierDef.target;
                const IconComponent = tierDef.icon || category.categoryIcon;

                return (
                  <div 
                    key={tierDef.id} 
                    className={`p-4 rounded-lg border transition-all duration-300
                                ${isUnlocked 
                                  ? 'bg-emerald-600/20 border-emerald-500 shadow-emerald-500/10 shadow-md' 
                                  : 'bg-surface-secondary border-border-primary hover:border-border-secondary'}`}
                  >
                    <div className="flex items-start md:items-center space-x-4">
                      <div className={`flex-shrink-0 p-2 rounded-full ${isUnlocked ? 'bg-emerald-500/20' : 'bg-bg-tertiary'}`}>
                        <IconComponent className={`w-7 h-7 ${isUnlocked ? 'text-emerald-400' : 'text-text-tertiary'}`} opticalSize={28} />
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg font-semibold ${isUnlocked ? 'text-emerald-300' : 'text-text-primary'}`}>
                          {tierDef.title}
                        </h3>
                        <p className={`text-sm ${isUnlocked ? 'text-emerald-400/90' : 'text-text-secondary'}`}>
                          {tierDef.description}
                        </p>
                        {!isUnlocked && target > 0 && ( // Ensure target is positive before showing progress bar
                          <div className="mt-2">
                            <ProgressBar
                              current={progress}
                              total={target}
                              showPercentageText={true}
                              barHeight="h-2"
                              textClassName="text-xs text-text-primary"
                            />
                          </div>
                        )}
                         {isUnlocked && userTierData.unlockedAt && (
                          <p className="text-xs text-emerald-400/80 mt-1">
                            Desbloqueado em: {new Date(userTierData.unlockedAt).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isUnlocked ? (
                          <CheckCircleIcon className="w-8 h-8 text-emerald-400" opticalSize={32} />
                        ) : (
                          <LockClosedIcon className="w-8 h-8 text-text-tertiary" opticalSize={32} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementsView;