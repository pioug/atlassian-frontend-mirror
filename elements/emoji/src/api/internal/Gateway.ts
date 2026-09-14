export class Gateway {
	private maximumPermitted: number;
	private count: number;

	constructor(maximumPermitted: number) {
		if (maximumPermitted < 1) {
			throw new RangeError('The maximumPermitted parameter must be 1 or more.');
		}

		this.maximumPermitted = maximumPermitted;
		this.count = 0;
	}

	/**
	 * Run the supplied function if the count of already submitted work allows it. Drop the work
	 * if it's not allowed to run.
	 *
	 * Will return true if the function has been submitted or false if it was not submitted.
	 */
	submit(f: () => void): boolean {
		if (this.count >= this.maximumPermitted) {
			return false;
		}

		this.count++;
		const wrappedFunc = () => {
			try {
				f();
			} finally {
				this.completed();
			}
		};
		if (typeof window !== 'undefined') {
			window.setTimeout(wrappedFunc);
		}

		return true;
	}

	private completed(): void {
		this.count--;
	}
}
