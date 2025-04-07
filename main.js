document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const form = document.querySelector("form");

  if (path.includes("index.html") && form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      document.querySelectorAll(".erro").forEach((el) => el.remove());

      const nome = document.querySelector("#nome-completo");
      const email = document.querySelector("#email");
      const cpf = document.querySelector("#cpf");
      const telefone = document.querySelector("#telefone");
      const genero = document.querySelector("#genero");
      const nascimento = document.querySelector("#data-nascimento");
      const identidade = document.querySelector("#identidade");

      let valido = true;

      const mostrarErro = (input, mensagem) => {
        const erro = document.createElement("small");
        erro.className = "erro";
        erro.style.color = "red";
        erro.innerText = mensagem;
        if (input && input.parentNode) {
          input.parentNode.appendChild(erro);
        }
        valido = false;
      };

      if (!nome.value.trim()) mostrarErro(nome, "⚠ O nome é obrigatório.");
      if (!email.value.trim() || !email.value.includes("@")) mostrarErro(email, "⚠ E-mail inválido.");
      if (!cpf.value.trim() || cpf.value.length < 14) mostrarErro(cpf, "⚠ CPF inválido.");
      if (!telefone.value.trim() || telefone.value.length < 14) mostrarErro(telefone, "⚠ Telefone inválido.");
      if (!genero.value) mostrarErro(genero, "⚠ Selecione um gênero.");
      if (!nascimento.value) mostrarErro(nascimento, "⚠ Data de nascimento é obrigatória.");
      if (!identidade.files.length) mostrarErro(identidade, "⚠ Anexe seu documento de identidade.");

      if (valido) {
        const dados = {
          nome: nome.value,
          email: email.value,
          cpf: cpf.value,
          telefone: telefone.value,
          genero: genero.value,
          nascimento: nascimento.value
        };

        localStorage.setItem("formData", JSON.stringify({
          ...JSON.parse(localStorage.getItem("formData") || "{}"),
          ...dados
        }));

        window.location.href = "address.html";
      }
    });

    const cpfInput = document.querySelector("#cpf");
    if (cpfInput) {
      cpfInput.addEventListener("input", () => {
        cpfInput.value = cpfInput.value
          .replace(/\D/g, "")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      });
    }

    const telInput = document.querySelector("#telefone");
    if (telInput) {
      telInput.addEventListener("input", () => {
        telInput.value = telInput.value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
      });
    }
  }

  if (path.includes("address.html")) {
    const cep = document.getElementById("cep");
    const rua = document.getElementById("rua");
    const cidade = document.getElementById("cidade");
    const numero = document.getElementById("numero");
    const estado = document.getElementById("estado");
    const comprovante = document.getElementById("comprovante");
    const btnSalvar = document.getElementById("btn-salvar-manual");
    const btnProximo = document.querySelector(".continue-button button");

    function criarErro(input, mensagem) {
      let erro = input.parentElement.querySelector(".erro-mensagem");
      if (!erro) {
        erro = document.createElement("span");
        erro.classList.add("erro-mensagem");
        erro.style.color = "red";
        erro.style.fontSize = "13px";
        input.parentElement.appendChild(erro);
      }
      erro.textContent = mensagem;
      input.classList.add("input-invalido");
    }

    function limparErro(input) {
      const erro = input.parentElement.querySelector(".erro-mensagem");
      if (erro) erro.remove();
      input.classList.remove("input-invalido");
    }

    function validarCampos() {
      let valido = true;

      const campos = [cep, rua, cidade, numero, estado];
      campos.forEach(campo => {
        if (campo.value.trim() === "") {
          criarErro(campo, "Este campo é obrigatório.");
          valido = false;
        } else {
          limparErro(campo);
        }
      });

      if (comprovante.files.length === 0) {
        alert("Por favor, envie o comprovante de residência.");
        valido = false;
      }

      return valido;
    }

    function salvarDados() {
      const dadosEndereco = {
        cep: cep.value,
        rua: rua.value,
        cidade: cidade.value,
        numero: numero.value,
        estado: estado.value,
        comprovante: comprovante.files[0]?.name || ""
      };

      localStorage.setItem("dadosEndereco", JSON.stringify(dadosEndereco));
      alert("Informações salvas com sucesso!");
    }

    btnSalvar.addEventListener("click", () => {
      if (validarCampos()) {
        salvarDados();
      }
    });

    btnProximo.addEventListener("click", (e) => {
      if (!validarCampos()) {
        e.preventDefault();
      } else {
        salvarDados();
        window.location.href = "./choice.html";
      }
    });

    const dadosSalvos = JSON.parse(localStorage.getItem("dadosEndereco"));
    if (dadosSalvos) {
      cep.value = dadosSalvos.cep || "";
      rua.value = dadosSalvos.rua || "";
      cidade.value = dadosSalvos.cidade || "";
      numero.value = dadosSalvos.numero || "";
      estado.value = dadosSalvos.estado || "";
    }
  }
});

