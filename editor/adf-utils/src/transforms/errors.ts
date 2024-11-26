/** NodeNestingTransformError  */
export class NodeNestingTransformError extends Error {
	/**
	 * @param message - Error message - Do not use any UGC in this message
	 */
	constructor(message: string) {
		super(message);
		this.name = 'NodeNestingTransformError';
	}
}
