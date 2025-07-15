import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon } from '../components/Icons';
import { supabase } from '../services/supabaseClient';

const inputClass = "w-full p-3 bg-surface-secondary border border-border-primary rounded-md focus:ring-2 focus:ring-accent-ring focus:border-accent-border outline-none transition-colors placeholder-text-tertiary text-text-primary";
const labelClass = "block text-sm font-medium text-text-secondary mb-1";
const buttonClass = "w-full px-6 py-3 rounded-md text-white bg-accent-cta hover:bg-accent-cta-hover transition-colors flex items-center justify-center space-x-2 font-semibold disabled:bg-slate-600 disabled:cursor-not-allowed";

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
      setView('login'); // The context will log the user out, this just shows the right view
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
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">Recuperar Senha</h2>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required disabled={isLoading} />
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Enviar Link</span>}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => { setView('login'); clearFormAndMessages(); }} className="text-sm text-accent hover:underline">Voltar para o Login</button>
            </div>
          </>
        );
      case 'resetPassword':
        return (
          <>
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">Definir Nova Senha</h2>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
               <div>
                <label htmlFor="new-password" className={labelClass}>Nova Senha</label>
                <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="•••••••• (min. 6 caracteres)" required minLength={6} disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className={labelClass}>Confirmar Nova Senha</label>
                <input type="password" id="confirm-new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" required minLength={6} disabled={isLoading} />
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
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">Criar Nova Conta</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required autoComplete="email" disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="username" className={labelClass}>Nome de Usuário</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="seu_usuario (min. 3 caracteres)" required minLength={3} autoComplete="username" disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Senha</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="•••••••• (min. 6 caracteres)" required minLength={6} autoComplete="new-password" disabled={isLoading} />
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email || !password || !username}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <LockClosedIcon className="w-5 h-5"/>}
                <span>Cadastrar</span>
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => { setView('login'); clearFormAndMessages(); }} className="text-sm text-accent hover:underline">Já tem uma conta? Faça login</button>
            </div>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">Acessar sua Conta</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" required autoComplete="email" disabled={isLoading}/>
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Senha</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required autoComplete="current-password" disabled={isLoading}/>
              </div>
              <button type="submit" className={buttonClass} disabled={isLoading || !email || !password}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <LockClosedIcon className="w-5 h-5"/>}
                <span>Entrar</span>
              </button>
            </form>
             <div className="flex justify-between items-center mt-6">
              <button onClick={() => { setView('register'); clearFormAndMessages(); }} className="text-sm text-accent hover:underline">Não tem uma conta? Cadastre-se</button>
              <button onClick={() => { setView('forgotPassword'); clearFormAndMessages(); }} className="text-sm text-accent hover:underline">Esqueci minha senha</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center items-center p-4">
       <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-300)]">
            Minha Agenda de Animes
          </h1>
          <p className="text-text-secondary mt-2 text-md sm:text-lg">Seu espaço para organizar e descobrir animes.</p>
        </header>

      <div className="w-full max-w-md bg-surface-primary p-8 rounded-xl shadow-custom-2xl">
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-md text-center">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        {renderContent()}
      </div>
       <footer className="text-center mt-12 py-6">
          <p className="text-text-tertiary text-sm">
            Anime Agenda App &copy; {new Date().getFullYear()}.
          </p>
        </footer>
    </div>
  );
};

export default AuthPage;