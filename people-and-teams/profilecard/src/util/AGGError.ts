type KnownAggErrorExtensions = {
	statusCode?: number;
	errorType?: string;
	classification?: string;
};

type AggErrorExtensions = KnownAggErrorExtensions & Record<string, any>;

export class AGGError extends Error {
	path: string;
	extensions: Record<string, any>;
	statusCode?: number;
	errorType?: string;
	classification?: string;
	constructor(message: string, extensions: AggErrorExtensions, path: (string | number)[] = []) {
		super(message);
		this.path = path?.join('.');
		const { statusCode, errorType, classification, ...unknownExtension } = extensions;
		this.statusCode = statusCode;
		this.errorType = errorType;
		this.classification = classification;
		this.extensions = unknownExtension;
	}
}
