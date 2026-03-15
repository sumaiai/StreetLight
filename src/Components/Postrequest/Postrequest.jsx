import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from '../Particles/Particles';

const auth = getAuth(app);
const categories = ['Moving', 'Cooking', 'Tech', 'Cleaning', 'Shopping', 'Tutoring', 'Other'];

const PostRequest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitRequest = async () => {
        const user = auth.currentUser;
        if (!user) { navigate('/signin'); return; }
        if (!title || !description || !points || !category || !location) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            await addDoc(collection(db, 'requests'), {
                title,
                description,
                points: Number(points),
                category,
                location: location.toLowerCase().trim(),
                city: userData.city,
                postedBy: user.uid,
                postedByEmail: user.email,
                postedByName: userData.name,
                status: 'open',
                offers: [],
                createdAt: new Date(),
            });
            navigate('/home');
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ backgroundColor: '#0D0D1A' }}>

            {/* Particles */}
            <Particles />

            {/* Card */}
            <motion.div
                className="w-full max-w-lg rounded-2xl p-8 border border-transparent relative z-10"
                style={{ backgroundColor: '#1A1A2E' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    borderColor: '#FFD60A',
                    boxShadow: '0 0 30px rgba(255, 214, 10, 0.1)',
                }}
            >
                <motion.h1
                    className="text-3xl font-bold mb-6 text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    ✍️ Post a Help Request
                </motion.h1>

                <label className="block mb-1 font-medium text-gray-300">Title</label>
                <input
                    className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-600 bg-[#252540] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                    placeholder="e.g. Need help moving boxes"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <label className="block mb-1 font-medium text-gray-300">Description</label>
                <textarea
                    className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-600 bg-[#252540] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                    placeholder="Describe what you need help with..."
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <label className="block mb-1 font-medium text-gray-300">Category</label>
                <select
                    className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-600 bg-[#252540] text-white focus:outline-none focus:border-yellow-400 transition"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <label className="block mb-1 font-medium text-gray-300">Location</label>
                <input
                    className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-600 bg-[#252540] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                    placeholder="e.g. Mirpur, Gulshan"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />

                <label className="block mb-1 font-medium text-gray-300">Points Offered</label>
                <input
                    className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-600 bg-[#252540] text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                    type="number"
                    placeholder="How many points are you offering?"
                    value={points}
                    onChange={e => setPoints(e.target.value)}
                />

                {error && (
                    <motion.p
                        className="text-red-400 mb-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                )}

                <motion.button
                    className="w-full py-3 rounded-xl font-bold text-lg btn-glow"
                    style={{ backgroundColor: '#FFD60A', color: '#0D0D1A' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={submitRequest}
                >
                    🚀 Post Request
                </motion.button>

                <motion.button
                    className="w-full py-3 rounded-xl font-bold mt-3 border border-gray-600 text-gray-300"
                    whileHover={{ scale: 1.03, borderColor: '#FFD60A', color: '#FFD60A' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/home')}
                >
                    Cancel
                </motion.button>
            </motion.div>
        </div>
    );
};

export default PostRequest;