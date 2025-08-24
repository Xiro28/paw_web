import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { login, register, auth } from './firebase.ts';

import { onAuthStateChanged, User } from "firebase/auth";
import LoadingScreen from './components/loadingPage.tsx';

export default function LoginForm(props: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setLoading(false);
            props.setuser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    // Funzione di login
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            let user: User;
            if (isLogin) {
                user = await login(email, password);
            } else {
                user = await register(email, password);
            }

            props.setuser(user);
            setEmail('');
            setPassword('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Funzione di cambio modalità (login / registrazione)
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (loading ? <LoadingScreen /> :
        <div className="login-form">
            <h2>{isLogin ? 'Login' : 'Registrati'}</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">{isLogin ? 'Accedi' : 'Registrati'}</button>
            </form>
            <p>
                {isLogin ? 'Non hai un account?' : 'Hai già un account?'}{' '}
                <button onClick={toggleMode}>
                    {isLogin ? 'Registrati' : 'Accedi'}
                </button>
            </p>
        </div>
    );
}
