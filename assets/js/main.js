import { initDarkMode } from "./global/dark_mode.js";
import { initIndex } from "./pages/index.js";
import { initHomePaciente } from "./pages/home_paciente.js";
import { initHistoricoPaciente } from "./pages/historico_paciente.js"

document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initIndex();
    initHomePaciente();
    initHistoricoPaciente();
});