class Debounce {
	  constructor(fn, wait, accumulator) {
		      this.fn = fn;
		      this.wait = wait || 500;
		      this.accumulator = accumulator;
		      this.store = '';
		      this.timeout;
		    }

	  call() {
		      let args = arguments;
		      if (this.accumulator) {
			            this.store = this.accumulator.apply(this, [this.store, ...arguments]);
			            args = [this.store];
			          }
		      clearTimeout(this.timeout);
		  	this.timeout =setTimeout(() => {    
				this.fn.apply(this, args);
			            this.store = "";
			          }, this.wait);
		    }
}

module.exports = Debounce;
