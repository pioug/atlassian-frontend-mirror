export type DEPRECATED_ErrorAttributes = {
	errorCount?: number;
	errorDetails?: Omit<DEPRECATED_ErrorAttributes, 'errorDetails'>[];
	errorMessage: string;
	errorCategory?: string;
	errorType?: string;
	errorPath?: string;
	errorNumber?: number;
	isSLOFailure: boolean;
	traceId?: string | null;
	errorStatusCode?: number;
};

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
};
