export type AbortFunction = () => void;

export class UploadController {
	abortFunction?: AbortFunction;

	constructor() {}

	setAbort(abortFunction: AbortFunction): void {
		this.abortFunction = abortFunction;
	}

	abort(): void {
		if (this.abortFunction) {
			this.abortFunction();
		}
	}
}
