export interface GraphQLError {
	code?: number;
	reason?: string;
	source?: string;
	message?: string;
	traceId?: string;
	category: string;
	type: string;
	path: string[];
	extensions: {
		errorNumber: number;
	} & Record<string, any>;
}
