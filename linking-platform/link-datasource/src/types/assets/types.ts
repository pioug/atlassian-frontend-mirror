export type GetWorkspaceDetailsResponse = {
	results: [
		{
			id: string;
		},
	];
};

export type ObjectSchema = {
	id: string;
	name: string;
};

export type ObjectSchemaOption = {
	label: string;
	value: string;
};

export type FetchObjectSchemaResponse = ObjectSchema;

export type FetchObjectSchemasResponse = {
	isLast: boolean;
	maxResults: number;
	startAt: number;
	total: number;
	values: ObjectSchema[];
};

export type ValidationError = {
	iql?: string;
};

export type AqlValidateResponse = {
	errorMessages: string[];
	errors?: ValidationError;
	isValid: boolean;
};

// These are to enforce the field "name" property and keep everything typed
export const objectSchemaKey = 'objectSchema' as const;
export const aqlKey = 'aql' as const;

export type SearchForm = {
	[aqlKey]: string;
	[objectSchemaKey]: ObjectSchemaOption | undefined | null;
};
