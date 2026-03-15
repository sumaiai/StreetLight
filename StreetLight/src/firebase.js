import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCaYMmyxxI623qe7pJ_r02oXfRTuFKMrGk",
    authDomain: "streetlight-26568.firebaseapp.com",
    projectId: "streetlight-26568",
    storageBucket: "streetlight-26568.firebasestorage.app",
    messagingSenderId: "127947363307",
    appId: "1:127947363307:web:6e866475a4f87c3746ffae",
    measurementId: "G-DT171QDG0M",
    databaseURL: 'https://streetlight-26568-default-rtdb.firebaseio.com/',
};

export const app = initializeApp(firebaseConfig);
