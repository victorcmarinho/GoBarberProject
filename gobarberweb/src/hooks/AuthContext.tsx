import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthState {
    token: string;
    user: AuthUserData
}

interface AuthUserData {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
}

interface IAuthContext {
    user: AuthUserData
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@Gobarber:token');
        const user = localStorage.getItem('@Gobarber:user');
        return token && user ? {token, user: JSON.parse(user)} : {} as AuthState;
    });



    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {email, password});
        const {token, user } = response.data;
        localStorage.setItem('@Gobarber:token', token);
        localStorage.setItem('@Gobarber:user', JSON.stringify(user));
        setData({token, user});
    }, []);

    const signOut = useCallback(async () => {
        localStorage.removeItem('@Gobarber:token');
        localStorage.removeItem('@Gobarber:user');
        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
};


export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}