import * as dateUtil from '../date';

describe('localTime', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-07-15T01:40:00'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	test('should return null for empty timezone', () => {
		expect(dateUtil.localTime('', 'format')).toEqual(null);
	});

	test('should return null for unknown format', () => {
		expect(dateUtil.localTime('Australia/Sydney', 'unknown')).toEqual(null);
	});

	test('should return formatted time with correct locale and timezone', () => {
		expect(dateUtil.localTime('Australia/Sydney', 'i')).toEqual('1');
		expect(dateUtil.localTime('Australia/Sydney', 'eee')).toEqual('Mon');
		expect(dateUtil.localTime('Australia/Sydney', `h:mmbbb (OOOO)`)).toEqual('11:40am (GMT+10:00)');
	});
});
