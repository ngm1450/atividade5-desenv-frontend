(() => {
  // ======== MODELOS ========
  class Pessoa {
    constructor(nome, cpf) {
      this._nome = nome ?? "";
      this._cpf = cpf ?? "";
    }
    get nome() { return this._nome; }
    set nome(v) { this._nome = String(v ?? ""); }

    get cpf() { return this._cpf; }
    set cpf(v) { this._cpf = String(v ?? ""); }

    mostrarDadosPessoa() {
      return `Pessoa: ${this.nome} (CPF: ${this.cpf})`;
    }
  }

  class Morador extends Pessoa {
    constructor(nome, cpf, codigoAcesso) {
      super(nome, cpf);
      this._codigoAcesso = codigoAcesso ?? "";
    }
    get codigoAcesso() { return this._codigoAcesso; }
    set codigoAcesso(v) { this._codigoAcesso = String(v ?? ""); }

    mostrarDadosMorador() {
      return `Morador: ${this.nome} (CPF: ${this.cpf}) — Código de Acesso: ${this.codigoAcesso}`;
    }
  }

  class Edificio {
    constructor(nome, endereco, bairro, cidade, estado) {
      this._nome = nome ?? "";
      this._endereco = endereco ?? "";
      this._bairro = bairro ?? "";
      this._cidade = cidade ?? "";
      this._estado = estado ?? "";
    }
    get nome() { return this._nome; } set nome(v) { this._nome = String(v ?? ""); }
    get endereco() { return this._endereco; } set endereco(v) { this._endereco = String(v ?? ""); }
    get bairro() { return this._bairro; } set bairro(v) { this._bairro = String(v ?? ""); }
    get cidade() { return this._cidade; } set cidade(v) { this._cidade = String(v ?? ""); }
    get estado() { return this._estado; } set estado(v) { this._estado = String(v ?? ""); }

    mostrarDadosEdificio() {
      const end = [this.endereco, this.bairro, `${this.cidade} - ${this.estado}`]
        .filter(Boolean).join(", ");
      return `Edifício: ${this.nome}${end ? ` — Endereço: ${end}` : ""}`;
    }
  }

  class Apartamento {
    constructor(numero, andar, bloco, morador, edificio) {
      this._numero = Number(numero ?? 0);
      this._andar = Number(andar ?? 0);
      this._bloco = bloco ?? "";
      this._morador = morador ?? null;
      this._edificio = edificio ?? null;
    }
    get numero() { return this._numero; } set numero(v) { this._numero = Number(v ?? 0); }
    get andar() { return this._andar; } set andar(v) { this._andar = Number(v ?? 0); }
    get bloco() { return this._bloco; } set bloco(v) { this._bloco = String(v ?? ""); }

    get morador() { return this._morador; } set morador(v) { this._morador = v; }
    get edificio() { return this._edificio; } set edificio(v) { this._edificio = v; }

    mostrarDadosApartamento() {
      const ap = `Apartamento ${this.numero}, andar ${this.andar}, bloco ${this.bloco}`;
      const mor = this.morador ? this.morador.mostrarDadosMorador() : "Sem morador";
      const ed  = this.edificio ? this.edificio.mostrarDadosEdificio() : "Sem edifício";
      return [ap, mor, ed].join("\n");
    }
  }

  Object.assign(window, { Pessoa, Morador, Edificio, Apartamento });

  // ======== UI HELPERS ========
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    for (const child of [].concat(children)) {
      if (child == null) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  // Estado simples em memória
  const pessoas = [];
  const moradores = [];
  const edificios = [];
  const apartamentos = [];

  function atualizarSeletores(selectMorador, selectEdificio) {
    // Moradores
    selectMorador.innerHTML = '<option value="">Selecione…</option>';
    moradores.forEach((m, idx) => {
      const opt = el("option", { value: idx });
      opt.textContent = `${m.nome} • ${m.cpf}`;
      selectMorador.appendChild(opt);
    });
    // Edifícios
    selectEdificio.innerHTML = '<option value="">Selecione…</option>';
    edificios.forEach((e, idx) => {
      const opt = el("option", { value: idx });
      opt.textContent = `${e.nome} • ${e.cidade}/${e.estado}`;
      selectEdificio.appendChild(opt);
    });
  }

  function msg(node, html, cls = "") {
    node.innerHTML = html;
    node.className = "out " + cls;
  }

  // ======== RENDER ========
  function renderCard() {
    const container = document.querySelector("main.container");
    if (!container) return;

    const card = el("section", { class: "card", id: "q-apart" }, [
      el("header", {}, [
        el("h2", { html: "3) Modelagem — Apartamento / Morador / Pessoa / Edifício" }),
        el("span", { class: "badge" }, ["10,0 pts"]),
      ]),
    ]);

    const content = el("div", { class: "content" });
    card.appendChild(content);

    // ---- Bloco Pessoa ----
    const outPessoa = el("div", { class: "out", id: "q3-out-pessoa", "aria-live": "polite" });
    const pessoaGrid = el("div", { class: "grid cols-2" }, [
      el("div", {}, [el("label", { for: "q3-pnome", html: "Nome (Pessoa)" }), el("input", { id: "q3-pnome", placeholder: "Ex.: Ana" })]),
      el("div", {}, [el("label", { for: "q3-pcpf", html: "CPF (Pessoa)" }), el("input", { id: "q3-pcpf", placeholder: "Ex.: 123.456.789-00" })]),
    ]);
    const btnPessoa = el("div", { class: "actions" }, [
      el("button", { class: "btn-primary", id: "q3-add-pessoa" }, ["Instanciar Pessoa"]),
    ]);
    content.append(
      el("h3", { html: "Pessoa" }),
      pessoaGrid, btnPessoa, outPessoa
    );

    // ---- Bloco Morador ----
    const outMorador = el("div", { class: "out", id: "q3-out-morador", "aria-live": "polite" });
    const moradorGrid = el("div", { class: "grid cols-2" }, [
      el("div", {}, [el("label", { for: "q3-mnome", html: "Nome (Morador)" }), el("input", { id: "q3-mnome", placeholder: "Ex.: Bruno" })]),
      el("div", {}, [el("label", { for: "q3-mcpf", html: "CPF (Morador)" }), el("input", { id: "q3-mcpf", placeholder: "Ex.: 987.654.321-00" })]),
      el("div", {}, [el("label", { for: "q3-mcod", html: "Código de Acesso" }), el("input", { id: "q3-mcod", placeholder: "Ex.: A1B2C3" })]),
    ]);
    const btnMorador = el("div", { class: "actions" }, [
      el("button", { class: "btn-primary", id: "q3-add-morador" }, ["Instanciar Morador"]),
    ]);
    content.append(
      el("h3", { html: "Morador (extends Pessoa)" }),
      moradorGrid, btnMorador, outMorador
    );

    // ---- Bloco Edifício ----
    const outEdificio = el("div", { class: "out", id: "q3-out-edificio", "aria-live": "polite" });
    const edificioGrid = el("div", { class: "grid cols-2" }, [
      el("div", {}, [el("label", { for: "q3-enome", html: "Nome do Edifício" }), el("input", { id: "q3-enome", placeholder: "Ex.: Residencial Sol Nascente" })]),
      el("div", {}, [el("label", { for: "q3-eend", html: "Endereço" }), el("input", { id: "q3-eend", placeholder: "Rua Exemplo, 123" })]),
      el("div", {}, [el("label", { for: "q3-ebairro", html: "Bairro" }), el("input", { id: "q3-ebairro", placeholder: "Centro" })]),
      el("div", {}, [el("label", { for: "q3-ecidade", html: "Cidade" }), el("input", { id: "q3-ecidade", placeholder: "São José dos Pinhais" })]),
      el("div", {}, [el("label", { for: "q3-euf", html: "Estado (UF)" }), el("input", { id: "q3-euf", placeholder: "PR" })]),
    ]);
    const btnEdificio = el("div", { class: "actions" }, [
      el("button", { class: "btn-primary", id: "q3-add-edificio" }, ["Instanciar Edifício"]),
    ]);
    content.append(
      el("h3", { html: "Edifício" }),
      edificioGrid, btnEdificio, outEdificio
    );

    // ---- Bloco Apartamento ----
    const outAp = el("div", { class: "out", id: "q3-out-ap", "aria-live": "polite" });
    const selMorador = el("select", { id: "q3-sel-morador" }, []);
    const selEdificio = el("select", { id: "q3-sel-edificio mb-10" }, []);
    atualizarSeletores(selMorador, selEdificio);

    const apGrid = el("div", { class: "grid cols-2" }, [
      el("div", {}, [el("label", { for: "q3-num", html: "Número" }), el("input", { id: "q3-num", type: "number", step: "1", placeholder: "Ex.: 101" })]),
      el("div", {}, [el("label", { for: "q3-and", html: "Andar" }), el("input", { id: "q3-and", type: "number", step: "1", placeholder: "Ex.: 1" })]),
      el("div", {}, [el("label", { for: "q3-blo", html: "Bloco" }), el("input", { id: "q3-blo", placeholder: "Ex.: A" })]),
      el("div", {}, [el("label", { for: "q3-sel-morador", html: "Morador" }), selMorador]),
      el("div", {}, [el("label", { for: "q3-sel-edificio mb-10", html: "Edifício" }), selEdificio]),
    ]);
    const btnAp = el("div", { class: "actions" }, [
      el("button", { class: "btn-primary mb-10", id: "q3-add-ap" }, ["Instanciar Apartamento"]),
    ]);

    const listaAp = el("ul", { id: "q3-lista-ap", class: "list" });
    const wrapperAp = el("div", {}, [
      el("h3", { html: "Apartamento" }),
      apGrid, btnAp, outAp,
      el("h3", { html: "Apartamentos Criados" }),
      listaAp
    ]);
    content.append(wrapperAp);

    // ======== EVENTOS ========
    card.addEventListener("click", (ev) => {
      const id = ev.target?.id;
      if (id === "q3-add-pessoa") {
        const nome = document.getElementById("q3-pnome").value.trim();
        const cpf = document.getElementById("q3-pcpf").value.trim();
        if (!nome || !cpf) return msg(outPessoa, "Preencha nome e CPF.", "warn");
        const p = new Pessoa(nome, cpf);
        pessoas.push(p);
        msg(outPessoa, p.mostrarDadosPessoa(), "ok");
      }
      if (id === "q3-add-morador") {
        const nome = document.getElementById("q3-mnome").value.trim();
        const cpf = document.getElementById("q3-mcpf").value.trim();
        const codigo = document.getElementById("q3-mcod").value.trim();
        if (!nome || !cpf || !codigo) return msg(outMorador, "Preencha nome, CPF e código de acesso.", "warn");
        const m = new Morador(nome, cpf, codigo);
        moradores.push(m);
        atualizarSeletores(selMorador, selEdificio);
        msg(outMorador, m.mostrarDadosMorador(), "ok");
      }
      if (id === "q3-add-edificio") {
        const nome = document.getElementById("q3-enome").value.trim();
        const end = document.getElementById("q3-eend").value.trim();
        const bairro = document.getElementById("q3-ebairro").value.trim();
        const cidade = document.getElementById("q3-ecidade").value.trim();
        const uf = document.getElementById("q3-euf").value.trim();
        if (!nome) return msg(outEdificio, "Informe ao menos o nome do edifício.", "warn");
        const e = new Edificio(nome, end, bairro, cidade, uf);
        edificios.push(e);
        atualizarSeletores(selMorador, selEdificio);
        msg(outEdificio, e.mostrarDadosEdificio(), "ok");
      }
      if (id === "q3-add-ap") {
        const numero = document.getElementById("q3-num").value;
        const andar = document.getElementById("q3-and").value;
        const bloco = document.getElementById("q3-blo").value.trim();
        const morIdx = selMorador.value;
        const ediIdx = selEdificio.value;
        if (numero === "" || andar === "" || !bloco) {
          return msg(outAp, "Preencha número, andar e bloco.", "warn");
        }
        if (morIdx === "" || ediIdx === "") {
          return msg(outAp, "Selecione um morador e um edifício.", "warn");
        }
        const ap = new Apartamento(Number(numero), Number(andar), bloco, moradores[morIdx], edificios[ediIdx]);
        apartamentos.push(ap);
        msg(outAp, ap.mostrarDadosApartamento().replaceAll("\n", "<br>"), "ok");

        const li = el("li", { class: "list-item" });
        li.innerHTML = `<pre>${ap.mostrarDadosApartamento()}</pre>`;
        listaAp.appendChild(li);
      }
    });

    container.appendChild(card);
  }

  // Renderiza automaticamente ao carregar
  document.addEventListener("DOMContentLoaded", renderCard);
})();
