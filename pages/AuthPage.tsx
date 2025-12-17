import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon, SparklesIcon, UserIcon, ArrowRightOnRectangleIcon, EnvelopeIcon } from '../components/Icons';
import { supabase } from '../services/supabaseClient';

const inputClass = "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all placeholder-gray-500 text-white font-medium hover:bg-white/10";
const labelClass = "block text-sm font-medium text-gray-300 mb-1.5 ml-1";
const buttonClass = "w-full px-6 py-3.5 rounded-xl text-white bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-500 hover:to-purple-500 shadow-lg shadow-accent-600/30 hover:shadow-accent-600/50 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { login, signup, sendPasswordResetEmail, resetPassword } = useAuth();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('resetPassword');
        setMessage(null);
        setError(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const clearFormAndMessages = () => {
    setError(null);
    setMessage(null);
    setEmail('');
    setUsername('');
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await signup(email, username, password);
      setMessage("Conta criada! Por favor, verifique seu e-mail para confirmação antes de fazer login.");
      setView('login');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setMessage("Se um usuário com este e-mail existir, um link de recuperação foi enviado. Verifique sua caixa de entrada e spam.");
      setView('login');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirmNewPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(newPassword);
      setMessage("Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.");
      setView('login');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };


  const renderContent = () => {
    switch (view) {
      case 'forgotPassword':
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h2>
              <p className="text-gray-400">Digite seu email para receber o link</p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required disabled={isLoading} />
                </div>
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Enviar Link de Recuperação</span>}
              </button>
            </form>
            <div className="mt-8 text-center">
              <button onClick={() => { setView('login'); clearFormAndMessages(); }} className="text-sm text-accent-400 hover:text-accent-300 transition-colors hover:underline">Voltar para o Login</button>
            </div>
          </>
        );
      case 'resetPassword':
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Nova Senha</h2>
              <p className="text-gray-400">Defina sua nova senha de acesso</p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="new-password" className={labelClass}>Nova Senha</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="min. 6 caracteres" required minLength={6} disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-new-password" className={labelClass}>Confirmar Nova Senha</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" id="confirm-new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputClass} placeholder="Repita a senha" required minLength={6} disabled={isLoading} />
                </div>
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !newPassword || newPassword !== confirmNewPassword}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Redefinir Senha</span>}
              </button>
            </form>
          </>
        );
      case 'register':
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Criar Conta</h2>
              <p className="text-gray-400">Junte-se à comunidade otaku</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required autoComplete="email" disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="username" className={labelClass}>Nome de Usuário</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="seu_usuario" required minLength={3} autoComplete="username" disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Senha</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="min. 6 caracteres" required minLength={6} autoComplete="new-password" disabled={isLoading} />
                </div>
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email || !password || !username}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><SparklesIcon className="w-5 h-5" /> <span>Cadastrar</span></>}
              </button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <span className="text-gray-400 text-sm">Já tem uma conta? </span>
              <button onClick={() => { setView('login'); clearFormAndMessages(); }} className="text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors hover:underline">Faça login</button>
            </div>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
              <p className="text-gray-400">Acesse sua agenda de animes</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required autoComplete="email" disabled={isLoading} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
                  <button type="button" onClick={() => { setView('forgotPassword'); clearFormAndMessages(); }} className="text-xs text-accent-400 hover:text-accent-300 hover:underline">Esqueceu a senha?</button>
                </div>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required autoComplete="current-password" disabled={isLoading} />
                </div>
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email || !password}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><ArrowRightOnRectangleIcon className="w-5 h-5" /> <span>Entrar</span></>}
              </button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <span className="text-gray-400 text-sm">Não tem uma conta? </span>
              <button onClick={() => { setView('register'); clearFormAndMessages(); }} className="text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors hover:underline">Cadastre-se gratuitamente</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-600/20 blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] animate-pulse delay-700"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">
            AnimeLista
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Seu universo de animes em um só lugar</p>
        </header>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          {/* Subtle shine effect on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-emerald-200 text-sm font-medium">{message}</p>
            </div>
          )}

          {renderContent()}
        </div>

        <footer className="text-center mt-8 relative z-10">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Anime Agenda App. Feito com ❤️ para fãs.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;