export class HttpError extends Error {
	code: number;
	traceId?: string | null;
	constructor(code: number, reason: string, traceId?: string | null) {
		super(reason);
		this.code = code;
		this.traceId = traceId;
	}
}
