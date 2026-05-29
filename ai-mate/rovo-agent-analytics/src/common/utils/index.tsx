export const getDefaultTrackEventConfig = (): {
	eventType: string;
	tags: string[];
} => ({
	eventType: 'track',
	tags: ['atlaskit'],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAttributesFromContexts = (context: unknown): Record<string, any> => {
	if (!context || !Array.isArray(context)) {
		return {};
	}

	return context.reduce((acc, x) => {
		return {
			...acc,
			...(x.attributes ?? {}),
		};
	}, {});
};
