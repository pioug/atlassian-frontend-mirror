import { mockLocaleWeekInfo } from '../__fixtures__/mock-locale-week-info';
import { getWeekInfo } from '../get-week-info';

describe('getWeekInfo in browsers without week-info APIs', () => {
	beforeEach(() => {
		mockLocaleWeekInfo('none');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		['en-US', 7],
		['en-GB', 1],
		['ar-AF', 6],
		['fa-IR', 6],
		['dv-MV', 5],
		['hi-IN', 7],
		['ar-SA', 7],
		['en', 7],
		['fr', 1],
		['zh-Hant', 7],
		['en-001', 1],
		['zz-ZZ', 1],
		['en-US-u-fw-tue', 2],
		['en-US-u-fw-invalid', 7],
		['en-US-u-rg-gbzzzz', 1],
		['en-US-u-rg-afzzzz', 6],
		['en-US-u-rg-invalid', 7],
		['en-US-u-rg-zzzzzz', 7],
		['en-US-u-rg-001zzzz', 7],
		['en-GB-u-rg-840zzzz', 7],
		['en-US-u-rg-buzzzz', 7],
		['en-u-sd-gbeng', 1],
		['en-US-u-sd-gbeng', 7],
		['en-US-u-ca-iso8601', 1],
		['en-US-u-ca-iso8601-rg-uszzzz', 7],
		['en-US-u-ca-iso8601-fw-fri', 5],
		['en-US-x-u-fw-mon', 7],
		['en-US-u-nu-latn-x-fw-mon', 7],
	] as [string, number][])('gets regional week information for %s', (tag, firstDay) => {
		expect(getWeekInfo(new Intl.Locale(tag)).firstDay).toBe(firstDay);
	});
});

describe.each(['method', 'getter'] as const)('getWeekInfo with the browser %s API', (support) => {
	beforeEach(() => {
		mockLocaleWeekInfo(support);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		['en-US', 7],
		['en-GB', 1],
		['fa-IR', 6],
	] as [string, number][])('returns week information for %s', (tag, firstDay) => {
		expect(getWeekInfo(new Intl.Locale(tag)).firstDay).toBe(firstDay);
	});
});
