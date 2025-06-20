export type ChatContextState = {
	[contextKey: string]: unknown;
};

export type ChatContextPayload = {
	contextKey: string;
	setContext: <T>(chatContext: T) => T;
};
