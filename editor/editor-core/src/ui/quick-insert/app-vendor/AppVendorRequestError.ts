/** Statuses where retrying cannot succeed, or would add load to a throttled gateway. */
const BLOCKING_STATUSES = new Set([401, 403, 429]);

export class AppVendorRequestError extends Error {
	/** Whether every remaining lookup should stop rather than retry. */
	readonly isBlocking: boolean;

	constructor(message: string, status?: number) {
		super(message);
		this.name = 'AppVendorRequestError';
		this.isBlocking = status !== undefined && BLOCKING_STATUSES.has(status);
	}
}
