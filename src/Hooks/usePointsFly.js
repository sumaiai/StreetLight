import { useCallback } from 'react';

const usePointsFly = () => {
    const flyPoints = useCallback((amount, x, y) => {
        const el = document.createElement('div');
        el.classList.add('points-fly');
        el.textContent = `+${amount} ⭐`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }, []);

    return flyPoints;
};

export default usePointsFly;