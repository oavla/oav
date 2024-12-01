const container = document.createElement('div');
container.style.position = 'absolute';
container.style.top = '-18%';
container.style.left = '50%';
container.style.transform = 'translateX(-50%)';
container.style.zIndex = '10';
document.body.appendChild(container);

const ropeLength = window.innerWidth;
const ropeHeight = 150;
const numLights = 30;

const canvas = document.createElement('canvas');
canvas.width = ropeLength;
canvas.height = ropeHeight + 50;
canvas.style.position = 'absolute';
canvas.style.left = '50%';
canvas.style.transform = 'translateX(-50%)';
canvas.style.zIndex = '5';
const ctx = canvas.getContext('2d');

ctx.strokeStyle = '#8B4513';
ctx.lineWidth = 6.29;
ctx.beginPath();

const ropeYPositions = [];

for (let x = 0; x <= ropeLength; x++) {
    const a = -1 * ropeHeight / (ropeLength ** 2);
    const y = a * ((x - ropeLength / 2) ** 2) + ropeHeight;
    ropeYPositions.push(y);
    if (x === 0) {
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
    }
}
ctx.stroke();
container.appendChild(canvas);

const colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
const lightOffset = -664; 

for (let i = 0; i < numLights; i++) {
    const light = document.createElement('div');
    const socket = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];

    const xPos = Math.floor((i / (numLights -1)) * ropeLength) + lightOffset;
    const yPos = ropeYPositions[xPos - lightOffset];

    light.style.width = '10px';
    light.style.height = '25px';
    light.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
    light.style.backgroundColor = color;
    light.style.position = 'absolute';
    light.style.left = `${xPos}px`;
    light.style.right = `${yPos}px`;
    light.style.top = `${yPos + 4.90}px`;
    light.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    light.style.transform = 'translate(-50%, 0)';
    light.style.zIndex = '15';

    socket.style.width = '10px';
    socket.style.height = '5px';
    socket.style.backgroundColor = '#555';
    socket.style.borderRadius = '2px';
    socket.style.position = 'absolute';
    socket.style.top = '-5px';
    socket.style.left = '50%';
    socket.style.transform = 'translateX(-50%)';
    light.appendChild(socket);

    container.appendChild(light);

    setInterval(() => {
        if (Math.random() < 0.1) {
            light.style.boxShadow = '0 0 15px rgba(255, 255, 255, 1)';
        } else {
            light.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        }
    }, 300);
}

document.body.style.backgroundColor = '#0d0d0d';
document.body.style.margin = 0;
document.body.style.height = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
