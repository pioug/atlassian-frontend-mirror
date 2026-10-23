import type { TimeFormat } from '@atlaskit/locale/get-time-format';

import parseTime from '../../parse-time';

const localizedTimeFormat: TimeFormat = {
	hourCycle: 'h12' as const,
	dayPeriods: {
		am: 'AM',
		pm: 'PM',
	},
	digits: {
		'۰': '0',
		'۱': '1',
		'۲': '2',
		'۳': '3',
		'۴': '4',
		'۵': '5',
		'۶': '6',
		'۷': '7',
		'۸': '8',
		'۹': '9',
	},
	timeParts: [
		{ type: 'hour', value: '9' },
		{ type: 'literal', value: ':' },
		{ type: 'minute', value: '32' },
		{ type: 'literal', value: ' ' },
		{ type: 'dayPeriod', value: 'AM' },
	],
};

const localized24HourTimeFormat: TimeFormat = {
	hourCycle: 'h23',
	dayPeriods: { am: '', pm: '' },
	digits: {},
	timeParts: [
		{ type: 'hour', value: '15' },
		{ type: 'literal', value: ' h ' },
		{ type: 'minute', value: '32' },
	],
};

const english24HourTimeFormat: TimeFormat = {
	...localized24HourTimeFormat,
	timeParts: [
		{ type: 'hour', value: '15' },
		{ type: 'literal', value: ':' },
		{ type: 'minute', value: '32' },
	],
};

const localized12HourTimeFormat: TimeFormat = {
	hourCycle: 'h12',
	dayPeriods: { am: 'a.m.', pm: 'p.m.' },
	digits: {},
	timeParts: [
		{ type: 'hour', value: '9' },
		{ type: 'literal', value: ' h ' },
		{ type: 'minute', value: '32' },
		{ type: 'literal', value: ' ' },
		{ type: 'dayPeriod', value: 'p.m.' },
	],
};

const localizedH11TimeFormat: TimeFormat = {
	...localized12HourTimeFormat,
	hourCycle: 'h11',
};

const expectTime = (
	value: string,
	hour: number,
	minute: number,
	seconds = 0,
	timeFormat = localizedTimeFormat,
) => {
	const parsed = parseTime(value, timeFormat);

	expect(parsed).toBeInstanceOf(Date);
	expect(parsed).toMatchObject({
		getHours: expect.any(Function),
		getMinutes: expect.any(Function),
		getSeconds: expect.any(Function),
	});

	const date = parsed as Date;
	expect(date.getHours()).toBe(hour);
	expect(date.getMinutes()).toBe(minute);
	expect(date.getSeconds()).toBe(seconds);
};

describe('parseTime', () => {
	it('parses 24-hour legacy input', () => {
		expectTime('24:00', 0, 0);
	});

	it('parses compact input when locale-aware parsing is enabled', () => {
		expectTime('13045', 1, 30, 45, localizedTimeFormat);
	});

	it('rejects legacy input that cannot convert to a time', () => {
		expect(() => parseTime('13045')).toThrow(RangeError);
		expect(() => parseTime('25:00')).toThrow(RangeError);
		expect(() => parseTime('not a time')).toThrow(RangeError);
	});

	it('parses localized digits and falls through when no day period exists', () => {
		expectTime('۳:۳۲', 3, 32);
	});

	it('parses locale-specific 24-hour separators', () => {
		expectTime('15 h 32', 15, 32, 0, localized24HourTimeFormat);
	});

	it('falls through to legacy parsing for English day periods in a 24-hour locale', () => {
		expectTime('3:32pm', 15, 32, 0, english24HourTimeFormat);
		expectTime('3:32 p.m.', 15, 32, 0, english24HourTimeFormat);
		expectTime('1:30 p M', 13, 30, 0, english24HourTimeFormat);
		expectTime('15:32:45', 15, 32, 45, english24HourTimeFormat);
	});

	it('parses locale-specific 12-hour separators', () => {
		expectTime('9 h 32 p.m.', 21, 32, 0, localized12HourTimeFormat);
	});

	it('respects localized 12-hour cycle bounds', () => {
		expect(() => parseTime('0:30 PM', localizedTimeFormat)).toThrow(RangeError);
		expect(() => parseTime('PM 0:30', localizedTimeFormat)).toThrow(RangeError);
		expectTime('0 h 30 a.m.', 0, 30, 0, localizedH11TimeFormat);
		expect(() => parseTime('12 h 30 p.m.', localizedH11TimeFormat)).toThrow(RangeError);
		expect(() => parseTime('PM 12:30', localizedH11TimeFormat)).toThrow(RangeError);
	});

	it('parses localized day periods with omitted minutes', () => {
		expectTime('AM 3', 3, 0);
		expectTime('PM 3', 15, 0);
	});

	it.each(['AM PM 3', 'PM invalid', 'PM 13:00'])('rejects invalid localized time %s', (input) => {
		expect(() => parseTime(input, localizedTimeFormat)).toThrow(RangeError);
	});

	it.each(['15 h 99', '15 h 32foo'])(
		'rejects malformed locale-specific 24-hour time %s',
		(input) => {
			expect(() => parseTime(input, localized24HourTimeFormat)).toThrow(RangeError);
		},
	);
});
