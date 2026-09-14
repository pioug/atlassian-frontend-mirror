export const getErrorType: any = (error: unknown): string => {
	if (error instanceof Response) {
		return 'NetworkError';
	}
	if (error instanceof Error) {
		return error.name;
	}
	return typeof error;
};
