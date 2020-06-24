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
    avatar_url: string;
}

interface IAuthContext {
    user: AuthUserData
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: AuthUserData): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@Gobarber:token');
        const user = localStorage.getItem('@Gobarber:user');
        if(token && user) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            return {token, user: JSON.parse(user)}
        }
        return {} as AuthState;
        
    });



    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {email, password});
        const { token, user } = response.data;
        localStorage.setItem('@Gobarber:token', token);
        localStorage.setItem('@Gobarber:user', JSON.stringify(user));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({token, user});
    }, []);

    const signOut = useCallback(async () => {
        localStorage.removeItem('@Gobarber:token');
        localStorage.removeItem('@Gobarber:user');
        setData({} as AuthState);
    }, []);

    const updateUser = useCallback( async( user: AuthUserData) => {
        
        setData({
            token: data.token,
            user
        });

        localStorage.setItem('@Gobarber:user', JSON.stringify(user));

    }, [setData, data.token]);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
};


export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);
    return context;
}