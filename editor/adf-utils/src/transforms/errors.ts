export class NodeNestingTransformError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NodeNestingTransformError';
	}
}
