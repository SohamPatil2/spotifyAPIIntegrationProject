// =======================================================================
// 1. THE MASTER FUNCTION (The Physics Engine)
// =======================================================================
window.applyTilt = function(element, options = {}) {
    if (!element || element.tiltInitialized) return;
    element.tiltInitialized = true;

    const config = {
        maxTilt: parseFloat(options.maxTilt) || 15,
        scaleHover: parseFloat(options.scaleHover) || 1.05,
        disableOnMobile: options.disableOnMobile !== "false",
        speed: options.speed || "400ms"
    };

    let updateCall = null;
    
    // Timeout ensures your CSS has fully painted the screen before we read it
    setTimeout(() => {
        // 1. Preserve original CSS transitions (protects your hover colors/widths)
        let baseTransition = window.getComputedStyle(element).transition;
        if (baseTransition === "all 0s ease 0s" || baseTransition === "") {
            baseTransition = "";
        } else {
            // Remove any existing transform transitions to prevent CSS fighting
            baseTransition = baseTransition.split(',').filter(t => !t.includes('transform')).join(', ');
            if (baseTransition.trim().length > 0) baseTransition += ", ";
        }

        // 2. MOUSE ENTER: Fast transition to "catch" the cursor
        element.addEventListener('mouseenter', () => {
            if (config.disableOnMobile && window.innerWidth <= 600) return;
            element.style.transition = `${baseTransition}transform 50ms ease-out`;
        });

        // 3. MOUSE MOVE: Hardware-accelerated rendering
        element.addEventListener('mousemove', (e) => {
            if (config.disableOnMobile && window.innerWidth <= 600) return;

            // FIX: Cancels pending frames to prevent the "dead on 2nd hover" lockup
            if (updateCall) cancelAnimationFrame(updateCall);

            updateCall = requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                const xPercent = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const yPercent = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

                element.style.transform = `perspective(1000px) scale(${config.scaleHover}) rotateX(${-yPercent * config.maxTilt}deg) rotateY(${xPercent * config.maxTilt}deg)`;
            });
        });

        // 4. MOUSE LEAVE: Smooth return to origin
        element.addEventListener('mouseleave', () => {
            if (config.disableOnMobile && window.innerWidth <= 600) return;
            if (updateCall) cancelAnimationFrame(updateCall);
            
            element.style.transition = `${baseTransition}transform ${config.speed} ease-out`;
            
            // FIX: "Force Reflow" guarantees the browser updates the speed before moving the element
            void element.offsetWidth; 
            
            element.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    }, 100); // 100ms delay to let EJS compile the DOM safely
};

// =======================================================================
// 2. THE AUTO-SCANNER
// =======================================================================
const scanAndAttachPhysics = () => {
    const tiltElements = document.querySelectorAll('.interactive-tilt');
    
    tiltElements.forEach(element => {
        window.applyTilt(element, {
            maxTilt: element.getAttribute('data-tilt-max'),
            scaleHover: element.getAttribute('data-tilt-scale'),
            disableOnMobile: element.getAttribute('data-tilt-mobile-disable'),
            speed: element.getAttribute('data-tilt-speed')
        });
    });
};

// =======================================================================
// 3. THE INITIALIZATION TRIGGERS
// =======================================================================
document.addEventListener("DOMContentLoaded", () => {
    scanAndAttachPhysics();
    const observer = new MutationObserver(scanAndAttachPhysics);
    observer.observe(document.body, { childList: true, subtree: true });
});