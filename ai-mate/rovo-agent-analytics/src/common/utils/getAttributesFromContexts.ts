export const getAttributesFromContexts = (context: unknown): Record<string, unknown> => {
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
