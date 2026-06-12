document.addEventListener("DOMContentLoaded", () => {
    // =======================================================
    // 1. MOBILE SIDEBAR DRAWER LOGIC
    // =======================================================
    const wrapper = document.querySelector(".main-dashboard-wrapper");
    const openBtn = document.getElementById("mobileTriggerBtn");
    const closeBtn = document.getElementById("closeSidebarBtn");

    if (wrapper && openBtn && closeBtn) {
        openBtn.addEventListener("click", () => {
            wrapper.classList.add("active-sidebar");
            document.body.style.overflow = "hidden"; 
        });

        closeBtn.addEventListener("click", () => {
            wrapper.classList.remove("active-sidebar");
            document.body.style.overflow = "auto";
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                wrapper.classList.remove("active-sidebar");
                document.body.style.overflow = "auto";
            }
        });
    }
});