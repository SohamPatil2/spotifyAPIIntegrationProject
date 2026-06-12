document.addEventListener("DOMContentLoaded", () => {
    const playerPanel = document.getElementById("playerPanel");
    const playPauseBtn = document.getElementById("playPauseBtn");
    
    if (!playerPanel || !playPauseBtn) return;

    const playPauseTooltip = document.getElementById("playPauseTooltip");
    const iconPlay = playPauseBtn.querySelector(".icon-play");
    const iconPause = playPauseBtn.querySelector(".icon-pause");

    const volumeSlider = document.getElementById("volumeSlider");
    const trackSlider = document.getElementById("trackSlider");
    const volumeMuteBtn = document.getElementById("volumeMuteBtn");
    
    let currentVolume = parseInt(volumeSlider.value);
    let isMuted = false;
    let trackInterval;

    // 1. PLAY/PAUSE & EXPANSION PHYSICS
    playPauseBtn.addEventListener("click", () => {
        const isPaused = playPauseBtn.getAttribute("data-state") === "paused";
        
        if (isPaused) {
            playerPanel.classList.remove("state-collapsed"); // Expands player
            playPauseBtn.setAttribute("data-state", "playing");
            playPauseBtn.setAttribute("data-tooltip", "Pause");
            if(playPauseTooltip) playPauseTooltip.textContent = "Pause";
            iconPlay.classList.add("hidden-state");
            iconPause.classList.remove("hidden-state");
            startMockTrack();
        } else {
            playPauseBtn.setAttribute("data-state", "paused");
            playPauseBtn.setAttribute("data-tooltip", "Play");
            if(playPauseTooltip) playPauseTooltip.textContent = "Play";
            iconPause.classList.add("hidden-state");
            iconPlay.classList.remove("hidden-state");
            clearInterval(trackInterval);
        }
    });

    // 2. DYNAMIC SLIDER ENGINE
    const updateSliderFill = (slider) => {
        if(!slider) return;
        const percentage = (slider.value / slider.max) * 100;
        slider.style.setProperty('--val', `${percentage}%`);
    };

    if(volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            updateSliderFill(e.target);
            currentVolume = parseInt(e.target.value);
            if (currentVolume > 0 && isMuted) isMuted = false;
        });
    }

    if(trackSlider) {
        trackSlider.addEventListener("input", (e) => {
            updateSliderFill(e.target);
            document.getElementById("currentTime").textContent = formatTime(e.target.value);
        });
    }

    if(volumeMuteBtn) {
        volumeMuteBtn.addEventListener("click", () => {
            if (!isMuted) {
                isMuted = true;
                if(volumeSlider) volumeSlider.value = 0;
            } else {
                isMuted = false;
                if(volumeSlider) volumeSlider.value = currentVolume === 0 ? 50 : currentVolume;
            }
            updateSliderFill(volumeSlider);
        });
    }

    // 3. HELPERS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startMockTrack = () => {
        if(!trackSlider) return;
        clearInterval(trackInterval);
        trackSlider.max = 225; 
        trackInterval = setInterval(() => {
            if (parseInt(trackSlider.value) >= parseInt(trackSlider.max)) {
                clearInterval(trackInterval);
            } else {
                trackSlider.value = parseInt(trackSlider.value) + 1;
                updateSliderFill(trackSlider);
                const ct = document.getElementById("currentTime");
                if(ct) ct.textContent = formatTime(trackSlider.value);
            }
        }, 1000);
    };

    if(volumeSlider) updateSliderFill(volumeSlider);
    if(trackSlider) updateSliderFill(trackSlider);
});