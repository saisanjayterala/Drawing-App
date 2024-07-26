const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const brushTypeSelect = document.getElementById('brushType');

canvas.width = 500;
canvas.height = 400;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = colorPicker.value;

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
    currentColor = colorPicker.value;
    updateBrush();
}

function updateLineWidth() {
    ctx.lineWidth = lineWidthInput.value;
    lineWidthValue.textContent = lineWidthInput.value;
}

function updateBrushType() {
    const brushType = brushTypeSelect.value;
    ctx.lineCap = brushType === 'square' ? 'butt' : 'round';
    ctx.lineJoin = brushType === 'square' ? 'miter' : 'round';
    
    if (brushType === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }
    
    updateBrush();
}

function updateBrush() {
    ctx.strokeStyle = brushTypeSelect.value === 'eraser' ? '#ffffff' : currentColor;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('input', updateColor);
lineWidthInput.addEventListener('input', updateLineWidth);
brushTypeSelect.addEventListener('change', updateBrushType);

updateLineWidth();
updateBrushType();