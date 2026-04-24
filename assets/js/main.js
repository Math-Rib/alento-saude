import { initDarkMode } from "./global/dark-mode.js";
import { initIndex } from "./pages/index.js";

document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initIndex();
});