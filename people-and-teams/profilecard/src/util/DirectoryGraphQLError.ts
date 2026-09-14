type KnownErrorExtensions = {
	errorNumber?: number;
};

type ErrorExtensions = KnownErrorExtensions & Record<string, any>;

type ErrorCategory = 'NotFound' | 'NotPermitted' | 'MalformedInput' | 'Internal' | 'Gone';

export class DirectoryGraphQLError extends Error {
	category: ErrorCategory;
	type: string;
	path: string;
	errorNumber?: number;
	extensions: Record<string, any>;

	constructor(
		message: string,
		category: ErrorCategory,
		type: string,
		extensions: ErrorExtensions = {},
		path: (string | number)[] = [],
	) {
		super(message);
		this.category = category;
		this.type = type;
		this.path = path.join('.');
		const { errorNumber, ...unknownExtension } = extensions;
		this.errorNumber = extensions.errorNumber;
		this.extensions = unknownExtension;
	}
}
