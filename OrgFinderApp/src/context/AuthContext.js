import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken]   = useState(null);
    const [user, setUser]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem('token');
                if (stored) {
                    setToken(stored);
                    const res = await api.get('/auth/user');
                    setUser(res.data.user);
                }
            } catch {
                await AsyncStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        await AsyncStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch {}
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const res = await api.get('/auth/user');
        setUser(res.data.user);
        return res.data.user;
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
