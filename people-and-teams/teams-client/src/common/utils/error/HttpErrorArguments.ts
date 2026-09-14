export interface HttpErrorArguments {
	message: string;
	status: number;
	traceId?: string;
	path?: string;
}
