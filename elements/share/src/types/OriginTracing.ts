export type OriginTracingWithIdGenerated = {
	originIdGenerated: string;
	originProduct: string;
};

export type OriginTracingForSubSequentEvents = {
	originId: string;
	originProduct: string;
};

export type OriginAnalyticAttributes = {
	hasGeneratedId: boolean;
};

export type OriginTracing = {
	addToUrl: (link: string) => string;
	id: string;
	toAnalyticsAttributes: (
		attrs: OriginAnalyticAttributes,
	) => OriginTracingWithIdGenerated | OriginTracingForSubSequentEvents;
};

export type OriginTracingFactory = () => OriginTracing;
