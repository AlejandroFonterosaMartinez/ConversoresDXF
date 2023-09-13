const fs = require('fs');
const DxfParser = require('dxf-parser');
const { createCanvas } = require('canvas');

// Ruta del archivo DXF de entrada y ruta de la imagen de salida
const inputDxfFilePath = 'ejemplo.GEO';
const outputImagePath = 'imagen.png';

// Lee el archivo DXF
const dxfContent = fs.readFileSync(inputDxfFilePath, 'utf-8');

// Analiza el archivo DXF
const parser = new DxfParser();
const dxfData = parser.parseSync(dxfContent);

// Obtén las dimensiones del dibujo
const minX = dxfData.header.$EXTMIN.x;
const minY = dxfData.header.$EXTMIN.y;
const maxX = dxfData.header.$EXTMAX.x;
const maxY = dxfData.header.$EXTMAX.y;
const width = maxX - minX;
const height = maxY - minY;

// Crea un lienzo (canvas) para la imagen
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Llena el fondo del lienzo con blanco
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);

// Establece atributos de dibujo (opcional)
ctx.strokeStyle = 'black';
ctx.lineWidth = 1;

// Dibuja el contenido del archivo DXF en el lienzo
for (const entity of dxfData.entities) {
  if (entity.type === 'LINE') {
    const startX = entity.vertices[0].x - minX;
    const startY = height - (entity.vertices[0].y - minY);
    const endX = entity.vertices[1].x - minX;
    const endY = height - (entity.vertices[1].y - minY);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

// Guarda la imagen en formato PNG
const stream = canvas.createPNGStream();
const out = fs.createWriteStream(outputImagePath);
stream.pipe(out);
out.on('finish', () => {
  console.log('Imagen generada correctamente.');
});
