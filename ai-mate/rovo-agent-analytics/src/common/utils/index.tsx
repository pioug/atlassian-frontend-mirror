export const getDefaultTrackEventConfig = () => ({
	eventType: 'track',
	tags: ['atlaskit'],
});

export const getAttributesFromContexts = (context: unknown): Record<string, any> => {
	if (!context || !Array.isArray(context)) {
		return {};
	}

	return context.reduce((acc, x) => {
		return {
			...acc,
			...x,
		};
	}, {});
};
