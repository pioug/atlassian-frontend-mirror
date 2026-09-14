/**
 * Used for store failure metadata for analytics
 * @param error The error could be a service error with {code, reason} or an Error
 * @returns any
 */
export const extractErrorInfo = (error: any): any => {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
		};
	}
	return error;
};
