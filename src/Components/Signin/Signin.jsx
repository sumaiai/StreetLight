import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const SigninPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const signinUser = () => {
        setError('');
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate('/home'))
            .catch((err) => {
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    setError('No account found with this email.');
                    setTimeout(() => navigate('/signup'), 3000);
                } else if (err.code === 'auth/wrong-password') {
                    setError('Incorrect password. Please try again.');
                } else if (err.code === 'auth/invalid-email') {
                    setError('Please enter a valid email address.');
                } else if (err.code === 'auth/too-many-requests') {
                    setError('Too many failed attempts. Please try again later.');
                } else {
                    setError('Something went wrong. Please try again.');
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#FFD60A' }}>

            {/* Particles in background */}
            <Particles />

            {/* Card on top */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                <label className="block mb-1 font-medium">Email</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder='Enter your email'
                />

                <label className="block mb-1 font-medium">Password</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder='Enter your password'
                />

                {error && (
                    <div className="alert alert-error mb-4">
                        <p>{error}</p>
                        {error.includes('No account found') && (
                            <p className="text-sm">Redirecting to signup in 3 seconds...</p>
                        )}
                    </div>
                )}

                <button
                    className="btn w-full text-white font-bold"
                    style={{ backgroundColor: '#000814' }}
                    onClick={signinUser}
                >
                    Sign In
                </button>
                <p className="text-sm text-center mt-4">
                    Don't have an account?{' '}
                    <a className="font-semibold cursor-pointer underline" onClick={() => navigate('/signup')}>
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SigninPage;