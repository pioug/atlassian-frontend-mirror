export type Parameters = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	// This prevents "Parameters[]" from being treated as "Parameters" by typescript
	lastIndexOf?: never;
};

export type ParametersWithDuplicateFields = Array<Parameters>;
