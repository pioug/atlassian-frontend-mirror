import {
	clearActiveTrace,
	generateSpanId,
	getActiveTraceAsQueryParams,
	setActiveTrace,
} from './index';

describe('Trace context operation test suite', () => {
	test('Should generate 64bit spanId in hex format with 16 chars in length', () => {
		for (let i = 0; i < 1000; i++) {
			// given
			// when
			const actual = generateSpanId();

			// then
			expect(actual).toMatch(/^[a-f0-9]{16}$/);
		}
	});

	test('Generate query params shall match the given trace info', () => {
		// given
		setActiveTrace('trace-id', 'span-id', 'type');
		// when
		const params = getActiveTraceAsQueryParams('url placeholder');
		// then
		expect(params).toMatch('x-b3-traceid=trace-id&x-b3-spanid=span-id');
	});

	test('Query params shall be null when no active trace presents', () => {
		// given
		clearActiveTrace();
		// when
		const params = getActiveTraceAsQueryParams('url placeholder');
		// then
		expect(params).toBeNull();
	});
});
