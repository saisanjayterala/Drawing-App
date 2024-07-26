// used claudeai to explore new functions and enjoyed a lot 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tools = document.querySelectorAll('.tool');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const fillBackgroundBtn = document.getElementById('fillBackground');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'pencil';
let currentColor = colorPicker.value;
let currentLineWidth = lineWidthInput.value;
let undoStack = [];
let redoStack = [];

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Initialize canvas
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveState();

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
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

function updateTool(toolName) {
    currentTool = toolName;
    tools.forEach(tool => tool.classList.remove('active'));
    document.getElementById(toolName).classList.add('active');
    updateBrush();
}

function updateColor() {
    currentColor = colorPicker.value;
    updateBrush();
}

function updateLineWidth() {
    currentLineWidth = lineWidthInput.value;
    lineWidthValue.textContent = currentLineWidth;
    updateBrush();
}

function updateBrush() {
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
    ctx.lineWidth = currentLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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
    undoBtn.disabled = undoStack.length <= 1;
    redoBtn.disabled = redoStack.length === 0;
}

function clearCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
}

function saveDrawing() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

function fillBackground() {
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

tools.forEach(tool => {
    tool.addEventListener('click', () => updateTool(tool.id));
});

colorPicker.addEventListener('input', updateColor);
lineWidthInput.addEventListener('input', updateLineWidth);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
clearBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', saveDrawing);
fillBackgroundBtn.addEventListener('click', fillBackground);

// Initialize brush
updateBrush();