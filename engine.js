let canvas;
let ctx;
let image;

let xSize;
let ySize;
let yRatio;

let zoomX;
let zoomY;
let zoomSizeX;
let zoomSizeY;

let BAILOUT = 4;
let maxIter = 100;
let pow = 3;
let boxSize = 120;

let iterElt;
let sizeElt;
let sizeDispElt;
let powBox;
let maxElt;
let dispElt;

document.addEventListener("DOMContentLoaded", function() {
	// define element vars (added for brevity)
	canvas = document.getElementById('canvas');
	iterElt = document.getElementById("iter");
	dispElt = document.getElementById("info");
	sizeDispElt = document.getElementById("sizeDisp");
	sizeElt = document.getElementById("sizeRange");
	maxElt = document.getElementById("max");
	powBox = document.getElementById("powSelect")
	canvas.addEventListener("click", zoom);

	if (canvas.getContext) {
	    ctx = canvas.getContext('2d');

	    // calculate sizing params
		xSize = window.innerWidth;
		ySize = window.innerHeight;
		yRatio = (ySize / xSize);
		canvas.width = xSize;
		canvas.height = ySize;

		resetZoom();
		dispSet();
	}
})


function resetZoom() {
	zoomX = (xSize / 2);
	zoomY = (ySize / 2);
	zoomSizeX = xSize;
	zoomSizeY = ySize;
	dispSet();
}

function drawSet() {
	// update text
	let a = map(zoomX, 0, xSize, -3, 3);
	let b = map(zoomY, 0, ySize, -3 * yRatio, 3 * yRatio);
	let sign = (Math.sign(b) == -1 ? "" : "+");
	dispElt.innerHTML = `Centered at ${a}${sign}${b}i.`

	// render set
	ctx.clearRect(0, 0, xSize, ySize);
	for (let y = 0; y < ySize; y ++) {
		for (let x = 0; x < xSize; x ++) {
			// compute colors
			let cur = image[y][x];
			let hue = (cur / maxIter) * 360.0;
			let brightness = (cur == maxIter ? 0 : 50);
			ctx.fillStyle = `hsl(${hue},100%,${brightness}%)`;

			// put point
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

function dispSet() {
	image = [];

	// calculate zoom params
	let startX = zoomX - (zoomSizeX / 2);
	let curY = zoomY - (zoomSizeY / 2);
	let xFac = (zoomSizeX / xSize);
	let yFac = (zoomSizeY / ySize);

	// now zoom
	for (let y = 0; y < ySize; y ++) {
		let curRow = [];
		let curX = startX;
		for (let x = 0; x < xSize; x ++) {
			// set points
			let re = map(curX, 0, xSize, -3, 3);
			let im = map(curY, 0, ySize, -3 * yRatio, 3 * yRatio);
			let pt = testLegibility(re, im);
			curRow.push(pt);
			curX += xFac;
		}
		image.push(curRow);
		curY += yFac;
	}
	drawSet();
}

function map(n, a, b, c, d) {
	return c+((d-c)/(b-a))*(n-a);
}

function testLegibility(re, im) {
	// the actual math is here
	let c = new Complex(re, im);
	let z = new Complex(0, 0);
	let n = 0;
	while (n < maxIter) {
		z = z.pow(pow).add(c);
		if (z.magnitude() > BAILOUT) break;
		n ++;
	}
	return n;
}

function setPow() {
	// set the power of the mandelbrot set
	let val = powBox.value;
	pow = parseInt(val, 10);
	dispSet();
}

function updateIter() {
	// set the max iterations
	maxIter = maxElt.value;
	iterElt.innerHTML = maxIter;
	dispSet();
}

function updateSize() {
	// resize zoomable area, boxWidth is purely decorative
	boxSize = sizeElt.value;
	let boxWidth = Math.round(boxSize * yRatio);
	sizeDispElt.innerHTML = `${boxSize}x${boxWidth} px`;
}

function zoom(e) {
	// various zoom-related scaling factors
	let zoomStartX = zoomX - (zoomSizeX / 2);
	let zoomStartY = zoomY - (zoomSizeY / 2);
	let zoomEndX = zoomX + (zoomSizeX / 2);
	let zoomEndY = zoomY + (zoomSizeY / 2);

	// map the zoom to the coords and render
	zoomX = map(e.pageX, 0, xSize, zoomStartX, zoomEndX);
	zoomY = map(e.pageY, 0, ySize, zoomStartY, zoomEndY);
	zoomSizeX = map(boxSize, 0, xSize, 0, zoomSizeX)
	zoomSizeY = map(boxSize * yRatio, 0, ySize, 0, zoomSizeY)
	dispSet();
}

function resetParams() {
	// reset iterations
	maxIter = 100;
	iterElt.innerHTML = "100";
	maxElt.innerHTML = 100;
	let boxWidth = Math.round(120 * yRatio);

	// reset zoom size
	boxSize = 120;
	sizeElt.value = 120;
	sizeDispElt.innerHTML = `${boxSize}x${boxWidth} px`;

	// reset power and display
	powBox.value = 3;
	pow = 3;
	dispSet();
}