const words = ["CASA", "PERRO", "SOL", "MAR"]; 
const gridSize = 10; // tamaño de la cuadricula 
let wordGrid;
let currentSelection = []; 
let wordsFound = []; 

// Espera a que el documento HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    document.getElementById('generateNew').addEventListener('click', startNewGame); // Boton para Reinicia el juego
});

function startNewGame() {
    wordGrid = generateEmptyGrid(gridSize); // Crea una cuadrícula vacía con guiones bajos
    currentSelection = []; 
    wordsFound = [];
    placeWordsInGrid(words, wordGrid);  // Coloca las palabras en la cuadrícula
    renderGrid(wordGrid);     // Muestra la cuadrícula en la pantalla
    renderWordsList(words);   // Muestra la lista de palabras a buscar   
}

function generateEmptyGrid(size) {
    // Se crea un array y devuelve bidimensional (matriz) de tamaño size × size, rellena con guiones bajos ('_')
    return Array(size).fill(null).map(() => Array(size).fill('_'));
}

// con esta funcion se trata de que se coloque la palabra correcta exitosamente
function placeWordsInGrid(words, grid) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * (gridSize - word.length));
            if (canPlaceWordAt(word, grid, row, col)) { // Verifica si la palabra puede colocarse sin chocar con otras
                for (let i = 0; i < word.length; i++) { // Inserta letra por letra horizontalmente
                    grid[row][col + i] = word[i];
                }
                placed = true;
            }
        }
    });
}

function canPlaceWordAt(word, grid, row, col) {
    for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '_') return false; // Si hay una letra diferente, no se puede colocar
    }
    return true;
}

function renderGrid(grid) {
    const container = document.getElementById('wordSearchContainer');
    container.innerHTML = '';//limpia el contenedor
    grid.forEach((row, rowIndex) => {// Recorre cada celda del grid para crear los elementos visuales
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');// Si es "_" genera una letra aleatoria A-Z, si no, usa la letra de la palabra
cellElement.textContent = cell === '_' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell;
    cellElement.dataset.index = rowIndex * gridSize + colIndex; // Guarda un índice lineal para poder identificarla luego
            cellElement.addEventListener('click', () => selectCell(rowIndex, colIndex, cellElement));  // Agrega el evento de selección al hacer clic
            container.appendChild(cellElement);// Agrega la celda al contenedor
        });
    });
}

function renderWordsList(words) {
    const wordsListContainer = document.getElementById('wordsList');
    wordsListContainer.innerHTML = ''; // Limpia la lista anterior
    words.forEach(word => { // Por cada palabra crea un div con su texto
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);// Atributo para luego marcarla como encontrada
        wordsListContainer.appendChild(wordElement);
    });
}

function selectCell(rowIndex, colIndex, cellElement) {
    const index = rowIndex * gridSize + colIndex;
    if (currentSelection.includes(index)) return;// Si ya fue seleccionada esta celda, se ignora
    cellElement.classList.add('selected');// Marca visualmente la celda como seleccionada
    currentSelection.push(index);

    const selectedWord = currentSelection.map(idx => {// Construye la palabra seleccionada a partir de los índices
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        return wordGrid[row][col];
    }).join('');

    // Si la palabra es válida y no fue encontrada antes
    if (words.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
        wordsFound.push(selectedWord);
        alert(`¡Has encontrado la palabra "${selectedWord}"!`);
        currentSelection.forEach(idx => {// Marca en verde las celdas de la palabra encontrada
            document.querySelector(`[data-index="${idx}"]`).classList.add('found');
        });
       
        
        // Marca la palabra en la lista
        document.querySelector(`[data-word="${selectedWord}"]`).classList.add('found');
        currentSelection = [];

        if (wordsFound.length === words.length) { // Verifica si el jugador ya encontró todas las palabras
            setTimeout(() => {
                alert('¡Has ganado!');
                startNewGame();
            }, 1000);
        }
    } else if (!words.some(word => word.startsWith(selectedWord))) { // Si la palabra no coincide con ninguna, se reinicia la selección
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.remove('selected');
        });
        currentSelection = [];
    }
}
