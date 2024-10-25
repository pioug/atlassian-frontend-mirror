import { generateSpanId } from '../../../utils/generate-span-id';

describe('generate span id', () => {
	test('generates 16 character lower case hex string', () => {
		expect(generateSpanId()).toMatch(/^[0-9a-f]{16}$/);
	});
});
