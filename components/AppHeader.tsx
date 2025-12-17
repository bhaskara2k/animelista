import React, { useState, useEffect } from 'react';
import { User } from '../types';
import AvatarDisplay from './AvatarDisplay';
import { BellIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from './Icons';

interface AppHeaderProps {
    currentUser: User | null;
    scrolled?: boolean;
    onOpenSettings: () => void;
    onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, scrolled = false, onOpenSettings, onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(scrolled);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent ${isScrolled
                ? 'bg-bg-primary/80 backdrop-blur-md border-white/5 py-3 shadow-lg'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <img
                        src="/logo-small.png"
                        alt="Logo"
                        className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg"
                    />
                    <div className={`flex flex-col ${isScrolled ? 'opacity-100' : 'opacity-100'} transition-opacity`}>
                        <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-none">
                            Anime<span className="text-accent-400">Lista</span>
                        </h1>
                        {!isScrolled && currentUser && (
                            <span className="text-xs text-gray-400 font-medium hidden md:block">Bem-vindo de volta, {currentUser.username}</span>
                        )}
                    </div>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-300">Online</span>
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onOpenSettings}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            title="Configurações"
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>

                        <div className="group relative">
                            <button className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-white">{currentUser?.username}</div>
                                    <div className="text-xs text-accent-400">Nível {currentUser?.level || 1}</div>
                                </div>
                                <div className="relative">
                                    <AvatarDisplay avatarId={currentUser?.avatarId} className="w-10 h-10 ring-2 ring-transparent group-hover:ring-accent-500 transition-all rounded-full" />
                                    <div className="absolute -bottom-1 -right-1 bg-bg-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-border-primary text-accent-400 shadow-sm">
                                        {currentUser?.level || 1}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
