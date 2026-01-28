export type ErrorAttributes = {
	errorCount: number | null;
	errorDetails: Omit<ErrorAttributes, 'errorDetails'>[] | null;
	errorMessage: string;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	traceId: string | null;
	errorStatusCode: number | null;
	errorStack: string | null;
};
