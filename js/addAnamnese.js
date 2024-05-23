const formAddAnamnese = document.querySelector(".formAddAnamnese");
const divStepButtons = document.querySelector(".div-step-buttons");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const tabs = document.getElementsByClassName("tab");
const fPacienteId = document.getElementById("pacienteId");
let currentTab = 0;

// exibe os Anamneses no select do formulario
function listarPacientesSelect() {
  fetch(urlApi + endpointPacientes, {
    headers: {
      "Authorization": `${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(paciente => {
        const optionElement = document.createElement('option');
        optionElement.value = paciente.id;
        optionElement.textContent = paciente.nome;
        fPacienteId.appendChild(optionElement);
      });
    })
    .catch(error => {
      console.error(error);
    })
}

function cadastrarAnamnese() {
  const data = getData();
  const forbidden = false;
  return new Promise((resolve, reject) => {
    if (validateForm(formAddAnamnese)) {
      fetch(urlApi + endpointAnamneses, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        method: "POST",
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) {
            forbidden = true;
            return Promise.reject();
          }
          goodWarning.textContent = "Anamnese cadastrada com sucesso!";
          resolve(response);
        })
        .catch(error => {
          if (forbidden) {
            badWarning.textContent = "Dados inválidos.";
          } else {
            badWarning.textContent = "Erro na comunicação com a API.";
          }
          reject(error);
        })
    } else {
      badWarning.textContent = "Preencha todos os campos obrigatórios";
    }
  })
}

async function showTab(n) {
  tabs[n].style.display = "block"

  if (n == 0) {
    prevBtn.style.display = "none";
    divStepButtons.style.flexDirection = "row-reverse"
  } else if (n == (tabs.length - 1)) {
    nextBtn.textContent = "Enviar";
    prevBtn.style.display = "inline";
  } else {
    nextBtn.textContent = "Próximo";
    divStepButtons.style.flexDirection = "row"
    prevBtn.style.display = "inline";
  }
  fixStepIndicator(n)
}

async function nextTab() {
  if (currentTab >= tabs.length - 1) {
    try {
      goodWarning.textContent = "";
      badWarning.textContent = "";
      await cadastrarAnamnese();
      window.location.href = "formularios.html";
    }
    catch (error) {
      verificarAutenticacao();
    }
  } else {
    tabs[currentTab].style.display = "none";
    currentTab += 1;
    showTab(currentTab);
    window.scrollTo(0, 0);
  }
}

function prevTab() {
  tabs[currentTab].style.display = "none";
  currentTab -= 1;
  showTab(currentTab);
  window.scrollTo(0, 0);
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

function getData() {
  // Seleciona todos os inputs e checkboxes dentro do formulário
  const inputs = document.querySelectorAll('.formAddAnamnese input, .formAddAnamnese select');
  const data = { usuarioId: usuarioId, };

  // Itera sobre cada elemento e adiciona seu valor ao objeto data
  inputs.forEach(input => {
    let value = input.value;

    if (input.type === 'checkbox') {
      value = input.checked;
    } else if (input.type === 'radio') {
      if (input.checked) {
        value = input.value;
      } else {
        return;
      }
    } else if (value === "") {
      value = null;
    }

    data[input.name] = value;
  });

  return data;
}

verificarAutenticacao();
listarPacientesSelect();
showTab(currentTab);
