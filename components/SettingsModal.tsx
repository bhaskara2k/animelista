


import React, { useRef, useState, FormEvent, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, LogoutIcon, CheckIcon, SearchIcon, PencilIcon } from './Icons';
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

const ACCENT_COLOR_OPTIONS: { name: string, value: AccentColorOption, colorClass: string }[] = [
  { name: "Céu (Padrão)", value: "sky", colorClass: "bg-sky-500" },
  { name: "Esmeralda", value: "emerald", colorClass: "bg-emerald-500" },
  { name: "Rosa", value: "rose", colorClass: "bg-rose-500" },
  { name: "Âmbar", value: "amber", colorClass: "bg-amber-500" },
  { name: "Índigo", value: "indigo", colorClass: "bg-indigo-500" },
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

  // --- Profile Details State ---
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  
  useEffect(() => {
    if (currentUser) {
        setBio(currentUser.bio || '');
    }
  }, [currentUser, isOpen]); // Reset on open and when user changes


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (avatarId: string) => {
    try {
      await changeAvatar(avatarId);
    } catch(e) {
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

  const inputClass = "w-full p-2.5 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-md focus:ring-2 focus:ring-[var(--accent-ring)] focus:border-[var(--accent-border)] outline-none transition-colors placeholder-[var(--text-tertiary)] text-[var(--text-primary)] text-sm disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1";
  const radioLabelClass = "ml-2 text-sm text-[var(--text-primary)] cursor-pointer";
  const sectionTitleClass = "text-xl font-semibold text-[var(--accent-text)] mb-4 border-b border-[var(--border-primary)] pb-2";
  const formButtonClass = "w-full sm:w-auto mt-2 px-5 py-2 rounded-md text-white bg-accent-cta hover:bg-accent-cta-hover transition-colors flex items-center justify-center space-x-2 font-semibold text-sm disabled:bg-slate-600";
  
  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações e Personalização" size="4xl">
      <div className="space-y-8">
        
        <section>
          <h3 className={sectionTitleClass}>Aparência</h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Tema da Interface</label>
              <div className="flex space-x-4">
                {(['dark', 'light'] as ThemeOption[]).map(themeValue => (
                  <label key={themeValue} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={themeValue}
                      checked={currentSettings.theme === themeValue}
                      onChange={() => onUpdateSettings({ theme: themeValue })}
                      className="form-radio h-4 w-4 text-[var(--accent-500)] bg-[var(--surface-secondary)] border-[var(--border-secondary)] focus:ring-[var(--accent-ring)]"
                    />
                    <span className={radioLabelClass}>{themeValue === 'dark' ? 'Escuro' : 'Claro'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Cor de Destaque</label>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.name}
                    onClick={() => onUpdateSettings({ accentColor: opt.value })}
                    className={`w-8 h-8 rounded-full ${opt.colorClass} border-2 transition-all
                                ${currentSettings.accentColor === opt.value ? 'border-white ring-2 ring-offset-2 ring-offset-[var(--surface-primary)] ring-white' : 'border-transparent hover:opacity-80'}`}
                    aria-label={`Selecionar cor de destaque: ${opt.name}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Densidade da Lista de Animes</label>
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

        <section>
          <h3 className={sectionTitleClass}>Perfil Público</h3>
          <form onSubmit={handleProfileFormSubmit} className="space-y-6">
              {/* --- Bio --- */}
              <div>
                  <label htmlFor="user-bio" className={labelClass}>Sua Biografia</label>
                  <textarea
                      id="user-bio"
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className={inputClass}
                      placeholder="Fale um pouco sobre você..."
                      maxLength={250}
                  />
                  <p className="text-xs text-text-tertiary text-right">{bio.length}/250</p>
              </div>
              
              <div className="flex justify-end items-center gap-4">
                  {profileSuccess && <p className="text-green-400 text-sm">{profileSuccess}</p>}
                  <button type="submit" className={formButtonClass} disabled={isSavingProfile}>
                      {isSavingProfile ? <LoadingSpinner className="w-5 h-5"/> : <CheckIcon className="w-4 h-4" />}
                      <span>Salvar Perfil</span>
                  </button>
              </div>
          </form>
        </section>

        <section>
          <h3 className={sectionTitleClass}>Conta</h3>
          <div className="space-y-6">
              {/* --- Avatar Selection --- */}
              <div className="p-4 bg-bg-secondary/50 rounded-lg space-y-4">
                  <div className="flex items-center gap-4">
                      <AvatarDisplay avatarId={currentUser?.avatarId} className="w-16 h-16" />
                      <div>
                          <label className={labelClass}>Avatar Atual</label>
                          <p className="text-sm text-text-primary">Escolha um avatar padrão ou busque por um personagem de anime.</p>
                      </div>
                  </div>
                  
                  {/* --- Default Avatars --- */}
                  <div>
                      <label className={labelClass}>Avatares Padrão</label>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                          {AVATAR_OPTIONS.map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleAvatarChange(opt.id)}
                                className={`p-1 rounded-full transition-all duration-200 ${currentUser?.avatarId === opt.id ? 'bg-accent-500/50 ring-2 ring-accent-ring' : 'hover:bg-surface-hover'}`}
                                aria-label={`Selecionar avatar ${opt.id}`}
                              >
                                  <AvatarDisplay avatarId={opt.id} className="w-8 h-8" />
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* --- Character Search for Avatar --- */}
                  <div>
                      <label htmlFor="character-search" className={labelClass}>Buscar Avatar de Personagem</label>
                      <form onSubmit={handleCharacterSearch} className="flex gap-2">
                        <input 
                            id="character-search"
                            type="text"
                            value={characterSearchTerm}
                            onChange={e => setCharacterSearchTerm(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Naruto, Anya Forger..."
                        />
                        <button type="submit" disabled={isSearchingCharacters} className="px-4 py-2 bg-accent-cta hover:bg-accent-cta-hover text-white rounded-md transition-colors flex-shrink-0 disabled:bg-slate-600">
                           {isSearchingCharacters ? <LoadingSpinner className="w-5 h-5"/> : <SearchIcon className="w-5 h-5" />}
                        </button>
                      </form>
                      {characterSearchError && <p className="text-red-400 text-xs mt-2">{characterSearchError}</p>}
                      {characterResults.length > 0 && (
                          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                              {characterResults.map(char => (
                                  <button
                                    key={char.id}
                                    type="button"
                                    onClick={() => handleAvatarChange(char.image.large)}
                                    className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-ring
                                        ${currentUser?.avatarId === char.image.large ? 'ring-2 ring-accent-ring ring-offset-2 ring-offset-bg-secondary' : 'hover:opacity-80'}`}
                                    title={char.name.full}
                                  >
                                      <img src={char.image.large} alt={char.name.full} className="w-full h-full object-cover"/>
                                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                          <CheckIcon className="w-6 h-6 text-white" />
                                      </div>
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              
              {/* --- Change Username --- */}
              <div className="p-4 bg-bg-secondary/50 rounded-lg">
                  <form onSubmit={handleUsernameFormSubmit} className="space-y-3">
                    <label className={labelClass}>Alterar nome de usuário</label>
                    <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Novo nome de usuário" className={inputClass} disabled={isChangingUsername} />
                    <input type="password" value={currentPasswordForUName} onChange={e => setCurrentPasswordForUName(e.target.value)} placeholder="Senha atual" className={inputClass} disabled={isChangingUsername} />
                     {usernameError && <p className="text-red-400 text-xs">{usernameError}</p>}
                     {usernameSuccess && <p className="text-green-400 text-xs">{usernameSuccess}</p>}
                    <div className="flex justify-end">
                      <button type="submit" className={formButtonClass} disabled={isChangingUsername || !newUsername || !currentPasswordForUName}>
                          {isChangingUsername ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckIcon className="w-4 h-4" />}
                          <span>Alterar Nome</span>
                      </button>
                    </div>
                  </form>
              </div>

              {/* --- Change Password --- */}
              <div className="p-4 bg-bg-secondary/50 rounded-lg">
                  <form onSubmit={handlePasswordFormSubmit} className="space-y-3">
                      <label className={labelClass}>Alterar senha</label>
                      <input type="password" value={currentPasswordForPwd} onChange={e => setCurrentPasswordForPwd(e.target.value)} placeholder="Senha atual" className={inputClass} disabled={isChangingPassword} />
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nova senha (mín. 6 caracteres)" className={inputClass} disabled={isChangingPassword} />
                      <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirmar nova senha" className={inputClass} disabled={isChangingPassword} />
                      {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
                      {passwordSuccess && <p className="text-green-400 text-xs">{passwordSuccess}</p>}
                      <div className="flex justify-end">
                          <button type="submit" className={formButtonClass} disabled={isChangingPassword || !newPassword || newPassword !== confirmNewPassword}>
                              {isChangingPassword ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckIcon className="w-4 h-4" />}
                              <span>Alterar Senha</span>
                          </button>
                      </div>
                  </form>
              </div>
          </div>
        </section>


        <section>
          <h3 className={sectionTitleClass}>Gerenciamento de Dados</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Exporte sua lista de animes como um arquivo JSON para backup ou para transferir para outro navegador/dispositivo.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <button
              onClick={onExportData}
              className="w-full flex items-center justify-center px-6 py-3 rounded-md text-white bg-emerald-600 hover:bg-emerald-500 transition-colors space-x-2"
              aria-label="Exportar dados da agenda"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Exportar Dados (.json)</span>
            </button>
            
            <button
              onClick={handleImportClick}
              className="w-full flex items-center justify-center px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-500 transition-colors space-x-2"
              aria-label="Importar dados para a agenda"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>Importar Dados (.json)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <p className="text-xs text-[var(--text-tertiary)] text-center mt-4">
              Lembre-se: A importação substituirá todos os dados atuais da sua agenda.
          </p>
        </section>

        <section>
            <h3 className={sectionTitleClass}>Sessão</h3>
             <p className="text-sm text-[var(--text-secondary)] mb-4">
                Você está logado como <strong className="text-text-primary">{currentUser?.username}</strong>.
            </p>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-500 transition-colors space-x-2"
              aria-label="Sair da conta"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Sair (Logout)</span>
            </button>
        </section>
      </div>
    </Modal>
    </>
  );
};

export default SettingsModal;