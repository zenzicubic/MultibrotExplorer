class Complex {
	constructor(re, im) {
		this.re = re;
		this.im = im;
	}

	add(operand) {
		return new Complex(this.re + operand.re, this.im + operand.im);
	}

	subtract(operand) {
		return new Complex(this.re - operand.re, this.im - operand.im);
	}

	multiply(operand) {
		let ac = this.re * operand.re;
		let bd = this.im * operand.im;
		let bc = this.im * operand.re;
		let ad = this.re * operand.im;
		return new Complex(ac - bd, bc + ad);
	}	

	pow(n) {
		let z = this;
		for (let i = 0; i < n - 1; i ++) {
			z = z.multiply(this);
		}
		return z;
	}

	magnitude() {
		let dst = Math.sqrt(Math.pow(this.re, 2) + Math.pow(this.im, 2));
		return Math.abs(dst);
	}
}