if (path.includes("choice.html")) {
  const trilhas = document.querySelectorAll(".choice-input input[type='radio']");
  const termos = document.getElementById("termos");
  const idInput = document.getElementById("usuario-id");
  const senhaInput = document.getElementById("usuario-senha");
  const btnSalvar = document.getElementById("btn-salvar-manual");
  const btnFinalizar = document.querySelector(".inscricao-button button");

  function mostrarErro(input, mensagem) {
    removerErro(input);
    const erro = document.createElement("small");
    erro.className = "erro";
    erro.style.color = "red";
    erro.innerText = mensagem;
    input.parentElement.appendChild(erro);
    input.classList.add("input-invalido");
  }

  function removerErro(input) {
    const erro = input.parentElement.querySelector(".erro");
    if (erro) erro.remove();
    input.classList.remove("input-invalido");
  }

  function validarEscolha() {
    let trilhaEscolhida = "";
    trilhas.forEach((trilha) => {
      if (trilha.checked) {
        trilhaEscolhida = trilha.id;
      }
    });

    if (!trilhaEscolhida) {
      alert("Por favor, selecione uma trilha de aprendizagem.");
      return null;
    }

    if (!termos.checked) {
      alert("Você precisa aceitar os Termos e Condições.");
      return null;
    }

    if (!idInput.value.trim()) {
      mostrarErro(idInput, "ID é obrigatório.");
      return null;
    }

    if (!senhaInput.value.trim()) {
      mostrarErro(senhaInput, "Senha é obrigatória.");
      return null;
    }

    removerErro(idInput);
    removerErro(senhaInput);

    return trilhaEscolhida;
  }

  function salvarDados() {
    const trilha = validarEscolha();
    if (!trilha) return false;

    const dadosFinais = {
      trilha: trilha,
      termos: true,
      idUsuario: idInput.value.trim(),
      senhaUsuario: senhaInput.value.trim()
    };

    localStorage.setItem("dadosFinais", JSON.stringify(dadosFinais));

    localStorage.setItem("credenciais", JSON.stringify({
      id: dadosFinais.idUsuario,
      senha: dadosFinais.senhaUsuario
    }));

    alert("Informações salvas com sucesso!");
    return true;
  }

  btnSalvar.addEventListener("click", () => {
    salvarDados();
  });

  btnFinalizar.addEventListener("click", () => {
    const sucesso = salvarDados();
    if (sucesso) {
      alert("Inscrição finalizada com sucesso!");
      window.location.href = "./login.html";
    }
  });

  const salvos = JSON.parse(localStorage.getItem("dadosFinais"));
  if (salvos) {
    if (salvos.trilha) {
      const radio = document.getElementById(salvos.trilha);
      if (radio) radio.checked = true;
    }
    termos.checked = salvos.termos || false;
    idInput.value = salvos.idUsuario || "";
    senhaInput.value = salvos.senhaUsuario || "";
  }
}