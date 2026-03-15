import { useNavigate } from 'react-router-dom';
import StreetImage from '../../assets/Street.jpg';
import { motion } from 'framer-motion';

const title = "Light the way for someone today";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div
                className="hero min-h-screen"
                style={{ backgroundImage: `url(${StreetImage})` }}
            >
                <div className="hero-overlay bg-black/50"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">

                        {/* Animated title — letter by letter */}
                        <h1 className="mb-5 text-5xl font-bold drop-shadow-lg flex flex-wrap justify-center gap-x-3 gap-y-2">
                            {title.split(" ").map((word, wordIndex) => (
                                <span key={wordIndex} className="inline-flex">
                                    {word.split("").map((char, charIndex) => {
                                        const globalIndex = title.split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0) + charIndex;
                                        return (
                                            <motion.span
                                                key={charIndex}
                                                initial={{ opacity: 0, color: '#ffffff' }}
                                                animate={{
                                                    opacity: 1,
                                                    color: ['#ffffff', '#FFD60A', '#FFD60A', '#ffffff'],
                                                    textShadow: [
                                                        '0 0 0px transparent',
                                                        '0 0 20px #FFD60A, 0 0 40px #FFD60A',
                                                        '0 0 10px #ffffff',
                                                    ],
                                                }}
                                                transition={{
                                                    delay: globalIndex * 0.08,
                                                    duration: 0.6,
                                                    color: { duration: 1.5, delay: globalIndex * 0.08 },
                                                    textShadow: { duration: 1.5, delay: globalIndex * 0.08 },
                                                }}
                                            >
                                                {char}
                                            </motion.span>
                                        );
                                    })}
                                </span>
                            ))}
                        </h1>

                        {/* Subtitle fade in */}
                        <motion.p
                            className="mb-5 font-semibold drop-shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: title.length * 0.05 + 0.3, duration: 0.8 }}
                        >
                            Give help, earn kindness, and build a community where everyone looks out for each other.
                        </motion.p>

                        {/* Buttons fade in */}
                        <motion.div
                            className="flex items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: title.length * 0.05 + 0.7, duration: 0.8 }}
                        >
                            <button
                                className='bg-[#ff7b00] hover:bg-[#FFC300] text-white font-bold px-5 py-2 rounded-lg transition'
                                onClick={() => navigate('/signup')}
                            >
                                Sign Up
                            </button>
                            <p>OR</p>
                            <button
                                className='bg-[#ff7b00] hover:bg-[#FFC300] text-white font-bold px-5 py-2 rounded-lg transition'
                                onClick={() => navigate('/signin')}
                            >
                                Sign In
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;