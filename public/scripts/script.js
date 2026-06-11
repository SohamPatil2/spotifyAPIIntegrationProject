const root = document.documentElement;
const card = document.getElementById('card');
const skeleton = document.getElementById('skeleton');
const submitBtn = document.getElementById('submitBtn');
const pulseRing = document.getElementById('pulseRing');

let isSubmitting = false;
let ticking = false; // System frame loop guard

// 1. SYSTEM SKELETON RESET ENGINE
function toggleSkeleton() {
    skeleton.classList.remove('hidden');
    setTimeout(() => { skeleton.classList.add('hidden'); }, 2500);
}
// Run standard boot phase delay hide
setTimeout(() => { skeleton.classList.add('hidden'); }, 1800);


// 2. OPTIMIZED HIGH-FRAMERATE MOUSE PERFORMANCE ENGINE
window.addEventListener('mousemove', (e) => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const cardRect = card.getBoundingClientRect();

            // Calculate Mouse coordinates relative to the EXACT center of the screen
            const mouseX = e.clientX - (window.innerWidth / 2);
            const mouseY = e.clientY - (window.innerHeight / 2);
        
            const rangeBuffer = parseFloat(getComputedStyle(root).getPropertyValue('--card-activation-range'));
            const cardSensitivity = parseFloat(getComputedStyle(root).getPropertyValue('--card-tilt-sensitivity'));
            const btnSensitivity = parseFloat(getComputedStyle(root).getPropertyValue('--btn-tilt-sensitivity'));
        
            // CARD TILT LOGIC
            const insideCardX = e.clientX >= (cardRect.left - rangeBuffer) && e.clientX <= (cardRect.right + rangeBuffer);
            const insideCardY = e.clientY >= (cardRect.top - rangeBuffer) && e.clientY <= (cardRect.bottom + rangeBuffer);
        
            let cardTiltX = 0;
            let cardTiltY = 0;
        
            if (insideCardX && insideCardY) {
                cardTiltX = (mouseY / (window.innerHeight / 2)) * -cardSensitivity; 
                cardTiltY = (mouseX / (window.innerWidth / 2)) * cardSensitivity;
            }
        
            card.style.transform = `rotateX(${cardTiltX}deg) rotateY(${cardTiltY}deg)`;
        
            // BUTTON TILT LOGIC
            const strictlyInsideCardX = e.clientX >= cardRect.left && e.clientX <= cardRect.right;
            const strictlyInsideCardY = e.clientY >= cardRect.top && e.clientY <= cardRect.bottom;
        
            if (strictlyInsideCardX && strictlyInsideCardY) {
                const btnRect = submitBtn.getBoundingClientRect();
                const btnCenterX = btnRect.left + btnRect.width / 2;
                const btnCenterY = btnRect.top + btnRect.height / 2;
                
                const btnMouseX = e.clientX - btnCenterX;
                const btnMouseY = e.clientY - btnCenterY;
        
                const btnTiltX = (btnMouseY / (btnRect.height * 1.5)) * -btnSensitivity;
                const btnTiltY = (btnMouseX / (btnRect.width * 1.5)) * btnSensitivity;
        
                submitBtn.style.transform = `rotateX(${btnTiltX}deg) rotateY(${btnTiltY}deg)`;
            } else {
                submitBtn.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
            
            // Re-open the loop gateway for the next browser draw refresh cycle
            ticking = false;
        });
        
        ticking = true;
    }
});

// RE-CENTER GRACEFULLY ON DEPARTURE
document.body.addEventListener('mouseleave', () => {
    card.style.transition = 'background 0.4s ease, border-color 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, top 0.4s ease';
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    submitBtn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    submitBtn.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

document.body.addEventListener('mouseenter', () => {
    card.style.transition = 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, top 0.4s ease';
    submitBtn.style.transition = 'none';
});

// FORM SUBMIT INTERACTION PHYSICS DISPATCH
// FORM SUBMIT INTERACTION PHYSICS DISPATCH
submitBtn.addEventListener('click', (e) => {
    const form = document.getElementById('loginForm');
    
    // 1. If the user typed "abc" instead of an email, stop the animation and let the browser warn them!
    if (!form.checkValidity()) {
        return; 
    }
    
    // 2. If the data is valid, pause the submission to run the animation
    e.preventDefault();
    
    isSubmitting = true;
    card.classList.remove('submitting');
    pulseRing.classList.remove('executing-pulse');
    
    void card.offsetWidth; 
    
    card.classList.add('submitting');
    pulseRing.classList.add('executing-pulse');
    
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY }));
    
    // 3. Submit the verified data after the shockwave clears
    setTimeout(() => {
        isSubmitting = false;
        card.classList.remove('submitting');
        pulseRing.classList.remove('executing-pulse');
        form.submit();
    }, 1500);
});

/* SLIDER DATA CONTROL SYNCHRONIZERS */
document.getElementById('opacityGridSlider').addEventListener('input', (e) => {
    const val = e.target.value / 10;
    root.style.setProperty('--max-opacity', val);
    document.getElementById('opacityGridVal').innerText = val;
});

document.getElementById('flickerSpeedSlider').addEventListener('input', (e) => {
    const val = (e.target.value / 10).toFixed(1);
    root.style.setProperty('--flicker-speed', `${val}s`);
    document.getElementById('flickerSpeedVal').innerText = `${val}s`;
});

document.getElementById('cardRangeSlider').addEventListener('input', (e) => {
    root.style.setProperty('--card-activation-range', e.target.value);
    document.getElementById('cardRangeVal').innerText = `${e.target.value}px`;
});

document.getElementById('cardTiltSlider').addEventListener('input', (e) => {
    root.style.setProperty('--card-tilt-sensitivity', e.target.value);
    document.getElementById('cardTiltVal').innerText = e.target.value;
});

document.getElementById('btnTiltSlider').addEventListener('input', (e) => {
    root.style.setProperty('--btn-tilt-sensitivity', e.target.value);
    document.getElementById('btnTiltVal').innerText = e.target.value;
});