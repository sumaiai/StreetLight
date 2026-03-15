import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const MyHelpsPage = () => {
    const [helps, setHelps] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyHelps();
    }, []);

    const fetchMyHelps = async () => {
        const user = auth.currentUser;
        if (!user) { navigate('/'); return; }
        const q = query(
            collection(db, 'requests'),
            where('acceptedBy', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        setHelps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const confirmDone = async (req) => {
        try {
            await updateDoc(doc(db, 'requests', req.id), {
                helperConfirmed: true,
                status: req.requesterConfirmed ? 'completed' : 'inProgress',
            });

            if (req.requesterConfirmed) {
                alert('Both confirmed! Please rate the requester.');
                navigate(`/rate/${req.id}/${req.postedBy}`);
            } else {
                alert('Marked as done! Waiting for requester to confirm.');
                fetchMyHelps();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen p-4 relative" style={{ backgroundColor: '#0D0D1A' }}>

            {/* Particles */}
            <Particles />

            <div className="max-w-2xl mx-auto relative z-10">

                {/* Header */}
                <motion.h1
                    className="text-3xl font-bold mb-6 text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    🤝 Helps I'm Giving
                </motion.h1>

                {helps.length === 0 && (
                    <motion.p
                        className="text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        You haven't accepted any help requests yet.
                    </motion.p>
                )}

                {helps.map((req, index) => (
                    <motion.div
                        key={req.id}
                        className="rounded-2xl shadow-lg mb-4 p-5 border border-transparent"
                        style={{ backgroundColor: '#1A1A2E' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{
                            scale: 1.01,
                            borderColor: '#FF7B00',
                            boxShadow: '0 0 25px rgba(255, 123, 0, 0.2)',
                        }}
                    >
                        {/* Card header */}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-white">{req.title}</h3>
                            <span className={`badge font-medium text-white ${req.status === 'completed' ? 'badge-success' :
                                req.status === 'inProgress' ? 'badge-warning' :
                                    'badge-info'
                                }`}>
                                {req.status}
                            </span>
                        </div>

                        <p className="text-sm font-medium mb-1" style={{ color: '#FF7B00' }}>
                            📍 {req.location} • Requested by {req.postedByName}
                        </p>
                        <p className="text-gray-300 mb-2">{req.description}</p>

                        {/* Points badge */}
                        <motion.div
                            className="inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3"
                            style={{ backgroundColor: '#FF7B00', color: 'white' }}
                            animate={{
                                boxShadow: [
                                    '0 0 5px #FF7B00',
                                    '0 0 20px #FF7B00, 0 0 40px #FFD60A',
                                    '0 0 5px #FF7B00',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ⭐ {req.points} points
                        </motion.div>

                        {/* Divider */}
                        <div className="border-t border-gray-700 mb-3"></div>

                        {/* inProgress */}
                        {req.status === 'inProgress' && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-300 font-medium mb-2">
                                    {req.helperConfirmed
                                        ? '✅ You confirmed done. Waiting for requester...'
                                        : '🔄 Help is in progress!'}
                                </p>
                                {!req.helperConfirmed && (
                                    <motion.button
                                        className="btn btn-sm font-bold btn-glow"
                                        style={{ backgroundColor: '#55A630', color: 'white' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => confirmDone(req)}
                                    >
                                        ✅ Mark as Done
                                    </motion.button>
                                )}
                            </div>
                        )}

                        {/* completed */}
                        {req.status === 'completed' && (
                            <div className="mt-2">
                                {!req[`ratedBy_${auth.currentUser?.uid}`] ? (
                                    <motion.button
                                        className="btn btn-sm font-bold btn-glow"
                                        style={{ backgroundColor: '#FF7B00', color: 'white' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/rate/${req.id}/${req.postedBy}`)}
                                    >
                                        ⭐ Rate Requester
                                    </motion.button>
                                ) : (
                                    <motion.p
                                        className="text-green-400 text-sm font-medium"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        ✅ You rated this person
                                    </motion.p>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyHelpsPage;