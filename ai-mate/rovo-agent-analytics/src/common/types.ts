export type RemainingRequired<T, P extends Partial<T>> = Required<Omit<T, keyof P>>;

export type BaseAgentAnalyticsAttributes = {
	touchPoint: string;
	agentId: string;
};
