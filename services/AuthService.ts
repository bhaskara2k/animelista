import { User } from '../types';
import { supabase } from './supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Helper function to get profile for a user
export const getProfile = async (user: SupabaseUser): Promise<User | null> => {
    if (!user.email) {
        console.warn("User object without email found. Treating as logged out.", user.id);
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select(`username, avatar_id, level, xp, bio, favorite_animes`)
        .eq('id', user.id)
        .single();

    // A critical error occurred (e.g. network issue, table doesn't exist)
    // We explicitly IGNORE 'PGRST116' which means "no rows found", a normal case.
    if (error && error.code !== 'PGRST116') {
        // Re-throw the specific database error to be caught by the AuthContext.
        console.error("Critical error fetching profile:", error.message, JSON.stringify(error, null, 2));
        throw error;
    }

    // If we have data and a username, the profile is valid.
    if (data && data.username) {
        return {
            id: user.id,
            email: user.email,
            username: data.username,
            avatarId: data.avatar_id,
            level: data.level,
            xp: data.xp,
            bio: data.bio,
            favoriteAnimes: data.favorite_animes || [],
        };
    }

    // Otherwise (no data, or data is incomplete), return null.
    // This can happen normally if a user signs up but the profile trigger hasn't run yet.
    return null;
};


export const signup = async (email: string, username: string, pass: string): Promise<User | null> => {
    if (!username || username.trim().length < 3) {
        throw new Error("O nome de usuário deve ter pelo menos 3 caracteres.");
    }
    if (!pass || pass.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    // First check if username is already taken in the profiles table
    const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = 'exact one row not found'
        throw new Error('Erro ao verificar nome de usuário: ' + profileError.message);
    }

    if (existingProfile) {
        throw new Error("Este nome de usuário já existe. Por favor, escolha outro.");
    }

    // v1 signUp syntax
    const { user, error } = await supabase.auth.signUp(
        { email, password: pass },
        { data: { username } }
    );

    if (error) {
        throw new Error(error.message || "Falha ao criar conta.");
    }
    if (user) {
        // The trigger should create the profile. We just need to fetch it.
        return await getProfile(user);
    }
    return null;
};

export const login = async (email: string, pass: string): Promise<User | null> => {
    // v1 signIn syntax
    const { user, error } = await supabase.auth.signIn({
        email,
        password: pass,
    });

    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email ou senha inválidos.");
        }
        throw new Error(error.message || "Falha ao fazer login.");
    }
    if (user) {
        return await getProfile(user);
    }
    return null;
};

export const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
    }
};

export const changeUsername = async (userId: string, newUsername: string, pass: string): Promise<User> => {
  if (!newUsername || newUsername.trim().length < 3) {
    throw new Error("O novo nome de usuário deve ter pelo menos 3 caracteres.");
  }

  // v1 synchronous user()
  const user = supabase.auth.user();
  if (!user) throw new Error("Usuário não autenticado.");
  if (!user.email) throw new Error("Email do usuário não encontrado.");

  // 1. Verify password by attempting to sign in
  const { error: signInError } = await supabase.auth.signIn({
      email: user.email,
      password: pass,
  });

  if (signInError) {
      throw new Error("Senha atual incorreta.");
  }
  
  // 2. Check if new username is taken
   const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .neq('id', userId) // exclude the current user's profile
        .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = 'exact one row not found'
        throw new Error('Erro ao verificar nome de usuário: ' + profileError.message);
    }
    if (existingProfile) {
        throw new Error("O novo nome de usuário já está em uso.");
    }

  // 3. Update username in profiles table
  const { data: profileData, error: updateError } = await supabase
    .from('profiles')
    .update({ username: newUsername, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message || "Falha ao alterar nome de usuário.");
  }
  
    return await getProfile(user) as User; // Re-fetch full profile
};

export const changePassword = async (currentPass: string, newPass: string): Promise<void> => {
  if (!newPass || newPass.length < 6) {
    throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
  }
  
  const user = supabase.auth.user();
  if (!user) throw new Error("Usuário não autenticado.");
  if (!user.email) throw new Error("Email do usuário não encontrado.");
  
  // Re-authenticate user before allowing password change for security
  const { error: signInError } = await supabase.auth.signIn({
      email: user.email,
      password: currentPass,
  });

  if (signInError) {
    throw new Error("Senha atual incorreta.");
  }

  // Now update the password with v1 `update`
  const { error: updateError } = await supabase.auth.update({ password: newPass });

  if (updateError) {
    throw new Error(updateError.message || "Falha ao alterar senha.");
  }
};

export const changeAvatar = async (userId: string, newAvatarId: string): Promise<User> => {
    const user = supabase.auth.user();
    if (!user) throw new Error("Usuário não autenticado.");
  
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_id: newAvatarId, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
        throw new Error(error.message || "Falha ao alterar avatar.");
    }
    
    return await getProfile(user) as User; // Re-fetch full profile
};

export const updateProfileDetails = async (userId: string, details: { bio?: string; favoriteAnimes?: string[] }): Promise<User> => {
    const user = supabase.auth.user();
    if (!user) throw new Error("Usuário não autenticado.");

    const updates: { bio?: string, favorite_animes?: string[], updated_at: string } = {
        updated_at: new Date().toISOString(),
    };
    if (details.bio !== undefined) {
        updates.bio = details.bio;
    }
    if (details.favoriteAnimes !== undefined) {
        updates.favorite_animes = details.favoriteAnimes;
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    
    if (error) {
        throw new Error(error.message || "Falha ao atualizar o perfil.");
    }

    return await getProfile(user) as User; // Re-fetch full profile
};


export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    // v1 api for password reset
    const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redirect back to the app
    });

    if (error) {
        // Do not reveal if the user exists or not for security reasons
        if (error.message.includes("User not found")) {
            console.warn("Attempted password reset for non-existent user.");
            return;
        }
        throw new Error(error.message || "Falha ao enviar email de recuperação.");
    }
};

export const resetPassword = async (newPassword: string): Promise<void> => {
    if (!newPassword || newPassword.length < 6) {
        throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
    }
    // The user must be authenticated with the recovery token at this point.
    // The `onAuthStateChange` with 'PASSWORD_RECOVERY' event handles this.
    // Use v1 `update`
    const { user, error } = await supabase.auth.update({ password: newPassword });

    if (error) {
        throw new Error(error.message || "Falha ao redefinir a senha.");
    }
    if (!user) {
        throw new Error("Não foi possível atualizar o usuário. A sessão pode ter expirado.");
    }
};