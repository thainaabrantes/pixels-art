const button = document.getElementById('button-random-color');
const colorBlack = document.getElementById('color-black');
const color1 = document.getElementById('color-1');
const color2 = document.getElementById('color-2');
const color3 = document.getElementById('color-3');

// A cor preta é inicializada e a classe 'selected' é adicionada a ela.
colorBlack.style.backgroundColor = 'rgb(0, 0, 0)';
colorBlack.classList.add('selected');


//Essa função gera uma cor aleatória em formato RGB, evitando que seja igual à cor preta inicial.
function generateColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  let colorGenerated = `rgb(${r}, ${g}, ${b})`;

  if (colorGenerated === colorBlack.style.backgroundColor) {
    colorGenerated = `rgb(${100}, ${g}, ${b})`;
  }
  return colorGenerated;
}


// Esta função é responsável por adicionar três cores aleatórias à paleta.
// As cores são armazenadas em um array chamado backgroundColors, e esse array é salvo no localStorage como 'colorPalette'.
function addColor() {
  const backgroundColors = [];
  for (let index = 0; index < 3; index += 1) {
    const divColor = document.getElementById(`color-${index + 1}`);
    divColor.style.backgroundColor = generateColor();
    backgroundColors.push(divColor.style.backgroundColor);
  }
  localStorage.setItem('colorPalette', JSON.stringify(backgroundColors));
}


// Ao carregar a página, verifica se há uma paleta salva no localStorage. Se sim, as cores são carregadas na paleta.
// Caso contrário, a função addColor é chamada para gerar e salvar novas cores.
// Essa função também pode ser acionada através do botão "button-random-color".
if (localStorage.colorPalette) {
  const storageColorsArray = JSON.parse(localStorage.getItem('colorPalette'));

  for (let index = 0; index < 3; index += 1) {
    const divColorInitial = document.getElementById(`color-${index + 1}`);
    divColorInitial.style.backgroundColor = storageColorsArray[index];
  }
} else {
  addColor();
}
button.addEventListener('click', addColor);


// Essa função cria 25 elementos de pixel na tela, organizados em uma grade de 5x5.
function populatePixels() {
  for (let index = 0; index < 25; index += 1) {
    const div = document.createElement('div');
    div.classList.add('pixel');
    div.dataset.row = Math.floor(index / 5);
    div.dataset.col = index % 5;
    const pixelBoard = document.getElementById('pixel-board');
    pixelBoard.appendChild(div);
  }
}
populatePixels();


// Ao clicar em uma cor, a classe 'selected' é removida da cor anterior e adicionada à cor clicada.
function selectDiv(event) {
  const paletteArray = [colorBlack, color1, color2, color3];

  for (let index = 0; index < paletteArray.length; index += 1) {
    if (paletteArray[index].classList.contains('selected')) {
      paletteArray[index].classList.remove('selected');
    }
  }
  event.target.classList.add('selected');
}

colorBlack.addEventListener('click', selectDiv);
color1.addEventListener('click', selectDiv);
color2.addEventListener('click', selectDiv);
color3.addEventListener('click', selectDiv);


// Transforma os elementos de classe "pixel" obtidos pelo "getElementsByClassName" em array,
// para ser possível utilizar o "forEach".
const pixels = document.getElementsByClassName('pixel');
const pixelsArray = Array.from(pixels);

let coloredPixelsStorage = loadColoredPixels();

function loadColoredPixels() {
  if (localStorage.pixelBoard) {
    return JSON.parse(localStorage.getItem('pixelBoard'));
  }
  return [];
}

function saveColoredPixels() {
  localStorage.setItem('pixelBoard', JSON.stringify(coloredPixelsStorage));
}

function paintDiv(event) {
  const selectedBackground = document.getElementsByClassName('selected')[0].style.backgroundColor;
  const pixelToPaint = event.target;

  // É feita a validação a seguir porque o evento de clique é adicionado ao "pixel-board" logo abaixo
  // e não ao pixel em si. Para que a função atinja o pixel clicado. 
  if (pixelToPaint.classList.contains('pixel')) {
    pixelToPaint.style.backgroundColor = selectedBackground;

    const pixelId = `pixel-${pixelToPaint.dataset.row}-${pixelToPaint.dataset.col}`;

    // Procura no localstorage o index do pixel em que o id seja igual ao id do pixelToPaint
    const existingPixelIndex = coloredPixelsStorage.findIndex((element) => element.id === pixelId);

    if (existingPixelIndex !== -1) {
      // Se tem o index, atualiza a "color" do pixel no localStorage
      coloredPixelsStorage[existingPixelIndex].color = pixelToPaint.style.backgroundColor;
    } else {
      // Adiciona novo pixel ao array do localStorage
      coloredPixelsStorage.push({ id: pixelId, color: pixelToPaint.style.backgroundColor });
    }

    saveColoredPixels();
  }
}

// Adiciona as cores ao background do quadro de pixels
pixelsArray.forEach((pixel) => {
  const pixelId = `pixel-${pixel.dataset.row}-${pixel.dataset.col}`;
  const matchingPixel = coloredPixelsStorage.find((element) => element.id === pixelId);

  if (matchingPixel) {
    pixel.style.backgroundColor = matchingPixel.color;
  }
});

const pixelBoard = document.getElementById('pixel-board');
pixelBoard.addEventListener('click', paintDiv);


const btnClear = document.createElement('button');
btnClear.id = 'clear-board';
btnClear.innerText = 'Limpar';
const nextElement = document.getElementById('pixel-board');
const btnClearFather = nextElement.parentNode;
btnClearFather.insertBefore(btnClear, nextElement);

function removeBackground() {
  pixelsArray.forEach((pixel) => {
    pixel.style.removeProperty('background-color');
  });

  // Limpa o localStorage
  localStorage.removeItem('pixelBoard');

  // Reseta o array de pixels coloridos
  coloredPixelsStorage = [];
  saveColoredPixels(); // Salva a array vazia para refletir a limpeza no localStorage
}

btnClear.addEventListener('click', removeBackground);
