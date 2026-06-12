export function initHomeMedico() {

    const userProfile = document.querySelector(".user-profile");
    const calendarGrid = document.getElementById("calendar-grid");

    if (!userProfile && !calendarGrid) return;

    const helpButton = document.querySelector(".btn-ajuda");
    const modalAjuda = document.getElementById("modalAjuda");
    const closeAjuda = document.getElementById("closeAjuda");
    const modalPerfil = document.getElementById("modalPerfil");
    const fecharPerfil = document.getElementById("fecharPerfilModal");
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");

    // Modal de ajuda
    function openHelpModal() {
        if (modalAjuda) modalAjuda.style.display = "flex";
    }

    function closeHelpModal() {
        if (modalAjuda) modalAjuda.style.display = "none";
    }

    // Modal de perfil
    function openPerfilModal() {
        if (modalPerfil) modalPerfil.style.display = "flex";
    }

    function closePerfilModal() {
        if (modalPerfil) modalPerfil.style.display = "none";
    }

    function initPerfilEditar() {
        if (!btnEditarPerfil || !modalPerfil) return;

        btnEditarPerfil.addEventListener("click", () => {
            const inputs = modalPerfil.querySelectorAll("input");
            const isEditing = btnEditarPerfil.dataset.editing === "true";

            if (isEditing) {
                inputs.forEach(input => input.setAttribute("disabled", ""));
                btnEditarPerfil.innerHTML = '<i class="fa fa-pen"></i> Editar Perfil';
                btnEditarPerfil.dataset.editing = "false";
                return;
            }

            inputs.forEach(input => {
                if (input.dataset.locked !== "true") {
                    input.removeAttribute("disabled");
                }
            });

            btnEditarPerfil.innerHTML = '<i class="fa fa-check"></i> Salvar';
            btnEditarPerfil.dataset.editing = "true";
        });
    }

    // Calendario mensal
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const calendarEvents = {
        "2026-01-07": [{ label: "Clínica Geral", color: "#185FA5" }],
        "2026-01-09": [{ label: "Neurologia", color: "#0F6E56" }],
        "2026-01-14": [{ label: "Cardiologia", color: "#be185d" }],
        "2026-01-19": [{ label: "Pediatria", color: "#9333ea" }],
        "2026-01-22": [{ label: "Dermatologia", color: "#dc2626" }],
        "2026-01-26": [{ label: "Ortopedia", color: "#0891b2" }],
        "2026-01-30": [{ label: "Plantão", color: "#d97706", plantao: true }]
    };

    let currentAgendaDate = new Date(2026, 0, 1);

    function formatDateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    function createCalendarDay(day, className = "", events = []) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = `calendar-day ${className}`.trim();

        const number = document.createElement("span");
        number.className = "calendar-day-number";
        number.textContent = day;
        cell.appendChild(number);

        if (events.length) {
            const dots = document.createElement("span");
            dots.className = "calendar-event-dots";

            events.slice(0, 3).forEach(event => {
                const dot = document.createElement("span");
                dot.className = "calendar-event-dot";
                dot.style.backgroundColor = event.color;
                dots.appendChild(dot);
            });

            cell.title = events.map(event => event.label).join(", ");
            cell.appendChild(dots);
        }

        return cell;
    }

    function renderAgendaCalendar(date) {
        const grid = document.getElementById("calendar-grid");
        const monthLabel = document.getElementById("month-name");
        if (!grid || !monthLabel) return;

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const today = new Date();

        monthLabel.textContent = `${months[month]}/${year}`;
        grid.innerHTML = "";

        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            grid.appendChild(createCalendarDay(day, "other-month"));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const key = formatDateKey(year, month, day);
            const events = calendarEvents[key] || [];
            const classes = [];

            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            if (isToday) classes.push("today");
            if (events.length) classes.push("has-event");
            if (events.some(event => event.plantao)) classes.push("has-plantao");

            grid.appendChild(createCalendarDay(day, classes.join(" "), events));
        }

        const totalCells = firstDay + daysInMonth;
        const remaining = Math.ceil(totalCells / 7) * 7 - totalCells;

        for (let day = 1; day <= remaining; day++) {
            grid.appendChild(createCalendarDay(day, "other-month"));
        }
    }

    function initAgendaCalendar() {
        const monthButtons = document.querySelectorAll(".month-btn");
        if (!monthButtons.length) return;

        monthButtons.forEach(button => {
            button.addEventListener("click", () => {
                const shift = Number(button.dataset.shift || 0);
                currentAgendaDate = new Date(
                    currentAgendaDate.getFullYear(),
                    currentAgendaDate.getMonth() + shift,
                    1
                );
                renderAgendaCalendar(currentAgendaDate);
            });
        });

        renderAgendaCalendar(currentAgendaDate);
    }

    // // Menu mobile
    // function initMobileMenu() {
    //     const btnMobile = document.getElementById("btn-menu-mobile");
    //     const sidebar = document.querySelector(".sidebar");
    //     if (!btnMobile || !sidebar) return;

    //     let overlay = document.getElementById("sidebar-overlay");
    //     if (!overlay) {
    //         overlay = document.createElement("div");
    //         overlay.id = "sidebar-overlay";
    //         overlay.className = "sidebar-overlay";
    //         document.body.appendChild(overlay);
    //     }

    //     function openSidebar() {
    //         sidebar.classList.add("aberta", "open");
    //         overlay.classList.add("ativo", "open");
    //         btnMobile.setAttribute("aria-expanded", "true");
    //     }

    //     function closeSidebar() {
    //         sidebar.classList.remove("aberta", "open");
    //         overlay.classList.remove("ativo", "open");
    //         btnMobile.setAttribute("aria-expanded", "false");
    //     }

    //     function toggleSidebar() {
    //         const isOpen = sidebar.classList.contains("aberta") || sidebar.classList.contains("open");
    //         if (isOpen) {
    //             closeSidebar();
    //         } else {
    //             openSidebar();
    //         }
    //     }

    //     btnMobile.setAttribute("aria-controls", "sidebar");
    //     btnMobile.setAttribute("aria-expanded", "false");
    //     btnMobile.addEventListener("click", toggleSidebar);
    //     overlay.addEventListener("click", closeSidebar);

    //     sidebar.querySelectorAll("a").forEach(link => {
    //         link.addEventListener("click", closeSidebar);
    //     });

    //     window.addEventListener("resize", () => {
    //         if (window.innerWidth > 768) {
    //             closeSidebar();
    //         }
    //     });
    // }

    // // Aplicar Event Listeners Globais
    // if (userProfile && dropdownMenu) {
    //     userProfile.addEventListener("click", toggleProfileDropdown);
    //     document.addEventListener("click", closeProfileDropdown);
    // }

    helpButton?.addEventListener("click", openHelpModal);
    closeAjuda?.addEventListener("click", closeHelpModal);
    modalAjuda?.addEventListener("click", event => {
        if (event.target === modalAjuda) closeHelpModal();
    });

    const btnAbrirPerfil = document.querySelector("#dropdownMenu a:not(.logout-item)");
    btnAbrirPerfil?.addEventListener("click", event => {
        event.preventDefault();
        dropdownMenu?.classList.remove("ativo");
        openPerfilModal();
    });

    fecharPerfil?.addEventListener("click", closePerfilModal);
    modalPerfil?.addEventListener("click", event => {
        if (event.target === modalPerfil) closePerfilModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        dropdownMenu?.classList.remove("ativo");
        closeHelpModal();
        closePerfilModal();
        document.querySelector(".sidebar")?.classList.remove("aberta", "open");
        document.getElementById("sidebar-overlay")?.classList.remove("ativo", "open");
        document.getElementById("btn-menu-mobile")?.setAttribute("aria-expanded", "false");
    });

    // NOVA FUNÇÃO: Carrega as informações dinâmicas do médico logado
    async function carregarDadosDoMedico() {
        try {
            const resposta = await fetch('/api/medico/perfil');
            
            // Segurança: Se a rota falhar (ex: não logado), não tenta ler o JSON para não quebrar a página
            if (!resposta.ok) {
                console.error("Erro na requisição. Usuário pode estar deslogado.");
                return;
            }

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                const dadosUsuario = resultado.dados.usuario;
                
                // Atualiza o nome do médico na barra lateral/topo
                const spanNome = document.querySelector('.doctor-name');
                if (spanNome) spanNome.innerText = dadosUsuario.nome_completo;
                
                // Preenche os campos do formulário no modal de perfil usando os IDs criados
                const inputNome = document.getElementById('perfilNome');
                const inputEmail = document.getElementById('perfilEmail');
                const inputCpf = document.getElementById('perfilCpf');

                if (inputNome) inputNome.value = dadosUsuario.nome_completo;
                if (inputEmail) inputEmail.value = dadosUsuario.email;
                if (inputCpf) inputCpf.value = dadosUsuario.cpf;
            } else {
                console.error("Erro do backend:", resultado.mensagem);
            }
        } catch (erro) {
            console.error("Erro na comunicação com a API:", erro);
        }
    }

    // DISPARO SEGURO DE TODOS OS COMPONENTES INTERNOS
    carregarDadosDoMedico();
    initAgendaCalendar();
    
    initPerfilEditar();

} 