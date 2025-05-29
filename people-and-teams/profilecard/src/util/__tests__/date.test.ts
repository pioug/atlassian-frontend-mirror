import * as dateUtil from '../date';

describe('localTime', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-07-15T02:40:00'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	test('should return null for empty or unknown timezone', () => {
		expect(dateUtil.localTime('', 'format')).toEqual(null);
		expect(dateUtil.localTime('somewhere', 'format')).toEqual(null);
	});

	test('should return null for unknown format', () => {
		expect(dateUtil.localTime('Australia/Sydney', 'unknown')).toEqual(null);
	});

	test('should return formatted time with correct locale and timezone', () => {
		expect(dateUtil.localTime('Australia/Sydney', 'i')).toEqual('1');
		expect(dateUtil.localTime('Australia/Sydney', 'eee')).toEqual('Mon');
		expect(dateUtil.localTime('Australia/Sydney', `h:mmaaa (OOOO)`)).toEqual('12:40pm (GMT+10:00)');
		expect(dateUtil.localTime('Australia/Sydney', `h:mmaaa`)).toEqual('12:40pm');
		expect(dateUtil.localTime('Australia/Sydney', `eee h:mmaaa`)).toEqual('Mon 12:40pm');
	});
});
