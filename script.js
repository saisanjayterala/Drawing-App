// used claudeai to explore new functions and enjoyed a lot 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const colorSwatches = document.querySelectorAll('.color-swatch');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const brushTypeSelect = document.getElementById('brushType');
const fillStyleSelect = document.getElementById('fillStyle');
const shapeSelect = document.getElementById('shape');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
const fileInput = document.getElementById('fileInput');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = colorPicker.value;
let currentFillStyle = 'stroke';
let currentShape = 'freehand';
let undoStack = [];
let redoStack = [];

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    if (currentShape !== 'freehand') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }
}

function draw(e) {
    if (!isDrawing) return;
    
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    if (currentShape === 'freehand') {
        drawFreehand(currentX, currentY);
    } else {
        drawShape(currentX, currentY);
    }
}

function drawFreehand(currentX, currentY) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    [lastX, lastY] = [currentX, currentY];
}

function drawShape(currentX, currentY) {
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(canvasData, 0, 0);

    ctx.beginPath();
    switch (currentShape) {
        case 'line':
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            break;
        case 'rectangle':
            ctx.rect(lastX, lastY, currentX - lastX, currentY - lastY);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
            ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
            break;
    }

    if (currentFillStyle === 'fill') {
        ctx.fill();
    }
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
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

function updateFillStyle() {
    currentFillStyle = fillStyleSelect.value;
}

function updateShape() {
    currentShape = shapeSelect.value;
}

function updateBrush() {
    ctx.strokeStyle = brushTypeSelect.value === 'eraser' ? '#ffffff' : currentColor;
    ctx.fillStyle = currentColor;
}

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        loadState(undoStack[undoStack.length - 1]);
    }
    updateUndoRedoButtons();
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        loadState(undoStack[undoStack.length - 1]);
    }
    updateUndoRedoButtons();
}

function loadState(state) {
    let img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

function updateUndoRedoButtons() {
    undoButton.disabled = undoStack.length <= 1;
    redoButton.disabled = redoStack.length === 0;
}

function saveDrawing() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

function loadDrawing() {
    fileInput.click();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                saveState();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('input', updateColor);
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        currentColor = swatch.style.backgroundColor;
        colorPicker.value = rgbToHex(currentColor);
        updateBrush();
    });
});
lineWidthInput.addEventListener('input', updateLineWidth);
brushTypeSelect.addEventListener('change', updateBrushType);
fillStyleSelect.addEventListener('change', updateFillStyle);
shapeSelect.addEventListener('change', updateShape);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
saveButton.addEventListener('click', saveDrawing);
loadButton.addEventListener('click', loadDrawing);
fileInput.addEventListener('change', handleFileSelect);

// Helper function to convert RGB to HEX
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgbValues) return rgb; // If it's already a hex value or invalid
    const r = parseInt(rgbValues[1]);
    const g = parseInt(rgbValues[2]);
    const b = parseInt(rgbValues[3]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Set initial brush style
updateLineWidth();
updateBrushType();
updateFillStyle();
updateShape();
saveState();