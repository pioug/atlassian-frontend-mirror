/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper function to create a mock inline card ADF node
 */
export const createMockInlineCard = (
	url: string,
): {
	attrs: {
		url: string;
	};
	type: string;
} => ({
	type: 'inlineCard',
	attrs: { url },
});
