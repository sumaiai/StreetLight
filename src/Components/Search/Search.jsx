import { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const searchUsers = async () => {
        const user = auth.currentUser;
        if (!user) { navigate('/signin'); return; }
        if (!searchTerm) return;

        setMessage('');
        setResults([]);
        setLoading(true);

        try {
            const q = query(
                collection(db, 'users'),
                where('email', '==', searchTerm.toLowerCase().trim())
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setMessage('No user found with that email.');
                setMessageType('error');
                setLoading(false);
                return;
            }

            const users = snapshot.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(u => u.id !== user.uid);

            setResults(users);
        } catch (err) {
            console.log(err);
            setMessage('Something went wrong.');
            setMessageType('error');
        }
        setLoading(false);
    };

    const sendFriendRequest = async (toUserId) => {
        const user = auth.currentUser;
        try {
            const existing = query(
                collection(db, 'friendRequests'),
                where('from', '==', user.uid),
                where('to', '==', toUserId)
            );
            const snapshot = await getDocs(existing);
            if (!snapshot.empty) {
                setMessage('Friend request already sent!');
                setMessageType('warning');
                return;
            }

            await addDoc(collection(db, 'friendRequests'), {
                from: user.uid,
                fromEmail: user.email,
                to: toUserId,
                status: 'pending',
                createdAt: new Date(),
            });
            setMessage('Friend request sent! 🎉');
            setMessageType('success');
        } catch (err) {
            console.log(err);
            setMessage('Something went wrong.');
            setMessageType('error');
        }
    };

    const messageColors = {
        success: '#55A630',
        error: '#FF4444',
        warning: '#FF7B00',
        info: '#4A9EFF',
    };

    return (
        <div className="min-h-screen p-6 relative" style={{ backgroundColor: '#0D0D1A' }}>

            {/* Particles */}
            <Particles />

            <div className="max-w-lg mx-auto relative z-10">

                {/* Header */}
                <motion.h1
                    className="text-3xl font-bold mb-2 text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    🔍 Find People
                </motion.h1>
                <motion.p
                    className="text-gray-400 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Search by email to find and add friends
                </motion.p>

                {/* Search bar */}
                <motion.div
                    className="flex gap-2 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <input
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-[#1A1A2E] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchUsers()}
                    />
                    <motion.button
                        className="px-6 py-2 rounded-xl font-bold btn-glow"
                        style={{ backgroundColor: '#FFD60A', color: '#0D0D1A' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={searchUsers}
                    >
                        {loading
                            ? <span className="loading loading-spinner loading-sm"></span>
                            : 'Search'
                        }
                    </motion.button>
                </motion.div>

                {/* Message */}
                <AnimatePresence>
                    {message && (
                        <motion.p
                            className="text-sm mb-4 font-medium px-4 py-2 rounded-lg"
                            style={{
                                backgroundColor: messageColors[messageType] + '22',
                                color: messageColors[messageType],
                                border: `1px solid ${messageColors[messageType]}44`
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {results.map((u, index) => (
                        <motion.div
                            key={u.id}
                            className="rounded-2xl p-4 mb-3 border border-transparent"
                            style={{ backgroundColor: '#1A1A2E' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                                borderColor: '#FFD60A',
                                boxShadow: '0 0 20px rgba(255, 214, 10, 0.15)',
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    {/* Avatar circle */}
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                                            style={{ backgroundColor: '#FFD60A', color: '#0D0D1A' }}
                                            animate={{
                                                boxShadow: [
                                                    '0 0 5px #FFD60A',
                                                    '0 0 15px #FFD60A',
                                                    '0 0 5px #FFD60A',
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {(u.name || u.email)[0].toUpperCase()}
                                        </motion.div>
                                        <div>
                                            <p className="font-bold text-white">{u.name || u.email}</p>
                                            <p className="text-sm text-gray-400">{u.email}</p>
                                            {u.city && (
                                                <p className="text-xs text-gray-500">📍 {u.city}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    className="btn btn-sm font-bold btn-glow"
                                    style={{ backgroundColor: '#55A630', color: 'white' }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => sendFriendRequest(u.id)}
                                >
                                    + Add Friend
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchPage;