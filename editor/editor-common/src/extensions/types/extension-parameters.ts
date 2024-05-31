export type Parameters = {
	[key: string]: any;
	// This prevents "Parameters[]" from being treated as "Parameters" by typescript
	lastIndexOf?: never;
};

export type ParametersWithDuplicateFields = Array<Parameters>;
