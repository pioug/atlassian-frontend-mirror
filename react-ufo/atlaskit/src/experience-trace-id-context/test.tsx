import { generateSpanId } from './index';

describe('generateSpanId', () => {
	test('Should generate 64bit spanId in hex format with 16 chars in length', () => {
		for (let i = 0; i < 1000; i++) {
			// given
			// when
			const actual = generateSpanId();

			// then
			expect(actual).toMatch(/^[a-f0-9]{16}$/);
		}
	});
});
