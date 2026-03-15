import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../Particles/Particles';

const categoryColors = {
    Moving: '#FF7B00',
    Cooking: '#FF4488',
    Tech: '#4A9EFF',
    Cleaning: '#55A630',
    Shopping: '#AA44FF',
    Tutoring: '#FFD60A',
    Other: '#888888',
};

const ProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) setProfile(userDoc.data());
        };

        const fetchRequests = async () => {
            const q = query(collection(db, 'requests'), where('postedBy', '==', userId));
            const snapshot = await getDocs(q);
            setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        };

        fetchProfile();
        fetchRequests();
    }, [userId]);

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A14' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-4 border-transparent"
                style={{ borderTopColor: '#FFD60A', borderRightColor: '#FF7B00' }}
            />
        </div>
    );

    const rating = profile.ratingCount > 0
        ? (profile.ratingTotal / profile.ratingCount).toFixed(1)
        : null;

    const stars = rating ? Math.round(parseFloat(rating)) : 0;

    return (
        <div className="min-h-screen p-6 relative" style={{ backgroundColor: '#0A0A14' }}>

            {/* Particles */}
            <Particles />

            {/* Ambient glow blobs */}
            <div className="fixed top-20 left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#FFD60A', filter: 'blur(80px)' }} />
            <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#4A9EFF', filter: 'blur(80px)' }} />

            <div className="max-w-lg mx-auto relative z-10">

                {/* Profile card */}
                <motion.div
                    className="rounded-2xl p-6 mb-6 border border-transparent relative overflow-hidden"
                    style={{ backgroundColor: '#12121E' }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{
                        borderColor: '#FFD60A44',
                        boxShadow: '0 0 30px rgba(255, 214, 10, 0.1)',
                    }}
                >
                    {/* Gold top accent bar */}
                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: 'linear-gradient(to right, #FFD60A, #FF7B00)' }} />

                    <div className="flex items-center gap-4 mb-6">
                        {/* Avatar */}
                        <motion.div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
                            style={{ backgroundColor: '#FFD60A22', color: '#FFD60A', border: '2px solid #FFD60A44' }}
                            animate={{
                                boxShadow: [
                                    '0 0 10px #FFD60A44',
                                    '0 0 25px #FFD60A88, 0 0 40px #FF7B0044',
                                    '0 0 10px #FFD60A44',
                                ]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            {(profile.name || profile.email)[0].toUpperCase()}
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-bold text-white">{profile.name || profile.email}</h1>
                            {profile.city && (
                                <p className="text-sm mt-1" style={{ color: '#4A9EFF' }}>📍 {profile.city}</p>
                            )}
                            {profile.email && (
                                <p className="text-xs text-gray-500 mt-0.5">{profile.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        <motion.div
                            className="rounded-xl p-3 text-center border border-transparent"
                            style={{ backgroundColor: '#FFD60A11', border: '1px solid #FFD60A33' }}
                            whileHover={{ borderColor: '#FFD60A', boxShadow: '0 0 15px #FFD60A33' }}
                        >
                            <motion.p
                                className="text-xl font-bold"
                                style={{ color: '#FFD60A' }}
                                animate={{
                                    textShadow: [
                                        '0 0 5px #FFD60A44',
                                        '0 0 15px #FFD60A88',
                                        '0 0 5px #FFD60A44',
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {profile.points}
                            </motion.p>
                            <p className="text-xs text-gray-500 mt-1">Points</p>
                        </motion.div>

                        <motion.div
                            className="rounded-xl p-3 text-center"
                            style={{ backgroundColor: '#FF7B0011', border: '1px solid #FF7B0033' }}
                            whileHover={{ borderColor: '#FF7B00', boxShadow: '0 0 15px #FF7B0033' }}
                        >
                            <p className="text-xl font-bold" style={{ color: '#FF7B00' }}>
                                {profile.helpGiven}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Helps Given</p>
                        </motion.div>

                        <motion.div
                            className="rounded-xl p-3 text-center"
                            style={{ backgroundColor: '#4A9EFF11', border: '1px solid #4A9EFF33' }}
                            whileHover={{ borderColor: '#4A9EFF', boxShadow: '0 0 15px #4A9EFF33' }}
                        >
                            <p className="text-xl font-bold" style={{ color: '#4A9EFF' }}>
                                {rating || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Rating</p>
                        </motion.div>
                    </div>

                    {/* Star rating */}
                    {rating && (
                        <motion.div
                            className="flex justify-center gap-1 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {[1, 2, 3, 4, 5].map(star => (
                                <motion.span
                                    key={star}
                                    className="text-2xl"
                                    style={{ color: star <= stars ? '#FFD60A' : '#333' }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + star * 0.1 }}
                                >
                                    ★
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Past Requests */}
                <motion.div
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold text-white">📋 Past Requests</h2>
                    <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: '#FFD60A22', color: '#FFD60A', border: '1px solid #FFD60A44' }}
                    >
                        {requests.length}
                    </span>
                </motion.div>

                {requests.length === 0 && (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-5xl mb-3">🌙</div>
                        <p className="text-gray-500 text-sm">No requests yet.</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {requests.map((req, index) => {
                        const catColor = categoryColors[req.category] || '#888';
                        return (
                            <motion.div
                                key={req.id}
                                className="rounded-2xl p-4 mb-3 border border-transparent relative overflow-hidden"
                                style={{ backgroundColor: '#12121E' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{
                                    borderColor: catColor + '66',
                                    boxShadow: `0 0 20px ${catColor}22`,
                                    y: -2,
                                }}
                            >
                                {/* Color accent bar */}
                                <div
                                    className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                    style={{ backgroundColor: catColor }}
                                />

                                <div className="pl-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white">{req.title}</h3>
                                        <motion.span
                                            className="px-2 py-0.5 rounded-lg text-xs font-bold ml-2 shrink-0"
                                            style={{ backgroundColor: catColor + '22', color: catColor, border: `1px solid ${catColor}44` }}
                                            whileHover={{ backgroundColor: catColor, color: 'white' }}
                                        >
                                            {req.category}
                                        </motion.span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{req.description}</p>
                                    <div className="flex items-center gap-2">
                                        {req.location && (
                                            <span className="text-xs text-gray-600">📍 {req.location}</span>
                                        )}
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                                            style={{ backgroundColor: '#FFD60A22', color: '#FFD60A' }}
                                        >
                                            ⭐ {req.points} pts
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${req.status === 'completed' ? 'bg-green-900 text-green-400' :
                                                req.status === 'inProgress' ? 'bg-yellow-900 text-yellow-400' :
                                                    'bg-blue-900 text-blue-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;