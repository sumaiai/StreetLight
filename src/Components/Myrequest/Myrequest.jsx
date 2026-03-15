import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);

const MyRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        const user = auth.currentUser;
        if (!user) { navigate('/'); return; }
        const q = query(
            collection(db, 'requests'),
            where('postedBy', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setRequests(list);
    };

    const acceptOffer = async (req, helperUid) => {
        try {
            await runTransaction(db, async (transaction) => {
                const helperRef = doc(db, 'users', helperUid);
                const requesterRef = doc(db, 'users', req.postedBy);
                const requestRef = doc(db, 'requests', req.id);

                const helperDoc = await transaction.get(helperRef);
                const requesterDoc = await transaction.get(requesterRef);
                const requesterPoints = requesterDoc.data().points;

                if (requesterPoints < req.points) {
                    throw new Error("You don't have enough points!");
                }

                transaction.update(helperRef, {
                    points: helperDoc.data().points + req.points,
                    helpGiven: helperDoc.data().helpGiven + 1,
                });
                transaction.update(requesterRef, {
                    points: requesterPoints - req.points,
                    helpReceived: requesterDoc.data().helpReceived + 1,
                });
                transaction.update(requestRef, {
                    status: 'inProgress',
                    acceptedBy: helperUid,
                });
            });

            alert('Helper accepted! Points transferred. Help is now in progress.');
            fetchMyRequests();
        } catch (err) {
            alert(err.message || 'Something went wrong.');
        }
    };

    const confirmDone = async (req) => {
        try {
            await updateDoc(doc(db, 'requests', req.id), {
                requesterConfirmed: true,
                status: req.helperConfirmed ? 'completed' : 'inProgress',
            });

            if (req.helperConfirmed) {
                alert('Both sides confirmed! Please rate your helper.');
                navigate(`/rate/${req.id}/${req.acceptedBy}`);
            } else {
                alert('Marked as done! Waiting for helper to confirm.');
                fetchMyRequests();
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
                    📋 My Requests
                </motion.h1>

                {requests.length === 0 && (
                    <p className="text-gray-400">You haven't posted any requests yet.</p>
                )}

                {requests.map((req, index) => (
                    <motion.div
                        key={req.id}
                        className="rounded-2xl shadow-lg mb-4 p-5 border border-transparent"
                        style={{ backgroundColor: '#1A1A2E' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{
                            scale: 1.01,
                            borderColor: '#FFD60A',
                            boxShadow: '0 0 20px rgba(255, 214, 10, 0.15)',
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

                        <p className="text-sm font-medium mb-1" style={{ color: '#FFD60A' }}>
                            📍 {req.location}
                        </p>
                        <p className="text-gray-300 mb-2">{req.description}</p>
                        <p className="text-sm font-bold mb-3" style={{ color: '#FFD60A' }}>
                            ⭐ {req.points} points
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-700 mb-3"></div>

                        {/* open — show offers */}
                        {req.status === 'open' && (
                            <div className="mt-2">
                                <p className="font-semibold mb-2 text-gray-300">
                                    {req.offers && req.offers.length > 0
                                        ? `${req.offers.length} person(s) offered help:`
                                        : 'No offers yet.'}
                                </p>
                                {req.offers && req.offers.map(helperUid => (
                                    <OfferRow
                                        key={helperUid}
                                        helperUid={helperUid}
                                        onAccept={() => acceptOffer(req, helperUid)}
                                        navigate={navigate}
                                    />
                                ))}
                            </div>
                        )}

                        {/* inProgress — confirm done */}
                        {req.status === 'inProgress' && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-300 font-medium mb-2">
                                    🔄 Help is in progress!
                                    {req.requesterConfirmed
                                        ? ' ✅ You confirmed done. Waiting for helper...'
                                        : ''}
                                </p>
                                {!req.requesterConfirmed && (
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

                        {/* completed — rate if not rated yet */}
                        {req.status === 'completed' && (
                            <div className="mt-2">
                                {!req[`ratedBy_${auth.currentUser?.uid}`] ? (
                                    <motion.button
                                        className="btn btn-sm font-bold btn-glow"
                                        style={{ backgroundColor: '#FF7B00', color: 'white' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/rate/${req.id}/${req.acceptedBy}`)}
                                    >
                                        ⭐ Rate Helper
                                    </motion.button>
                                ) : (
                                    <p className="text-green-400 text-sm font-medium">✅ You rated this helper</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const OfferRow = ({ helperUid, onAccept, navigate }) => {
    const [helperData, setHelperData] = useState(null);

    useEffect(() => {
        const fetchHelper = async () => {
            const userDoc = await getDoc(doc(db, 'users', helperUid));
            if (userDoc.exists()) setHelperData(userDoc.data());
        };
        fetchHelper();
    }, [helperUid]);

    if (!helperData) return <p className="text-sm text-gray-400">Loading...</p>;

    const rating = helperData.ratingCount > 0
        ? (helperData.ratingTotal / helperData.ratingCount).toFixed(1)
        : 'No rating';

    return (
        <motion.div
            className="flex justify-between items-center rounded-xl p-3 mb-2 border border-transparent"
            style={{ backgroundColor: '#252540' }}
            whileHover={{
                borderColor: '#FFD60A',
                boxShadow: '0 0 10px rgba(255, 214, 10, 0.1)',
            }}
        >
            <div>
                <p className="font-bold text-white">{helperData.name}</p>
                <p className="text-xs text-gray-400">
                    ⭐ {helperData.points} pts • {helperData.helpGiven} helps • {rating} rating
                </p>
            </div>
            <div className="flex gap-2">
                <motion.button
                    className="btn btn-xs font-bold"
                    style={{ backgroundColor: '#2A2F55', color: 'white' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/profile/${helperUid}`)}
                >
                    Profile
                </motion.button>
                <motion.button
                    className="btn btn-xs font-bold btn-glow"
                    style={{ backgroundColor: '#FF7B00', color: 'white' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAccept}
                >
                    Accept
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MyRequestsPage;