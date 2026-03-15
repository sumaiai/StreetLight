import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { app, db } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const createUser = async () => {
        setError('');
        if (!name || !city) { setError('Please fill in all fields.'); return; }
        try {
            const value = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', value.user.uid), {
                email: email,
                name: name,
                city: city.toLowerCase().trim(),
                points: 100,
                helpGiven: 0,
                helpReceived: 0,
                ratingTotal: 0,
                ratingCount: 0,
            });
            navigate('/home');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please sign in instead.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#FFD60A' }}>

            {/* Particles in background */}
            <Particles />

            {/* Card on top */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

                <label className="block mb-1 font-medium">Name</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder='Enter your name'
                />

                <label className="block mb-1 font-medium">Email</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder='Enter your email'
                />

                <label className="block mb-1 font-medium">Password</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder='Enter your password'
                />

                <label className="block mb-1 font-medium">City / Area</label>
                <input
                    className="input input-bordered w-full mb-4"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    type="text"
                    placeholder='e.g. Dhaka, Chittagong'
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button className="btn w-full text-white font-bold" style={{ backgroundColor: '#000814' }} onClick={createUser}>Sign Up</button>
                <p className="text-sm text-center mt-4">Already have an account? <a className="font-semibold cursor-pointer underline" onClick={() => navigate('/signin')}>Sign In</a></p>
            </div>
        </div>
    );
};

export default SignupPage;