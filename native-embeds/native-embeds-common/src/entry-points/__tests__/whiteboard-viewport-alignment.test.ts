import { normalizeWhiteboardViewportAlignment } from '../whiteboard-viewport-alignment';

describe('normalizeWhiteboardViewportAlignment', () => {
	it.each([
		['left', 'left'],
		['wrap-left', 'left'],
		['center', 'center'],
		['right', 'right'],
		['wrap-right', 'right'],
	] as const)('normalizes %s to %s', (alignment, expectedAlignment) => {
		expect(normalizeWhiteboardViewportAlignment(alignment)).toBe(expectedAlignment);
	});
});
