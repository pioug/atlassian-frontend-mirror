import { fg } from '@atlaskit/platform-feature-flags';

import { MAX_TIMING_NAME_LENGTH, sanitizeTimingName } from './timing-name';

jest.mock('@atlaskit/platform-feature-flags');

const mockedFg = fg as jest.MockedFunction<typeof fg>;

describe('sanitizeTimingName', () => {
	beforeEach(() => {
		mockedFg.mockReset();
		mockedFg.mockReturnValue(false);
	});

	it('returns names within the limit unchanged', () => {
		const name = 'a'.repeat(MAX_TIMING_NAME_LENGTH);

		expect(sanitizeTimingName(name)).toBe(name);
	});

	it('returns long names unchanged when the gate is disabled', () => {
		const name = 'a'.repeat(MAX_TIMING_NAME_LENGTH + 1);

		expect(sanitizeTimingName(name)).toBe(name);
	});

	it('truncates long names when the gate is enabled', () => {
		const name = 'a'.repeat(MAX_TIMING_NAME_LENGTH + 10);
		mockedFg.mockReturnValue(true);

		expect(sanitizeTimingName(name)).toBe(name.slice(0, MAX_TIMING_NAME_LENGTH));
	});
});
