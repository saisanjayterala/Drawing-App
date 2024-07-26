// used claudeai to explore new functions and enjoyed a lot 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const brushTypeSelect = document.getElementById('brushType');
const fillStyleSelect = document.getElementById('fillStyle');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const saveButton = document.getElementById('save');

canvas.width = 800;
canvas.height = 600;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = colorPicker.value;
let currentFillStyle = 'stroke';
let undoStack = [];
let redoStack = [];

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    if (currentFillStyle === 'fill') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }
}

function draw(e) {
    if (!isDrawing) return;
    
    if (currentFillStyle === 'stroke') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else {
        ctx.lineTo(e.offsetX, e.offsetY);
    }
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

    function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        if (currentFillStyle === 'fill') {
            ctx.closePath();
            ctx.fill();
        }
        saveState();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

function updateColor() {
    currentColor=  colorPicker.value;
    updateBrush();
}

function updateLineWidth() {
    ctx.lineWidth= lineWidthInput.value;
    lineWidthValue.textContent= lineWidthInput.value;
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

function updateBrush() {
    ctx.strokeStyle = brushTypeSelect.value=== 'eraser' ? '#ffffff' : currentColor;
    ctx.fillStyle = currentColor;
}

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length> 1) {
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

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('input', updateColor);
lineWidthInput.addEventListener('input', updateLineWidth);
brushTypeSelect.addEventListener('change', updateBrushType);
fillStyleSelect.addEventListener('change', updateFillStyle);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
saveButton.addEventListener('click', saveDrawing);

updateLineWidth();
updateBrushType();
updateFillStyle();
saveState();