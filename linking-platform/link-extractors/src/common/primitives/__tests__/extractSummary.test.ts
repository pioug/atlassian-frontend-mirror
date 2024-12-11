import { TEST_BASE_DATA } from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractSummary } from '../extractSummary';

describe('extractSummary', () => {
	it('returns undefined if not present', () => {
		expect(extractSummary(TEST_BASE_DATA)).toBeUndefined();
	});

	it('returns summary', () => {
		expect(extractSummary({ ...TEST_BASE_DATA, summary: 'link summary' })).toBe('link summary');
	});

	it('trims summary', () => {
		expect(
			extractSummary({
				...TEST_BASE_DATA,
				summary: ' link summary with space ',
			}),
		).toBe('link summary with space');
	});

	it('returns undefined if summary is empty string', () => {
		expect(extractSummary({ ...TEST_BASE_DATA, summary: '' })).toBeUndefined();
	});

	it('returns undefined if summary is whitespace', () => {
		expect(extractSummary({ ...TEST_BASE_DATA, summary: '        ' })).toBeUndefined();
	});

	it('return as is if summary is not a string', () => {
		// @ts-ignore TS2322 For testing purpose
		expect(extractSummary({ ...TEST_BASE_DATA, summary: 1 })).toBeUndefined();
		expect(
			// @ts-ignore TS2322 For testing purpose
			extractSummary({ ...TEST_BASE_DATA, summary: true }),
		).toBeUndefined();
		expect(
			// @ts-ignore TS2322 For testing purpose
			extractSummary({ ...TEST_BASE_DATA, summary: false }),
		).toBeUndefined();
	});
});
