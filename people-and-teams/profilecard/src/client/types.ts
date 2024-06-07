export type ErrorAttributes = {
	errorCount?: number;
	errorDetails?: Omit<ErrorAttributes, 'errorDetails'>[];
	errorMessage: string;
	errorCategory?: string;
	errorType?: string;
	errorPath?: string;
	errorNumber?: number;
	isSLOFailure: boolean;
	traceId?: string | null;
	errorStatusCode?: number;
};
