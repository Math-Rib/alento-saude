export function initHomePaciente() {
  // ── Seletores ─────────────────────────────────────────────────

  const body = document.body;
  const darkModeButton = document.getElementById("toggle-dark-mode");
  const userProfile = document.querySelector(".user-profile");
  const dropdownMenu = document.getElementById("dropdownMenu");

  const helpButton = document.querySelector(".btn-ajuda");
  const modalAjuda = document.getElementById("modalAjuda");
  const closeAjuda = document.getElementById("closeAjuda");

  const modalPerfil = document.getElementById("modalPerfil");
  const fecharPerfil = document.getElementById("fecharPerfilModal");
  const btnEditarPerfil = document.getElementById("btnEditarPerfil");

  // ── Dropdown de perfil ────────────────────────────────────────

  function toggleProfileDropdown(event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("ativo");
  }

  function closeProfileDropdown(event) {
    if (!event.target.closest(".user-dropdown")) {
      dropdownMenu?.classList.remove("ativo");
    }
  }

  // ── Modal de ajuda ────────────────────────────────────────────

  function openHelpModal() {
    modalAjuda.style.display = "flex";
  }

  function closeHelpModal() {
    if (modalAjuda) modalAjuda.style.display = "none";
  }

  // ── Modal de perfil ───────────────────────────────────────────

  function openPerfilModal() {
    if (modalPerfil) modalPerfil.style.display = "flex";
  }

  function closePerfilModal() {
    if (modalPerfil) modalPerfil.style.display = "none";
  }

  function initPerfilEditar() {
    if (!btnEditarPerfil) return;

    btnEditarPerfil.addEventListener("click", () => {
      const inputs = modalPerfil.querySelectorAll("input");
      const isEditing = btnEditarPerfil.dataset.editing === "true";

      if (isEditing) {
        inputs.forEach(i => i.setAttribute("disabled", ""));
        btnEditarPerfil.innerHTML = '<i class="fa fa-pen"></i> Editar Perfil';
        btnEditarPerfil.dataset.editing = "false";
      } else {
        // Habilita tudo exceto CPF
        inputs.forEach(i => {
          if (!i.value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
            i.removeAttribute("disabled");
          }
        });
        btnEditarPerfil.innerHTML = '<i class="fa fa-check"></i> Salvar';
        btnEditarPerfil.dataset.editing = "true";
      }
    });
  }

  // ── Calendário mini ───────────────────────────────────────────

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Dias com consulta — ajuste conforme os dados reais do usuário
  const appointmentDays = { 19: true, 26: true };

  let currentCalDate = new Date();

  function renderMiniCal(date) {
    const calGrid = document.querySelector(".as-cal-grid");
    const calLabel = document.querySelector(".as-cal-nav span");
    if (!calGrid || !calLabel) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();

    calLabel.textContent = `${months[month]} ${year}`;

    // Preserva os cabeçalhos
    const dayNames = [...calGrid.querySelectorAll(".as-cal-day-name")];
    calGrid.innerHTML = "";
    dayNames.forEach(el => calGrid.appendChild(el));

    // Células do mês anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      const el = document.createElement("div");
      el.className = "as-cal-day empty";
      el.textContent = prevDays - i;
      calGrid.appendChild(el);
    }

    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement("div");
      const classes = ["as-cal-day"];

      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      if (isToday) classes.push("today");
      if (appointmentDays[d]) classes.push("has-appt");

      el.className = classes.join(" ");
      el.textContent = d;

      el.addEventListener("click", () => {
        calGrid.querySelectorAll(".as-cal-day.selecionado")
          .forEach(x => x.classList.remove("selecionado"));
        el.classList.add("selecionado");
      });

      calGrid.appendChild(el);
    }

    // Células restantes
    const totalCells = firstDay + daysInMonth;
    const remaining = Math.ceil(totalCells / 7) * 7 - totalCells;
    for (let d = 1; d <= remaining; d++) {
      const el = document.createElement("div");
      el.className = "as-cal-day empty";
      el.textContent = d;
      calGrid.appendChild(el);
    }
  }

  function initMiniCal() {
    const navBtns = document.querySelectorAll(".as-cal-nav button");
    if (!navBtns.length) return;

    const [prevBtn, nextBtn] = navBtns;

    prevBtn.addEventListener("click", () => {
      currentCalDate = new Date(
        currentCalDate.getFullYear(),
        currentCalDate.getMonth() - 1,
        1
      );
      renderMiniCal(currentCalDate);
    });

    nextBtn.addEventListener("click", () => {
      currentCalDate = new Date(
        currentCalDate.getFullYear(),
        currentCalDate.getMonth() + 1,
        1
      );
      renderMiniCal(currentCalDate);
    });

    renderMiniCal(currentCalDate);
  }

  // ── Menu mobile ───────────────────────────────────────────────
  // IMPORTANTE: o CSS usa .sidebar.aberta e .sidebar-overlay.ativo

  function initMobileMenu() {
    const btnMobile = document.getElementById("btn-menu-mobile");
    const sidebar = document.querySelector(".sidebar");
    if (!btnMobile || !sidebar) return;

    // Cria overlay se não existir no HTML
    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    btnMobile.addEventListener("click", () => {
      sidebar.classList.add("aberta");
      overlay.classList.add("ativo");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("aberta");
      overlay.classList.remove("ativo");
    });
  }

  // ── Link "Meu Perfil" no dropdown abre o modal ────────────────

  function initDropdownPerfil() {
    const linkPerfil = document.querySelector(".dropdown-content a:first-of-type");
    if (!linkPerfil || !modalPerfil) return;

    linkPerfil.addEventListener("click", e => {
      e.preventDefault();
      dropdownMenu.classList.remove("ativo");
      openPerfilModal();
    });
  }

  // ── Escape fecha tudo ─────────────────────────────────────────

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    dropdownMenu?.classList.remove("ativo");
    closeHelpModal();
    closePerfilModal();
    document.querySelector(".sidebar")?.classList.remove("aberta");
    document.querySelector(".sidebar-overlay")?.classList.remove("ativo");
  });

  // ── Init ──────────────────────────────────────────────────────

  initMiniCal();
  initMobileMenu();
  initPerfilEditar();
  initDropdownPerfil();

}