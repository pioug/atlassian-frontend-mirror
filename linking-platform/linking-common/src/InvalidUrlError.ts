export class InvalidUrlError extends Error {
	constructor(error: any) {
		super(error);
		this.name = 'InvalidUrlError';
	}
}
