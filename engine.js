let canvas;
let ctx;
let xSize;
let ySize;
let yRatio;

let zoomX;
let zoomY;
let zoomSizeX;
let zoomSizeY;

let BAILOUT = 2;
let maxIter = 100;
let pow = 3;
let boxSize = 120;
let col1, col2;

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
	powBox = document.getElementById("powSelect");

	canvas.addEventListener("click", zoom);
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		col1 = new Color(239, 229, 220);
		col2 = new Color(15, 3, 38);

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

function dispSet() {
	// calculate zoom params
	let startX = zoomX - (zoomSizeX / 2);
	let curY = zoomY - (zoomSizeY / 2);
	let xFac = (zoomSizeX / xSize);
	let yFac = (zoomSizeY / ySize);

	let startTime = new Date();
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let curX, re, im, pt, c, index;
	for (let y = 0; y < ySize; y ++) {
		curX = startX;
		for (let x = 0; x < xSize; x ++) {
			// set points
			re = map(curX, 0, xSize, -3, 3);
			im = map(curY, 0, ySize, -3 * yRatio, 3 * yRatio);
			pt = testLegibility(re, im);

			// calc color
			c = col1.lerp(col2, pt / maxIter);
			index = 4 * (x + y * xSize);
			imageData.data[index] = c.r;
			imageData.data[index + 1] = c.g;
			imageData.data[index + 2] = c.b;
			imageData.data[index + 3] = 255;

			curX += xFac;
		}
		curY += yFac;
	}
	ctx.putImageData(imageData, 0, 0);

	// update text and time it
	let endTime = new Date();
	let delta = (endTime - startTime) / 1000; 
	let a = map(zoomX, 0, xSize, -3, 3);
	let b = map(zoomY, 0, ySize, -3 * yRatio, 3 * yRatio);
	let sign = (Math.sign(b) == -1 ? "" : "+");
	dispElt.innerHTML = `Centered at ${a}${sign}${b}i.<br>Rendered in ${delta} seconds.`
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
		if (Math.abs(z.re + z.im) > BAILOUT) break;
		n ++;
	}
	return n;
}

function setPow() {
	dispLoading();
	// set the power of the mandelbrot set
	let val = powBox.value;
	pow = parseInt(val, 10);
	setTimeout(dispSet, 100);
}

function updateIter() {
	dispLoading();
	// set the max iterations
	maxIter = maxElt.value;
	iterElt.innerHTML = maxIter;
	setTimeout(dispSet, 100);
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
	zoomSizeX = map(boxSize, 0, xSize, 0, zoomSizeX)
	zoomSizeY = map(boxSize * yRatio, 0, ySize, 0, zoomSizeY)

	if (zoomSizeY > 7e-11) {
		dispLoading();
		zoomX = map(e.pageX, 0, xSize, zoomStartX, zoomEndX);
		zoomY = map(e.pageY, 0, ySize, zoomStartY, zoomEndY);
		setTimeout(dispSet, 50);
	} else {
		dispElt.innerHTML = "Depth limit reached.";
	}
}

function resetParams() {
	dispLoading();
	// reset iterations
	maxIter = 100;
	iterElt.innerHTML = "100";
	maxElt.value = 100;
	let boxWidth = Math.round(120 * yRatio);

	// reset zoom size
	boxSize = 120;
	sizeElt.value = 120;
	sizeDispElt.innerHTML = `${boxSize}x${boxWidth} px`;

	// reset power and display
	powBox.value = 3;
	pow = 3;
	setTimeout(dispSet, 100);
}

function resetZoom() {
	dispLoading();
	// reset the zoom params
	zoomX = (xSize / 2);
	zoomY = (ySize / 2);
	zoomSizeX = xSize;
	zoomSizeY = ySize;
	setTimeout(dispSet, 100);
}

function dispLoading() {
	dispElt.innerHTML = "Loading...this may take a minute...";
}