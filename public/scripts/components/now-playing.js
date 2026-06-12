document.addEventListener("DOMContentLoaded", () => {
    // 1. MARQUEE TEXT LOGIC
    const fadingContainers = document.querySelectorAll('.fading-text-container');
    const initMarquee = () => {
        fadingContainers.forEach(container => {
            const targetText = container.querySelector('.marquee-target');
            if(!targetText) return;
            const textWidth = targetText.offsetWidth;
            const containerWidth = container.offsetWidth;

            if (textWidth > containerWidth) {
                const duration = textWidth / 40; // 40px per second speed
                container.classList.add('marquee-active');
                targetText.style.animationDuration = `${duration}s`;
            } else {
                container.classList.remove('marquee-active');
                targetText.style.animationDuration = '0s';
            }
        });
    };
    initMarquee();
    window.addEventListener('resize', initMarquee);
});