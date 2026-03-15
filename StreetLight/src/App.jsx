import { useState } from 'react';
import { app } from "./firebase";
import Navbar from './Components/Navbar/Navbar'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import SignupPage from './Components/Signup/Signup';
import SigninPage from "./Components/Signin/Signin";
import './App.css';

const auth = getAuth(app);

function App() {
  const signupUser = () => {
    createUserWithEmailAndPassword(
      auth,
      'sumaiaislam567@gmail.com',
      'sumu123'
    ).then((value) => console.log(value))
  };


  const [count, setCount] = useState(0)

  return (
    <>
      <SignupPage />
      <SigninPage />

    </>
  );
}

export default App
