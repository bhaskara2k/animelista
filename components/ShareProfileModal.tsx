import React, { useRef, useState, useMemo } from 'react';
import Modal from './Modal';
import { PublicUser, StatisticsData, Anime } from '../types';
import * as GamificationService from '../services/GamificationService';
import { ArrowDownTrayIcon, CheckIcon, SparklesIcon, EyeIcon, StarIcon, ClockIcon } from './Icons';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: PublicUser;
  stats?: StatisticsData | null;
  animes?: Anime[];
}

const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  stats,
  animes = [],
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // User rank title
  const currentRank = useMemo(() => {
    const rankObj = GamificationService.getRankForLevel(user.level || 1);
    return rankObj.title;
  }, [user.level]);

  // Top 3 favorite / highest rated animes
  const topAnimes = useMemo(() => {
    return animes
      .filter(a => a.imageUrl)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [animes]);

  // Calculate time watched
  const timeWatched = useMemo(() => {
    const totalEpisodes = stats?.totalEpisodesWatched || 0;
    const totalMinutes = totalEpisodes * 24;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    return `${days}d ${hours}h`;
  }, [stats?.totalEpisodesWatched]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // High-resolution Canvas generator for crisp download
  const handleDownloadCard = () => {
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // 4:5 Instagram / Social aspect ratio
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // 1. Background with radial dark gradients
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#020617');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Subtle glow circles
    const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 600);
    glow1.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 1350);

    const glow2 = ctx.createRadialGradient(880, 1150, 10, 880, 1150, 600);
    glow2.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Card Border & Glass panel outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1270);

    // 3. Top Branding Header
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ANIMELISTA', 80, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PASSEPORTE OTAKU', 80, 155);

    // 4. User Info Section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(user.username, 80, 260);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`NÍVEL ${user.level || 1} • ${currentRank.toUpperCase()}`, 80, 310);

    // 5. KPI Stats Grid (4 boxes)
    const kpis = [
      { label: 'ANIMES', val: String(stats?.totalAnimes || animes.length || 0) },
      { label: 'EPISÓDIOS', val: String(stats?.totalEpisodesWatched || 0) },
      { label: 'TEMPO GASTO', val: timeWatched },
      { label: 'NOTA MÉDIA', val: stats?.averageRating ? `${stats.averageRating.toFixed(1)} ★` : 'N/A' },
    ];

    const boxW = 440;
    const boxH = 140;
    const boxGap = 40;
    const startX = 80;
    const startY = 380;

    kpis.forEach((kpi, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (boxW + boxGap);
      const y = startY + row * (boxH + 30);

      // Box background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 16);
      ctx.fill();
      ctx.stroke();

      // Box labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(kpi.label, x + 30, y + 48);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(kpi.val, x + 30, y + 105);
    });

    // 6. Section "Destaques da Coleção"
    const topY = 760;
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('DESTAQUES DA COLEÇÃO', 80, topY);

    if (topAnimes.length > 0) {
      const coverW = 280;
      const coverH = 380;
      const coverGap = 40;

      let loadedImages = 0;
      topAnimes.forEach((anime, i) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = anime.imageUrl || '';
        img.onload = () => {
          const imgX = 80 + i * (coverW + coverGap);
          const imgY = topY + 40;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(imgX, imgY, coverW, coverH, 16);
          ctx.clip();
          ctx.drawImage(img, imgX, imgY, coverW, coverH);
          ctx.restore();

          loadedImages++;
          if (loadedImages === topAnimes.length) {
            finishExport();
          }
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === topAnimes.length) {
            finishExport();
          }
        };
      });

      // Fallback timeout in case image loading hangs
      setTimeout(() => finishExport(), 1500);
    } else {
      finishExport();
    }

    function finishExport() {
      // 7. Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '22px sans-serif';
      ctx.fillText('Acompanhe seus animes em animelista.app', 80, 1260);

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `animelista_${user.username}_card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartilhar Perfil">
      <div className="flex flex-col items-center gap-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Visual Card Preview */}
        <div
          ref={cardRef}
          className="w-full max-w-sm rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col justify-between aspect-[4/5]"
        >
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top */}
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-xs font-black tracking-widest text-sky-400 uppercase">AnimeLista</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Passaporte Otaku</p>
              </div>
              <SparklesIcon className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-600 to-purple-600 flex items-center justify-center text-xl font-black shadow-lg ring-2 ring-white/20">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-white leading-tight">{user.username}</h3>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                  <span>Nível {user.level || 1}</span>
                  <span className="text-gray-500">•</span>
                  <span>{currentRank}</span>
                </span>
              </div>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-gray-400">Animes</p>
                <p className="text-lg font-black text-white">{stats?.totalAnimes || animes.length || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-gray-400">Episódios</p>
                <p className="text-lg font-black text-white">{stats?.totalEpisodesWatched || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-gray-400">Tempo Gasto</p>
                <p className="text-lg font-black text-amber-300">{timeWatched}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <p className="text-[10px] uppercase font-bold text-gray-400">Nota Média</p>
                <p className="text-lg font-black text-white">
                  {stats?.averageRating ? `${stats.averageRating.toFixed(1)} ★` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Top 3 Animes Covers */}
            {topAnimes.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 tracking-wider">
                  Destaques da Coleção
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {topAnimes.map((anime) => (
                    <img
                      key={anime.id}
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg shadow-md ring-1 ring-white/10"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom */}
          <div className="relative z-10 pt-3 border-t border-white/5 text-center">
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
              animelista.app • Seu universo de animes
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-2.5">
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="w-full bg-accent-600 hover:bg-accent-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-accent-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <span>Gerando Imagem HD...</span>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Baixar Card em Alta Resolução (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full bg-surface-secondary hover:bg-surface-hover text-text-primary font-semibold py-2.5 px-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isCopied ? (
              <>
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copiado!</span>
              </>
            ) : (
              <>
                <span>Copiar Link do Perfil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProfileModal;
