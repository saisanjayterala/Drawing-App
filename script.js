const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');

// Set canvas size
canvas.width = 500;
canvas.height = 400;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateColor() {
    ctx.strokeStyle = colorPicker.value;
}

function updateLineWidth() {
    ctx.lineWidth = lineWidthInput.value;
    lineWidthValue.textContent = lineWidthInput.value;
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('input', updateColor);
lineWidthInput.addEventListener('input', updateLineWidth);

// Set initial line style
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = lineWidthInput.value;
ctx.lineCap = 'round';

// Initial update of line width display
updateLineWidth();