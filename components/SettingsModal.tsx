

import React, { useRef, useState, FormEvent, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, LogoutIcon, CheckIcon, SearchIcon, PencilIcon, AdjustmentsHorizontalIcon, SparklesIcon } from './Icons';
import { AppSettings, ThemeOption, AccentColorOption, ListDensityOption, AniListCharacter, Anime, AnimeStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AvatarDisplay, { AVATAR_OPTIONS } from './AvatarDisplay';
import { searchAniListCharacters } from '../services/AniListService';
import LoadingSpinner from './LoadingSpinner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentSettings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  animeList: Anime[];
}

const ACCENT_COLOR_OPTIONS: { name: string, value: AccentColorOption, colorClass: string, gradient: string }[] = [
  { name: "Céu (Padrão)", value: "sky", colorClass: "bg-sky-500", gradient: "from-sky-400 to-blue-600" },
  { name: "Esmeralda", value: "emerald", colorClass: "bg-emerald-500", gradient: "from-emerald-400 to-green-600" },
  { name: "Rosa", value: "rose", colorClass: "bg-rose-500", gradient: "from-rose-400 to-pink-600" },
  { name: "Âmbar", value: "amber", colorClass: "bg-amber-500", gradient: "from-amber-400 to-orange-600" },
  { name: "Índigo", value: "indigo", colorClass: "bg-indigo-500", gradient: "from-indigo-400 to-purple-600" },
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onExportData,
  onImportData,
  currentSettings,
  onUpdateSettings,
  animeList,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout, currentUser, changeAvatar, changeUsername, changePassword, updateProfileDetails } = useAuth();

  const [newUsername, setNewUsername] = useState('');
  const [currentPasswordForUName, setCurrentPasswordForUName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isChangingUsername, setIsChangingUsername] = useState(false);

  const [currentPasswordForPwd, setCurrentPasswordForPwd] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [characterSearchTerm, setCharacterSearchTerm] = useState('');
  const [characterResults, setCharacterResults] = useState<AniListCharacter[]>([]);
  const [isSearchingCharacters, setIsSearchingCharacters] = useState(false);
  const [characterSearchError, setCharacterSearchError] = useState<string | null>(null);

  const [bio, setBio] = useState(currentUser?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || '');
    }
  }, [currentUser, isOpen]);


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (avatarId: string) => {
    try {
      await changeAvatar(avatarId);
    } catch (e) {
      console.error("Failed to change avatar", e);
    }
  };

  const handleCharacterSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (characterSearchTerm.trim().length < 2) {
      setCharacterSearchError("Digite pelo menos 2 caracteres para buscar.");
      setCharacterResults([]);
      return;
    }
    setIsSearchingCharacters(true);
    setCharacterSearchError(null);
    try {
      const results = await searchAniListCharacters(characterSearchTerm);
      setCharacterResults(results);
      if (results.length === 0) {
        setCharacterSearchError("Nenhum personagem encontrado.");
      }
    } catch (err: any) {
      setCharacterSearchError(err.message || "Falha ao buscar personagens.");
      setCharacterResults([]);
    } finally {
      setIsSearchingCharacters(false);
    }
  };


  const handleUsernameFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');
    if (!newUsername || !currentPasswordForUName) {
      setUsernameError("Todos os campos são obrigatórios.");
      return;
    }
    setIsChangingUsername(true);
    try {
      await changeUsername(newUsername, currentPasswordForUName);
      setUsernameSuccess(`Nome de usuário alterado para ${newUsername} com sucesso!`);
      setNewUsername('');
      setCurrentPasswordForUName('');
    } catch (err: any) {
      setUsernameError(err.message || "Ocorreu um erro.");
    } finally {
      setIsChangingUsername(false);
    }
  };

  const handlePasswordFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPasswordForPwd || !newPassword || !confirmNewPassword) {
      setPasswordError("Todos os campos são obrigatórios.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("As novas senhas não coincidem.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(currentPasswordForPwd, newPassword);
      setPasswordSuccess("Senha alterada com sucesso!");
      setCurrentPasswordForPwd('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || "Ocorreu um erro.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess('');
    try {
      await updateProfileDetails({ bio });
      setProfileSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Failed to save profile details', err);
    } finally {
      setIsSavingProfile(false);
    }
  };


  if (!isOpen) return null;


  const inputClass = "w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 outline-none transition-all placeholder-gray-500 text-white text-sm backdrop-blur-sm hover:bg-black/30 disabled:opacity-50";
  const labelClass = "block text-sm font-bold text-white mb-2 uppercase tracking-wider";
  const sectionTitleClass = "text-2xl font-bold text-white mb-6 flex items-center gap-3";
  const formButtonClass = "w-full sm:w-auto mt-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50 disabled:from-gray-700 disabled:to-gray-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]";
  const cardClass = "p-6 bg-surface-primary/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:border-white/20 transition-all";


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Configurações e Personalização" size="4xl">
        <div className="space-y-8">

          {/* APPEARANCE SECTION */}
          <section className={cardClass}>
            <h3 className={sectionTitleClass}>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              Aparência
            </h3>
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className={labelClass}>🌓 Tema da Interface</label>
                <div className="flex gap-3">
                  {(['dark', 'light'] as ThemeOption[]).map(themeValue => (
                    <label
                      key={themeValue}
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                      ${currentSettings.theme === themeValue
                          ? 'bg-accent-600/20 border-accent-500 shadow-lg shadow-accent-500/20'
                          : 'bg-black/20 border-white/10 hover:border-white/30'
                        }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={themeValue}
                        checked={currentSettings.theme === themeValue}
                        onChange={() => onUpdateSettings({ theme: themeValue })}
                        className="w-5 h-5 text-accent-500 bg-black/40 border-white/20 focus:ring-2 focus:ring-accent-500/50"
                      />
                      <span className="font-bold text-white">{themeValue === 'dark' ? '🌙 Escuro' : '☀️ Claro'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className={labelClass}>🎨 Cor de Destaque</label>
                <div className="flex flex-wrap gap-4">
                  {ACCENT_COLOR_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onUpdateSettings({ accentColor: opt.value })}
                      className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                      ${currentSettings.accentColor === opt.value
                          ? 'bg-white/10 ring-2 ring-white shadow-lg'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${opt.gradient} shadow-lg group-hover:scale-110 transition-transform`} />
                      <span className="text-xs font-medium text-white">{opt.name}</span>
                      {currentSettings.accentColor === opt.value && (
                        <CheckIcon className="absolute top-1 right-1 w-5 h-5 text-white bg-accent-500 rounded-full p-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* List Density */}
              <div>
                <label className={labelClass}>📏 Densidade da Lista</label>
                <select
                  value={currentSettings.listDensity}
                  onChange={(e) => onUpdateSettings({ listDensity: e.target.value as ListDensityOption })}
                  className={inputClass}
                >
                  <option value="compact">Compacta</option>
                  <option value="normal">Normal (Padrão)</option>
                  <option value="spaced">Espaçada</option>
                </select>
              </div>
            </div>
          </section>

          {/* PROFILE SECTION */}
          <section className={cardClass}>
            <h3 className={sectionTitleClass}>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <PencilIcon className="w-6 h-6 text-white" />
              </div>
              Perfil Público
            </h3>
            <form onSubmit={handleProfileFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="user-bio" className={labelClass}>✍️ Sua Biografia</label>
                <textarea
                  id="user-bio"
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className={inputClass}
                  placeholder="Fale um pouco sobre você..."
                  maxLength={250}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-white opacity-70">Compartilhe seus gostos e interesses com outros fãs</p>
                  <p className="text-xs font-bold text-white opacity-60">{bio.length}/250</p>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4">
                {profileSuccess && (
                  <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    {profileSuccess}
                  </p>
                )}
                <button type="submit" className={formButtonClass} disabled={isSavingProfile}>
                  {isSavingProfile ? <LoadingSpinner className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </section>

          {/* ACCOUNT SECTION */}
          <section className={cardClass}>
            <h3 className={sectionTitleClass}>
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <CheckIcon className="w-6 h-6 text-white" />
              </div>
              Conta e Segurança
            </h3>
            <div className="space-y-6">
              {/* Avatar Selection */}
              <div className="p-5 bg-black/20 rounded-xl border border-white/10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <AvatarDisplay avatarId={currentUser?.avatarId} className="w-20 h-20 ring-4 ring-accent-500/30" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-surface-primary"></div>
                  </div>
                  <div>
                    <label className={labelClass}>Avatar Atual</label>
                    <p className="text-sm text-white opacity-70">Escolha um avatar padrão ou busque por um personagem de anime.</p>
                  </div>
                </div>

                {/* Default Avatars */}
                <div>
                  <label className={labelClass}>🎭 Avatares Padrão</label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 p-4 bg-black/20 rounded-xl border border-white/10">
                    {AVATAR_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAvatarChange(opt.id)}
                        className={`p-1.5 rounded-xl transition-all duration-200 transform hover:scale-110
                                  ${currentUser?.avatarId === opt.id
                            ? 'bg-accent-500/30 ring-2 ring-accent-500 shadow-lg'
                            : 'hover:bg-white/10'
                          }`}
                      >
                        <AvatarDisplay avatarId={opt.id} className="w-10 h-10" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Character Search */}
                <div>
                  <label htmlFor="character-search" className={labelClass}>🔍 Buscar Avatar de Personagem</label>
                  <form onSubmit={handleCharacterSearch} className="flex gap-3">
                    <input
                      id="character-search"
                      type="text"
                      value={characterSearchTerm}
                      onChange={e => setCharacterSearchTerm(e.target.value)}
                      className={inputClass}
                      placeholder="Ex: Naruto, Anya Forger..."
                    />
                    <button
                      type="submit"
                      disabled={isSearchingCharacters}
                      className="px-5 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-xl transition-all flex-shrink-0 disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      {isSearchingCharacters ? <LoadingSpinner className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
                    </button>
                  </form>
                  {characterSearchError && <p className="text-red-400 text-sm mt-2 font-medium">{characterSearchError}</p>}
                  {characterResults.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-64 overflow-y-auto custom-scrollbar p-3 bg-black/20 rounded-xl border border-white/10">
                      {characterResults.map(char => (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => handleAvatarChange(char.image.large)}
                          className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-200 transform hover:scale-105
                                        ${currentUser?.avatarId === char.image.large
                              ? 'ring-2 ring-accent-500 shadow-lg shadow-accent-500/30'
                              : 'hover:ring-2 hover:ring-white/30'
                            }`}
                          title={char.name.full}
                        >
                          <img src={char.image.large} alt={char.name.full} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-2 transition-opacity">
                            <CheckIcon className="w-6 h-6 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Change Username */}
              <div className="p-5 bg-black/20 rounded-xl border border-white/10">
                <form onSubmit={handleUsernameFormSubmit} className="space-y-4">
                  <label className={labelClass}>👤 Alterar Nome de Usuário</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Novo nome de usuário"
                    className={inputClass}
                    disabled={isChangingUsername}
                  />
                  <input
                    type="password"
                    value={currentPasswordForUName}
                    onChange={e => setCurrentPasswordForUName(e.target.value)}
                    placeholder="Senha atual para confirmar"
                    className={inputClass}
                    disabled={isChangingUsername}
                  />
                  {usernameError && <p className="text-red-400 text-sm font-medium">{usernameError}</p>}
                  {usernameSuccess && <p className="text-green-400 text-sm font-medium flex items-center gap-2"><CheckIcon className="w-4 h-4" />{usernameSuccess}</p>}
                  <div className="flex justify-end">
                    <button type="submit" className={formButtonClass} disabled={isChangingUsername || !newUsername || !currentPasswordForUName}>
                      {isChangingUsername ? <LoadingSpinner className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
                      <span>Alterar Nome</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password */}
              <div className="p-5 bg-black/20 rounded-xl border border-white/10">
                <form onSubmit={handlePasswordFormSubmit} className="space-y-4">
                  <label className={labelClass}>🔒 Alterar Senha</label>
                  <input type="password" value={currentPasswordForPwd} onChange={e => setCurrentPasswordForPwd(e.target.value)} placeholder="Senha atual" className={inputClass} disabled={isChangingPassword} />
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nova senha (mín. 6 caracteres)" className={inputClass} disabled={isChangingPassword} />
                  <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirmar nova senha" className={inputClass} disabled={isChangingPassword} />
                  {passwordError && <p className="text-red-400 text-sm font-medium">{passwordError}</p>}
                  {passwordSuccess && <p className="text-green-400 text-sm font-medium flex items-center gap-2"><CheckIcon className="w-4 h-4" />{passwordSuccess}</p>}
                  <div className="flex justify-end">
                    <button type="submit" className={formButtonClass} disabled={isChangingPassword || !newPassword || newPassword !== confirmNewPassword}>
                      {isChangingPassword ? <LoadingSpinner className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
                      <span>Alterar Senha</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>


          {/* DATA MANAGEMENT SECTION */}
          <section className={cardClass}>
            <h3 className={sectionTitleClass}>
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
              </div>
              Gerenciamento de Dados
            </h3>
            <p className="text-sm text-white opacity-70 mb-6 leading-relaxed">
              Exporte sua lista de animes como um arquivo JSON para backup ou para transferir para outro navegador/dispositivo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={onExportData}
                className="group flex items-center justify-center px-6 py-4 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition-all duration-200 gap-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <ArrowDownTrayIcon className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                <span>Exportar Dados</span>
              </button>

              <button
                onClick={handleImportClick}
                className="group flex items-center justify-center px-6 py-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 gap-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <ArrowUpTrayIcon className="w-6 h-6 group-hover:translate-y-[-4px] transition-transform" />
                <span>Importar Dados</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onImportData}
                accept=".json"
                className="hidden"
              />
            </div>
            <p className="text-xs text-white opacity-80 text-center mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              ⚠️ A importação substituirá todos os dados atuais da sua agenda.
            </p>
          </section>

          {/* SESSION SECTION */}
          <section className={cardClass}>
            <h3 className={sectionTitleClass}>
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                <LogoutIcon className="w-6 h-6 text-white" />
              </div>
              Sessão
            </h3>
            <p className="text-sm text-white opacity-70 mb-6">
              Você está logado como <strong className="text-white font-bold">{currentUser?.username}</strong>.
            </p>
            <button
              onClick={logout}
              className="group w-full flex items-center justify-center px-6 py-4 rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all duration-200 gap-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <LogoutIcon className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" />
              <span>Sair (Logout)</span>
            </button>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default SettingsModal;