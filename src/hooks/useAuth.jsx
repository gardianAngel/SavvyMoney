import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) { setProfile(null); return; }
        const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
        setProfile(data || null);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null;
            setUser(u);
            fetchProfile(u?.id).finally(() => setLoading(false));
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null;
            setUser(u);
            fetchProfile(u?.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    const updateProfile = async (data) => {
        if (!user) return;
        const { error } = await supabase.from('users').upsert({ id: user.id, ...data });
        if (!error) await fetchProfile(user.id);
        return { error };
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        profile,
        loading,
        updateProfile,
        refreshProfile: () => fetchProfile(user?.id),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
