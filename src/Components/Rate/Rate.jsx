import { useState } from 'react';
import { doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';

const auth = getAuth(app);

const RatePage = () => {
    const { requestId, rateUserId } = useParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const submitRating = async () => {
        if (rating === 0) { alert('Please select a star rating!'); return; }
        const user = auth.currentUser;

        try {
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', rateUserId);
                const userDoc = await transaction.get(userRef);
                const data = userDoc.data();

                transaction.update(userRef, {
                    ratingTotal: (data.ratingTotal || 0) + rating,
                    ratingCount: (data.ratingCount || 0) + 1,
                });

                // mark that this user has rated on this request
                const requestRef = doc(db, 'requests', requestId);
                transaction.update(requestRef, {
                    [`ratedBy_${user.uid}`]: true,
                });
            });

            setSubmitted(true);
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            console.log(err);
            alert('Something went wrong.');
        }
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Thanks for rating! ⭐</h1>
                <p>Redirecting to home...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Rate Your Experience</h1>

            <p className="mb-4 text-gray-500">How was the help you received?</p>

            {/* Star selector */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        className={`text-4xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </button>
                ))}
            </div>

            <label className="block mb-1 font-medium">Comment (optional)</label>
            <textarea
                className="textarea textarea-bordered w-full mb-4"
                placeholder="Leave a comment about your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <button className="btn btn-primary w-full" onClick={submitRating}>
                Submit Rating
            </button>
        </div>
    );
};

export default RatePage;