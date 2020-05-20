import AsyncStorage from '@react-native-community/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
    user: AuthUserData;
    loading: boolean;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadStorageData(): Promise<void> {

            const [token, user] = await AsyncStorage.multiGet(['@Gobarber:token', '@Gobarber:user']);
            if(token[1] && user[1])
                setData({ token: token[1], user: JSON.parse(user[1]) });
            setLoading(false);
        };
        loadStorageData();
    }, []);


    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {email, password});
        const {token, user } = response.data;
        
        await AsyncStorage.multiSet([
            ['@Gobarber:token', token] , 
            ['@Gobarber:user', JSON.stringify(user)]
        ]);
            
        setData({token, user});
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);
        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
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