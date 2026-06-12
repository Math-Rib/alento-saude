export function initHomePaciente() {
  // ── Seletores ─────────────────────────────────────────────────

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
    dropdownMenu?.classList.toggle("ativo");
  }

  function closeProfileDropdown(event) {
    if (!event.target.closest(".user-dropdown")) {
      dropdownMenu?.classList.remove("ativo");
    }
  }

  // ── Modal de ajuda ────────────────────────────────────────────

  function openHelpModal() {
    if (modalAjuda) modalAjuda.style.display = "flex";
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
    if (!btnEditarPerfil || !modalPerfil) return;

    btnEditarPerfil.addEventListener("click", () => {
      const inputs = modalPerfil.querySelectorAll("input");
      const isEditing = btnEditarPerfil.dataset.editing === "true";

      if (isEditing) {
        inputs.forEach(i => i.setAttribute("disabled", ""));
        btnEditarPerfil.innerHTML = '<i class="fa fa-pen"></i> Editar Perfil';
        btnEditarPerfil.dataset.editing = "false";
        return;
      }

      // Habilita tudo, EXCETO se for o campo de CPF
      inputs.forEach(i => {
        if (i.id !== "perfilCpf" && i.dataset.locked !== "true") {
          i.removeAttribute("disabled");
        }
      });
      btnEditarPerfil.innerHTML = '<i class="fa fa-check"></i> Salvar';
      btnEditarPerfil.dataset.editing = "true";
    });
  }

  // ── Calendário mini ───────────────────────────────────────────

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Dias com consulta (Mantenha estático por enquanto ou mude conforme a API)
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

    const dayNames = [...calGrid.querySelectorAll(".as-cal-day-name")];
    calGrid.innerHTML = "";
    dayNames.forEach(el => calGrid.appendChild(el));

    for (let i = firstDay - 1; i >= 0; i--) {
      const el = document.createElement("div");
      el.className = "as-cal-day empty";
      el.textContent = prevDays - i;
      calGrid.appendChild(el);
    }

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
      currentCalDate = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1);
      renderMiniCal(currentCalDate);
    });

    nextBtn.addEventListener("click", () => {
      currentCalDate = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1);
      renderMiniCal(currentCalDate);
    });

    renderMiniCal(currentCalDate);
  }

  // ── Menu mobile consolidado ───────────────────────────────────

  helpButton?.addEventListener("click", openHelpModal);
  closeAjuda?.addEventListener("click", closeHelpModal);
  modalAjuda?.addEventListener("click", event => {
    if (event.target === modalAjuda) closeHelpModal();
  });

  fecharPerfil?.addEventListener("click", closePerfilModal);
  modalPerfil?.addEventListener("click", event => {
    if (event.target === modalPerfil) closePerfilModal();
  });

  // Link "Meu Perfil" no dropdown abre o modal
  const linkPerfil = document.querySelector("#dropdownMenu a:not(.logout-item)");
  linkPerfil?.addEventListener("click", e => {
    e.preventDefault();
    dropdownMenu?.classList.remove("ativo");
    openPerfilModal();
  });

  // Escape fecha tudo
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    dropdownMenu?.classList.remove("ativo");
    closeHelpModal();
    closePerfilModal();
    document.querySelector(".sidebar")?.classList.remove("aberta");
    document.querySelector(".sidebar-overlay")?.classList.remove("ativo");
    document.querySelector('.menu-central')?.classList.remove('show');
  });

  // Lógica do Botão de Sair (Logout) com Redirecionamento
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/'; // Redireciona o paciente deslogado para a home/login
    });
  }

  // ── NOVA FUNÇÃO: Integração com a sua API de Paciente ──────────

  async function carregarDadosDoPaciente() {
    try {
      const resposta = await fetch('/api/paciente/perfil');
      if (!resposta.ok) return;

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        const dadosUsuario = resultado.dados.usuario;

        // Atualiza o nome do paciente na tela principal (mude a classe se for diferente)
        const spanNome = document.querySelector('.patient-name') || document.querySelector('.user-name');
        if (spanNome) spanNome.innerText = dadosUsuario.nome_completo;

        // Preenche os campos do formulário do modal
        const inputNome = document.getElementById('perfilNome');
        const inputEmail = document.getElementById('perfilEmail');
        const inputCpf = document.getElementById('perfilCpf'); // Garanta que o input de CPF do HTML tenha id="perfilCpf"

        if (inputNome) inputNome.value = dadosUsuario.nome_completo;
        if (inputEmail) inputEmail.value = dadosUsuario.email;
        if (inputCpf) inputCpf.value = dadosUsuario.cpf;
      } else {
        console.error("Erro do backend:", resultado.mensagem);
      }
    } catch (erro) {
      console.error("Erro ao carregar dados do paciente:", erro);
    }
  }

  // ── Inicializadores ───────────────────────────────────────────

  carregarDadosDoPaciente();
  initMiniCal();
  initPerfilEditar();
}