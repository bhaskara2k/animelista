import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  RadioTrack, 
  LIVE_RADIO_STATIONS, 
  ICONIC_OPENINGS, 
  searchAnimeOpenings 
} from '../services/animeRadioService';
import { Anime } from '../types';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon, 
  RadioIcon, 
  MusicalNoteIcon, 
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  SparklesIcon,
  FireIcon
} from './Icons';

interface AnimeRadioPlayerProps {
  userAnimeList?: Anime[];
  initialAnimeToPlay?: string | null;
  onClearInitialAnime?: () => void;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
}

export const AnimeRadioPlayer: React.FC<AnimeRadioPlayerProps> = ({
  userAnimeList = [],
  initialAnimeToPlay,
  onClearInitialAnime,
  isOpen,
  onToggleOpen,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Player state
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('animelista_radio_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Active view tab inside player
  const [activeTab, setActiveTab] = useState<'legendary' | 'stations' | 'search' | 'my_list'>('legendary');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<RadioTrack[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Category filter in legendary tab
  const [legendaryFilter, setLegendaryFilter] = useState<'all' | 'black_clover' | 'shonen' | 'recent'>('all');

  // Filtered legendary openings
  const filteredLegendaryTracks = useMemo(() => {
    if (legendaryFilter === 'black_clover') {
      return ICONIC_OPENINGS.filter(t => t.animeTitle.toLowerCase().includes('black clover'));
    }
    if (legendaryFilter === 'shonen') {
      return ICONIC_OPENINGS.filter(t => 
        ['naruto', 'one piece', 'bleach', 'hunter x hunter', 'dragon ball', 'shingeki', 'jujutsu']
          .some(s => t.animeTitle.toLowerCase().includes(s))
      );
    }
    if (legendaryFilter === 'recent') {
      return ICONIC_OPENINGS.filter(t => 
        ['solo leveling', 'frieren', 'oshi no ko', 'chainsaw man', 'demon slayer']
          .some(s => t.animeTitle.toLowerCase().includes(s))
      );
    }
    return ICONIC_OPENINGS;
  }, [legendaryFilter]);

  // Combined playlist for next/prev navigation
  const currentPlaylist = useMemo<RadioTrack[]>(() => {
    if (activeTab === 'stations') return LIVE_RADIO_STATIONS;
    if (activeTab === 'search') return searchResults.length > 0 ? searchResults : filteredLegendaryTracks;
    return filteredLegendaryTracks;
  }, [activeTab, searchResults, filteredLegendaryTracks]);

  // Play a specific track
  const handlePlayTrack = useCallback((track: RadioTrack) => {
    setCurrentTrack(track);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(err => {
        console.warn('Playback error or interrupted:', err);
        setIsLoading(false);
      });
    }

    // Update MediaSession API for lockscreen controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.animeTitle,
        artwork: track.coverUrl ? [{ src: track.coverUrl, sizes: '512x512', type: 'image/jpeg' }] : []
      });
    }
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack) {
      // Pick first track from current tab
      const first = currentPlaylist[0] || ICONIC_OPENINGS[0];
      if (first) handlePlayTrack(first);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Next / Previous
  const handleNext = () => {
    if (!currentTrack || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    handlePlayTrack(currentPlaylist[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentTrack || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    handlePlayTrack(currentPlaylist[prevIndex]);
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem('animelista_radio_volume', newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  // Seek
  const handleSeek = (newTime: number) => {
    if (audioRef.current && !currentTrack?.isLiveRadio) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Turn off and close
  const handleStopAndClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    onToggleOpen(false);
    setIsMinimized(false);
  };

  // Trigger search on AnimeThemes API
  const handlePerformSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsSearching(true);
    const results = await searchAnimeOpenings(term);
    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle request to play opening of an anime from another screen
  useEffect(() => {
    if (initialAnimeToPlay) {
      onToggleOpen(true);
      setIsMinimized(false);
      setActiveTab('search');
      setSearchQuery(initialAnimeToPlay);
      handlePerformSearch(initialAnimeToPlay).then(results => {
        if (results && results.length > 0) {
          handlePlayTrack(results[0]);
        }
      });
      if (onClearInitialAnime) onClearInitialAnime();
    }
  }, [initialAnimeToPlay, handlePlayTrack, onToggleOpen, onClearInitialAnime]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Setup mediaSession action handlers
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
    }
  }, [handleNext, handlePrev]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Don't render anything if closed and not playing
  if (!isOpen && !isPlaying) {
    return (
      <audio
        ref={audioRef}
        referrerPolicy="no-referrer"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        referrerPolicy="no-referrer"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* ========================================================== */}
      {/* 1. FLOATING LAUNCHER PILL (When Minimized or Tab Closed)    */}
      {/* ========================================================== */}
      {isMinimized && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
          <div 
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-xl border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.35)] cursor-pointer hover:border-purple-400 hover:scale-105 transition-all group"
          >
            {/* Visualizer / Vinyl Icon */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
              {currentTrack?.coverUrl ? (
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '6s' }}
                />
              ) : (
                <MusicalNoteIcon className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Track Info Preview */}
            <div className="max-w-[130px] sm:max-w-[180px] truncate text-left">
              <div className="text-xs font-bold text-white truncate">
                {currentTrack ? currentTrack.title : 'Rádio Anime'}
              </div>
              <div className="text-[10px] text-purple-300 font-mono truncate">
                {currentTrack ? currentTrack.animeTitle : 'Pressione para abrir'}
              </div>
            </div>

            {/* Quick Play/Pause button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all"
              title={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isPlaying ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Expand Arrow */}
            <button
              onClick={() => setIsMinimized(false)}
              className="text-slate-400 group-hover:text-white transition-colors"
              title="Expandir Player"
            >
              <ChevronUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. EXPANDED FULL DOCKED PLAYER                             */}
      {/* ========================================================== */}
      {!isMinimized && isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-4 max-w-5xl mx-auto animate-fade-in-up">
          <div className="relative rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] p-4 sm:p-5 flex flex-col gap-4 overflow-hidden">
            {/* Top decorative glow lines */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-cyan-500 opacity-70" />

            {/* Top Bar: Tabs & Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('legendary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'legendary'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FireIcon className="w-3.5 h-3.5" />
                  <span>Aberturas Épicas</span>
                </button>

                <button
                  onClick={() => setActiveTab('stations')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'stations'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <RadioIcon className="w-3.5 h-3.5" />
                  <span>Rádios 24/7</span>
                </button>

                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'search'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <SearchIcon className="w-3.5 h-3.5" />
                  <span>Buscar Anime</span>
                </button>
              </div>

              {/* Action Buttons: Minimize & Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimizar Player"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStopAndClose}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Desligar e Fechar"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Playlist Selection */}
            <div className="max-h-36 sm:max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 space-y-2">
              {/* Tab 1: Legendary Openings */}
              {activeTab === 'legendary' && (
                <div className="space-y-2.5">
                  {/* Category sub-filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'all', label: 'Todas as Aberturas' },
                      { id: 'black_clover', label: '🍀 Black Clover (OP 1-13)' },
                      { id: 'shonen', label: '⚔️ Clássicos Shonen' },
                      { id: 'recent', label: '🔥 Sucessos Recentes' },
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setLegendaryFilter(btn.id as any)}
                        className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          legendaryFilter === btn.id
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Openings Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredLegendaryTracks.map(track => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => handlePlayTrack(track)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-purple-600/30 border-purple-500 shadow-md shadow-purple-500/20'
                              : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10 relative">
                            {track.coverUrl ? (
                              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">🎵</div>
                            )}
                            {isCurrent && isPlaying && (
                              <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-xs flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <div className={`text-xs font-bold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                              {track.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {track.artist} &bull; <span className="text-slate-300">{track.animeTitle}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: 24/7 Live Web Radio Stations */}
              {activeTab === 'stations' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {LIVE_RADIO_STATIONS.map(station => {
                    const isCurrent = currentTrack?.id === station.id;
                    return (
                      <div
                        key={station.id}
                        onClick={() => handlePlayTrack(station)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-cyan-600/30 border-cyan-400 shadow-lg shadow-cyan-500/25'
                            : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 border border-cyan-500/40 text-cyan-300">
                          <RadioIcon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <div className={`text-xs font-extrabold truncate ${isCurrent ? 'text-cyan-300' : 'text-white'}`}>
                              {station.title}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                            {station.artist}
                          </div>
                          <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                            Stream Contínuo Ao Vivo
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Search Any Anime Themes */}
              {activeTab === 'search' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePerformSearch(searchQuery)}
                        placeholder="Digite qualquer anime (ex: Black Clover, DanDaDan, Bleach)..."
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={() => handlePerformSearch(searchQuery)}
                      disabled={isSearching}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {searchResults.map(track => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayTrack(track)}
                            className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                              isCurrent
                                ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20'
                                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10">
                              {track.coverUrl ? (
                                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">🎵</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-center gap-1">
                                <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                                  track.type === 'ED' ? 'bg-indigo-500/30 text-indigo-300' : 'bg-amber-500/30 text-amber-300'
                                }`}>
                                  {track.slug || track.type}
                                </span>
                                <div className="text-xs font-bold text-white truncate">
                                  {track.title}
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {track.artist} &bull; <span className="text-slate-300">{track.animeTitle}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : searchQuery && !isSearching ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Nenhuma abertura encontrada para "{searchQuery}". Tente o nome em inglês ou japonês!
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* BOTTOM CONTROLLER BAR: Current Track, Scrubber & Controls */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Left: Track Info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-purple-500/40 shadow-md">
                  {currentTrack?.coverUrl ? (
                    <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-cyan-700 text-white">
                      <MusicalNoteIcon className="w-6 h-6" />
                    </div>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 max-w-[200px] sm:max-w-[240px]">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentTrack ? currentTrack.title : 'Escolha uma música para começar'}
                  </div>
                  <div className="text-[11px] text-purple-300 truncate font-medium">
                    {currentTrack ? `${currentTrack.artist} — ${currentTrack.animeTitle}` : 'Player em Pausa'}
                  </div>
                </div>
              </div>

              {/* Center: Playback Controls & Progress Bar */}
              <div className="flex flex-col items-center gap-1.5 w-full sm:w-80">
                {/* Control buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Anterior"
                  >
                    <BackwardIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? 'Pausar' : 'Tocar'}
                  >
                    {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Próxima"
                  >
                    <ForwardIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrubber / Progress Bar (for non-live audio) */}
                {!currentTrack?.isLiveRadio ? (
                  <div className="flex items-center gap-2 w-full text-[10px] text-slate-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <span>{formatTime(duration)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>TRANSMISSÃO AO VIVO 24/7</span>
                  </div>
                )}
              </div>

              {/* Right: Volume Control */}
              <div className="flex items-center gap-2 text-slate-400 w-full sm:w-auto justify-end">
                <button
                  onClick={toggleMute}
                  className="hover:text-white transition-colors p-1"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted || volume === 0 ? (
                    <SpeakerXMarkIcon className="w-4 h-4 text-red-400" />
                  ) : (
                    <SpeakerWaveIcon className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeRadioPlayer;
