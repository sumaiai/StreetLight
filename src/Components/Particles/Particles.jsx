import { useEffect, useRef } from 'react';

const Particles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const particles = [];
        const colors = ['#FFD60A', '#FF7B00', '#FFFF3F', '#F8ED62', '#ffffff'];

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // random properties
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 8;
            const delay = Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 ${size}px ${color}`;

            container.appendChild(particle);
            particles.push(particle);
        }

        return () => {
            particles.forEach(p => p.remove());
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0" />;
};

export default Particles;