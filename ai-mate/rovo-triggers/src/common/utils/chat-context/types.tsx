export type ChatContextState = {
	[contextKey: string]: unknown;
};
export type ChatContextPayload = {
	contextKey: string;
	context: <T>(chatContext: T) => T;
};
