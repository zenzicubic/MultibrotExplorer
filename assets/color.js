class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	lerp(c, t) {
		let rnew = (1 - t) * c.r + (t * this.r);
		let gnew = (1 - t) * c.g + (t * this.g);
		let bnew = (1 - t) * c.b + (t * this.b);
		return new Color(rnew, gnew, bnew);
	}
}