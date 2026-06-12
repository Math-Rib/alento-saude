// main.js
import { initDarkMode } from "./global/dark_mode.js";
import { initGlobalLayout } from "./global/layout.js";
import { initIndex } from "./pages/index.js";
import { initHomePaciente } from "./pages/home_paciente.js";
import { initHistoricoPaciente } from "./pages/historico_paciente.js";
import { initHomeMedico } from "./pages/home_medico.js";
import { initHomeAdmin } from "./pages/home_admin.js";
import { initGestaoEspecialidades } from "./pages/gestao_especialidades.js";

document.addEventListener("DOMContentLoaded", () => {
    
    // COMPONENTES GLOBAIS
    try {
        initDarkMode();
        initGlobalLayout(); // Inicializa dropdowns e menu mobile em qualquer tela
    } catch (error) {
        console.error("Erro ao carregar componentes globais (Header/Menus):", error);
    }
    
    // COMPONENTES ESPECÍFICOS DE CADA PÁGINA
    const path = window.location.pathname;

    try {
        if (path === "/" || path.includes("index")) {
            initIndex();
        }
        if (path.includes("home_paciente")) {
            initHomePaciente();
        }
        if (path.includes("historico_paciente")) {
            initHistoricoPaciente();
        }
        if (path.includes("home_medico")) {
            initHomeMedico();
        }
        if (path.includes("home_admin")) {
            initHomeAdmin();
        }
        if (path.includes("gestao_especialidades")) {
            initGestaoEspecialidades();
        }
    } catch (error) {
        console.error("Erro ao inicializar scripts específicos da página atual:", error);
    }
});