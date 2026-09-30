/**
 * Theme Toggle & Persistence
 * Manages light/dark mode with localStorage and system preference detection
 */

(function () {
    const STORAGE_KEY = 'ay_portfolio_theme';
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    // Determine initial theme
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    // Apply theme
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    }

    // Toggle theme with smooth celestial transition
    function toggleTheme() {
        const isLight = body.classList.contains('light-mode');
        const nextTheme = isLight ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    }

    // Initialize on load
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // Event listener for toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
})();
