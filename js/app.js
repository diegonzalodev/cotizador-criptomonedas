const formulario = document.getElementById("formulario");
const selectMoneda = document.getElementById("moneda");
const selectCripto = document.getElementById("criptomoneda");

const resultadoDiv = document.getElementById("resultado");

const templateResultado = document.getElementById("templateResultado");
const fragment = document.createDocumentFragment();

const objBusqueda = {
  moneda: "",
  criptomoneda: ""
}

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptos();
  formulario.addEventListener("submit", cotizarCripto);

  selectMoneda.addEventListener("change", capturarValor);
  selectCripto.addEventListener("change", capturarValor);
})

function consultarCriptos() {
  const url =
  "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
  
  fetch(url)
  .then(respuesta => respuesta.json())
  .then(datos => selectCriptos(datos.Data))
  .catch(error => console.log(error))
}

function selectCriptos(arreglo) {
  arreglo.forEach(cripto => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;

    selectCripto.appendChild(option);
  })
}

function capturarValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function cotizarCripto(e) {
  e.preventDefault();

  // Validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
  }

  // Consultar API
  consultarAPI(moneda,criptomoneda);
}

function consultarAPI(moneda,criptomoneda) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => mostrarHTML(cotizacion.DISPLAY[criptomoneda][moneda]))
}

function mostrarHTML(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
  const clone = templateResultado.content.cloneNode(true);
  clone.querySelector("#precio").textContent = PRICE;
  clone.querySelector("#precioAlto").textContent = HIGHDAY;
  clone.querySelector("#precioBajo").textContent = LOWDAY;
  clone.querySelector("#variacion").textContent = CHANGEPCT24HOUR;
  clone.querySelector("#ultimaActualizacion").textContent = LASTUPDATE;

  fragment.appendChild(clone);
  resultadoDiv.appendChild(fragment);
}

function mostrarSpinner() {
  limpiarHTML();

  const spinnerDiv = document.createElement("div");
  const divBounce1 = document.createElement("div");
  const divBounce2 = document.createElement("div");
  const divBounce3 = document.createElement("div");
  spinnerDiv.classList.add("spinner");
  divBounce1.classList.add("bounce1");
  divBounce2.classList.add("bounce2");
  divBounce3.classList.add("bounce3");

  spinnerDiv.appendChild(divBounce1);
  spinnerDiv.appendChild(divBounce2);
  spinnerDiv.appendChild(divBounce3);
  resultadoDiv.appendChild(spinnerDiv);
}

function mostrarAlerta(mensaje) {
  const isAlerta = document.querySelector(".error");

  if (!isAlerta) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("error");
    alertDiv.textContent = mensaje;

    formulario.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}

function limpiarHTML() {
  while(resultadoDiv.firstChild) {
    resultadoDiv.removeChild(resultadoDiv.firstChild);
  }
}