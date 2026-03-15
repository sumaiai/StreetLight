import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const HomePage = () => {
    const [requests, setRequests] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) { navigate('/'); return; }
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setUserPoints(data.points);
            await fetchRequests(data.city);
        }
        setLoading(false);
    };

    const fetchRequests = async (city) => {
        const user = auth.currentUser;
        const q = query(
            collection(db, 'requests'),
            where('city', '==', city),
            where('status', '==', 'open')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(r => r.postedBy !== user.uid);
        setRequests(list);
    };

    const offerHelp = async (req) => {
        const user = auth.currentUser;
        if (req.offers && req.offers.includes(user.uid)) {
            alert('You already offered help for this request!');
            return;
        }
        try {
            await updateDoc(doc(db, 'requests', req.id), {
                offers: arrayUnion(user.uid)
            });
            alert('Help offered! The requester will pick someone soon.');
            fetchRequests(userData.city);
        } catch (err) {
            console.log(err);
        }
    };

    const logout = () => {
        signOut(auth).then(() => navigate('/'));
    };

    const categoryColors = {
        Moving: '#FF7B00',
        Cooking: '#FF4488',
        Tech: '#4A9EFF',
        Cleaning: '#55A630',
        Shopping: '#AA44FF',
        Tutoring: '#FFD60A',
        Other: '#888888',
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A14' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-4 border-transparent"
                    style={{ borderTopColor: '#FFD60A', borderRightColor: '#FF7B00' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 relative" style={{ backgroundColor: '#0A0A14' }}>

            {/* Particles */}
            <Particles />

            {/* Ambient glow blobs */}
            <div className="fixed top-20 left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#FFD60A', filter: 'blur(80px)' }} />
            <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#FF7B00', filter: 'blur(80px)' }} />
            <div className="fixed top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 pointer-events-none" style={{ backgroundColor: '#4A9EFF', filter: 'blur(100px)', transform: 'translate(-50%, -50%)' }} />

            <div className="max-w-2xl mx-auto relative z-10">

                {/* Top bar */}
                <motion.div
                    className="flex justify-between items-center mb-8 p-4 rounded-2xl border border-gray-800"
                    style={{ backgroundColor: '#12121E' }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                            style={{ backgroundColor: '#FFD60A', color: '#0A0A14' }}
                            animate={{
                                boxShadow: [
                                    '0 0 5px #FFD60A',
                                    '0 0 15px #FFD60A, 0 0 30px #FF7B00',
                                    '0 0 5px #FFD60A',
                                ]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            {userData?.name?.[0]?.toUpperCase() || '?'}
                        </motion.div>
                        <div>
                            <p className="font-bold text-white text-lg leading-tight">{userData?.name}</p>
                            <p className="text-xs" style={{ color: '#4A9EFF' }}>📍 {userData?.city}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <motion.div
                            className="px-3 py-1 rounded-xl font-bold text-sm"
                            style={{ backgroundColor: '#1A1A2E', color: '#FFD60A', border: '1px solid #FFD60A33' }}
                            animate={{
                                boxShadow: [
                                    '0 0 3px #FFD60A44',
                                    '0 0 10px #FFD60A66',
                                    '0 0 3px #FFD60A44',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ⭐ {userPoints} pts
                        </motion.div>
                        <motion.button
                            className="px-3 py-1 rounded-xl font-bold text-sm border"
                            style={{ backgroundColor: 'transparent', color: '#FF7B00', borderColor: '#FF7B0044' }}
                            whileHover={{ backgroundColor: '#FF7B00', color: 'white', scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                        >
                            Sign Out
                        </motion.button>
                    </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    className="grid grid-cols-2 gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.button
                        className="py-3 px-4 rounded-2xl font-bold text-sm relative overflow-hidden"
                        style={{ backgroundColor: '#FFD60A', color: '#0A0A14' }}
                        animate={{
                            boxShadow: [
                                '0 0 5px #FFD60A44',
                                '0 0 15px #FFD60A88',
                                '0 0 5px #FFD60A44',
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 25px #FFD60A99' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/post-request')}
                    >
                        ✍️ Post a Request
                    </motion.button>

                    <motion.button
                        className="py-3 px-4 rounded-2xl font-bold text-sm border"
                        style={{ backgroundColor: 'transparent', color: '#4A9EFF', borderColor: '#4A9EFF44' }}
                        whileHover={{ backgroundColor: '#4A9EFF', color: 'white', scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/my-requests')}
                    >
                        📋 My Requests
                    </motion.button>
                </motion.div>

                {/* Feed header */}
                <motion.div
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold text-white">Near You</h2>
                    <motion.span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: '#FF7B0033', color: '#FF7B00', border: '1px solid #FF7B0055' }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        ● LIVE
                    </motion.span>
                    <span className="text-gray-500 text-sm">{requests.length} open</span>
                </motion.div>

                {requests.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-5xl mb-4">🌙</div>
                        <p className="text-gray-500">No open requests in your area yet!</p>
                        <p className="text-gray-600 text-sm mt-1">Be the first to post one</p>
                    </motion.div>
                )}

                {/* Request cards */}
                <AnimatePresence>
                    {requests.map((req, index) => {
                        const catColor = categoryColors[req.category] || '#888';
                        const alreadyOffered = req.offers && req.offers.includes(auth.currentUser?.uid);

                        return (
                            <motion.div
                                key={req.id}
                                className="rounded-2xl mb-4 p-5 border border-transparent relative overflow-hidden"
                                style={{ backgroundColor: '#12121E' }}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.08, duration: 0.4 }}
                                whileHover={{
                                    borderColor: catColor + '66',
                                    boxShadow: `0 0 25px ${catColor}22`,
                                    y: -2,
                                }}
                            >
                                {/* Color accent bar */}
                                <div
                                    className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                    style={{ backgroundColor: catColor }}
                                />

                                {/* Card header */}
                                <div className="flex justify-between items-start mb-3 pl-3">
                                    <h3 className="font-bold text-lg text-white flex-1 pr-2">{req.title}</h3>
                                    <motion.span
                                        className="px-2 py-1 rounded-lg text-xs font-bold shrink-0"
                                        style={{ backgroundColor: catColor + '22', color: catColor, border: `1px solid ${catColor}44` }}
                                        whileHover={{ backgroundColor: catColor, color: 'white' }}
                                    >
                                        {req.category}
                                    </motion.span>
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-2 mb-3 pl-3">
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1E1E35', color: '#888' }}>
                                        📍 {req.location}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1E1E35', color: '#888' }}>
                                        👤 {req.postedByName}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-4 pl-3 leading-relaxed">{req.description}</p>

                                {/* Footer */}
                                <div className="flex justify-between items-center pl-3">
                                    <div className="flex gap-2 items-center">
                                        <motion.span
                                            className="text-sm font-bold px-3 py-1 rounded-xl"
                                            style={{ backgroundColor: '#FFD60A22', color: '#FFD60A', border: '1px solid #FFD60A44' }}
                                            animate={{
                                                boxShadow: [
                                                    '0 0 3px #FFD60A22',
                                                    '0 0 8px #FFD60A44',
                                                    '0 0 3px #FFD60A22',
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ⭐ {req.points}
                                        </motion.span>
                                        <span className="text-xs text-gray-600">
                                            {req.offers?.length || 0} offer(s)
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <motion.button
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                                            style={{ backgroundColor: 'transparent', color: '#4A9EFF', borderColor: '#4A9EFF44' }}
                                            whileHover={{ backgroundColor: '#4A9EFF', color: 'white', scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/profile/${req.postedBy}`)}
                                        >
                                            Profile
                                        </motion.button>
                                        <motion.button
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold"
                                            style={{
                                                backgroundColor: alreadyOffered ? '#55A63022' : '#FF7B0022',
                                                color: alreadyOffered ? '#55A630' : '#FF7B00',
                                                border: `1px solid ${alreadyOffered ? '#55A63044' : '#FF7B0044'}`,
                                            }}
                                            whileHover={{
                                                backgroundColor: alreadyOffered ? '#55A630' : '#FF7B00',
                                                color: 'white',
                                                scale: 1.05,
                                                boxShadow: `0 0 15px ${alreadyOffered ? '#55A630' : '#FF7B00'}66`,
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => offerHelp(req)}
                                        >
                                            {alreadyOffered ? '✓ Offered' : '🤝 Offer Help'}
                                        </motion.button>
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

export default HomePage;