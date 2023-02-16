var script = document.createElement('script');
script.src = 'https://blockchain.info/blocks/100?format=json&cors=true&callback=handleData';
document.head.appendChild(script);

// Load the first 100 blocks from the blockchain API
const numBlocks = 100;
const apiUrl = `https://blockchain.info/blocks/${numBlocks}?format=json`;

function handleData(data) {
  console.log(data);
}




fetch(apiUrl)
  .then(response => response.json())
  .then(blocks => {
    // Loop over each block and generate a fractal image
    blocks.forEach((block, index) => {
      const seed = block.hash;
      const canvasSize = 800;
      const maxIterations = 100;

      // Create a new canvas for the fractal image
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      document.body.appendChild(canvas);

      // Draw the fractal image on the canvas
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.translate(canvasSize / 2, canvasSize);
      drawBranch(canvasSize / 4, -Math.PI / 2, canvasSize / 8, seed, maxIterations, ctx);

      // Save the image to a file or database (in this example, we just download the image)
      const image = canvas.toDataURL('image/png');
      download(image, `fractal-${index}.png`);
    });
  });

// Recursive function to draw the fractal tree
function drawBranch(length, angle, thickness, seed, maxIterations, ctx) {
  if (maxIterations <= 0) {
    return;
  }

  const value = parseInt(seed.slice(-6), 16);
  const newSeed = sha256(seed);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.rotate(angle);
  ctx.lineTo(0, -length);
  ctx.lineWidth = thickness;
  const color = `hsl(${value % 30 + 10}, 100%, ${80 - maxIterations}%)`;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.translate(0, -length);

  drawBranch(length * 0.8, -Math.PI / 4, thickness * 0.8, newSeed, maxIterations - 1, ctx);
  drawBranch(length * 0.8, Math.PI / 4, thickness * 0.8, newSeed, maxIterations - 1, ctx);

  ctx.translate(0, length);
  ctx.rotate(-angle);
}

// Helper function to download an image
function download(uri, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
