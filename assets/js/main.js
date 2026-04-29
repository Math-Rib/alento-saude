import { initDarkMode } from "./global/dark-mode.js";
import { initIndex } from "./pages/index.js";
import { initHomePaciente } from "./pages/home-paciente.js";

document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initIndex();
    initHomePaciente();
});