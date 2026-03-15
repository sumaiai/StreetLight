import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, app } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const FriendsPage = () => {
    const [incoming, setIncoming] = useState([]);
    const [friends, setFriends] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;
        fetchIncoming();
        fetchFriends();
    }, []);

    const fetchIncoming = async () => {
        const q = query(
            collection(db, 'friendRequests'),
            where('to', '==', user.uid),
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        setIncoming(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const fetchFriends = async () => {
        const q = query(
            collection(db, 'friendRequests'),
            where('status', '==', 'accepted'),
            where('to', '==', user.uid)
        );
        const q2 = query(
            collection(db, 'friendRequests'),
            where('status', '==', 'accepted'),
            where('from', '==', user.uid)
        );
        const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);
        const all = [
            ...snap1.docs.map(d => ({ id: d.id, ...d.data() })),
            ...snap2.docs.map(d => ({ id: d.id, ...d.data() }))
        ];
        setFriends(all);
    };

    const acceptRequest = async (requestId) => {
        await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
        fetchIncoming();
        fetchFriends();
    };

    const declineRequest = async (requestId) => {
        await updateDoc(doc(db, 'friendRequests', requestId), { status: 'declined' });
        fetchIncoming();
    };

    const getInitial = (email) => email ? email[0].toUpperCase() : '?';

    return (
        <div className="min-h-screen p-6 relative" style={{ backgroundColor: '#0A0A14' }}>

            {/* Particles */}
            <Particles />

            {/* Ambient glow blobs */}
            <div className="fixed top-20 left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#FF7B00', filter: 'blur(80px)' }} />
            <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#FFD60A', filter: 'blur(80px)' }} />

            <div className="max-w-lg mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-white">👥 Friends</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your community connections</p>
                </motion.div>

                {/* Incoming Requests */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold" style={{ color: '#FF7B00' }}>
                            📩 Incoming Requests
                        </h2>
                        {incoming.length > 0 && (
                            <motion.span
                                className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ backgroundColor: '#FF7B0033', color: '#FF7B00', border: '1px solid #FF7B0055' }}
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {incoming.length} new
                            </motion.span>
                        )}
                    </div>

                    {incoming.length === 0 && (
                        <motion.p
                            className="text-gray-600 text-sm py-4 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No pending requests
                        </motion.p>
                    )}

                    <AnimatePresence>
                        {incoming.map((req, index) => (
                            <motion.div
                                key={req.id}
                                className="rounded-2xl p-4 mb-3 border border-transparent relative overflow-hidden"
                                style={{ backgroundColor: '#12121E' }}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    borderColor: '#FF7B0066',
                                    boxShadow: '0 0 20px rgba(255, 123, 0, 0.15)',
                                }}
                            >
                                {/* Orange accent bar */}
                                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: '#FF7B00' }} />

                                <div className="flex justify-between items-center pl-3">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                                            style={{ backgroundColor: '#FF7B0022', color: '#FF7B00', border: '1px solid #FF7B0044' }}
                                            animate={{
                                                boxShadow: [
                                                    '0 0 5px #FF7B0044',
                                                    '0 0 15px #FF7B0088',
                                                    '0 0 5px #FF7B0044',
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {getInitial(req.fromEmail)}
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{req.fromEmail}</p>
                                            <p className="text-gray-600 text-xs">wants to be your friend</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold"
                                            style={{ backgroundColor: '#55A63022', color: '#55A630', border: '1px solid #55A63044' }}
                                            whileHover={{ backgroundColor: '#55A630', color: 'white', scale: 1.05, boxShadow: '0 0 15px #55A63066' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => acceptRequest(req.id)}
                                        >
                                            ✓ Accept
                                        </motion.button>
                                        <motion.button
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold"
                                            style={{ backgroundColor: '#FF444422', color: '#FF4444', border: '1px solid #FF444444' }}
                                            whileHover={{ backgroundColor: '#FF4444', color: 'white', scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => declineRequest(req.id)}
                                        >
                                            ✕ Decline
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-gray-800 mb-8" />

                {/* Friends List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold" style={{ color: '#FFD60A' }}>
                            ⭐ My Friends
                        </h2>
                        {friends.length > 0 && (
                            <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ backgroundColor: '#FFD60A22', color: '#FFD60A', border: '1px solid #FFD60A44' }}
                            >
                                {friends.length}
                            </span>
                        )}
                    </div>

                    {friends.length === 0 && (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="text-5xl mb-3">🌙</div>
                            <p className="text-gray-500 text-sm">No friends yet.</p>
                            <p className="text-gray-600 text-xs mt-1">Search for people to add!</p>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {friends.map((f, index) => {
                            const email = f.from === user.uid ? f.toEmail : f.fromEmail;
                            return (
                                <motion.div
                                    key={f.id}
                                    className="rounded-2xl p-4 mb-3 border border-transparent relative overflow-hidden"
                                    style={{ backgroundColor: '#12121E' }}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    whileHover={{
                                        borderColor: '#FFD60A44',
                                        boxShadow: '0 0 20px rgba(255, 214, 10, 0.1)',
                                        y: -2,
                                    }}
                                >
                                    {/* Gold accent bar */}
                                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: '#FFD60A' }} />

                                    <div className="flex items-center gap-3 pl-3">
                                        <motion.div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                                            style={{ backgroundColor: '#FFD60A22', color: '#FFD60A', border: '1px solid #FFD60A44' }}
                                            animate={{
                                                boxShadow: [
                                                    '0 0 5px #FFD60A44',
                                                    '0 0 12px #FFD60A66',
                                                    '0 0 5px #FFD60A44',
                                                ]
                                            }}
                                            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                                        >
                                            {getInitial(email)}
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{email}</p>
                                            <p className="text-xs" style={{ color: '#55A630' }}>✓ Connected</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default FriendsPage;