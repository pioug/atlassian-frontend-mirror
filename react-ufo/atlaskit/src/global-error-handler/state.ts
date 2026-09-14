type GlobalError = {
	name: string;
	labelStack: null;
	errorType: string;
	errorMessage: string;
	errorStack?: string;
};

type ErrorSink = (
	name: string,
	labelStack: null,
	errorType: string,
	errorMessage: string,
	errorStack?: string,
) => void;

const errors: GlobalError[] = [];

export const globalErrorHandlerState: {
	shouldInitialize: boolean;
	globalCount: number;
	errors: GlobalError[];
	push: ErrorSink;
} = {
	shouldInitialize: true,
	globalCount: 0,
	errors,
	push: (name, labelStack, errorType, errorMessage, errorStack) => {
		errors.push({ name, labelStack, errorType, errorMessage, errorStack });
	},
};
