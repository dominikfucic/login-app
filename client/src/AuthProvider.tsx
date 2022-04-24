import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
    return React.useContext(AuthContext);
}

function getCurrentUser(): User | null {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
        const user: User = JSON.parse(savedUser);
        return user
    }
    return null
}

function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(getCurrentUser());
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user]);

    function login(user: any) {
        axios.post('login', user)
            .then(res => {
                if (typeof (res.data) === 'string') {
                    setUser({ username: res.data });
                    navigate('/')
                }
                setError(res.data.message);
            })
    }

    function logout() {
        axios.post('logout')
            .then(() => setUser(null))
            .then(() => navigate('/login'))
    }

    function register(newUser: any) {

        axios.post('register', newUser)
            .then((res) => {
                if (typeof (res.data) === 'string') {
                    setUser({ username: res.data });
                    navigate('/')
                }
                if (res.data.errno === 19) {
                    setError('Username already exists');
                }
            })
    }

    const value = { user, error, setError, login, logout, register }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useAuth();

    if (!auth.user) {
        return <Navigate to='/login' />
    }

    return children
}

interface User {
    username: string
}

interface AuthContextType {
    user: User | null,
    error: string | null,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    login: (user: any) => void,
    logout: VoidFunction,
    register: (newUser: any) => void
}

export default AuthProvider;