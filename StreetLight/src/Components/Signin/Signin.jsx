import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';

const auth = getAuth(app);

const SigninPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signinUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(value => console.log('Signin success'))
            .catch((err) => console.log(err));

    }

    return (
        <div className='signin-page'>
            <h1>Signin Page</h1>
            <label htmlFor="">Enter your email</label>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder='enter your email here'
            />
            <label htmlFor="">Enter your password</label>
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='enter your password here' />
            <button onClick={signinUser}>Sign me in</button>
        </div>
    );
};

export default SigninPage;