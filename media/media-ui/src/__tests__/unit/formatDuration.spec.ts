import { formatDuration, secondsToTime, isInvalidInput } from '../../formatDuration';

describe('isInvalidInput', () => {
	test('should return true for invalid inputs', () => {
		expect(isInvalidInput(-1)).toBe(true);
		expect(isInvalidInput(Infinity)).toBe(true);
		expect(isInvalidInput(NaN)).toBe(true);
	});

	test('should return false for valid inputs', () => {
		expect(isInvalidInput(0)).toBe(false);
		expect(isInvalidInput(1)).toBe(false);
		expect(isInvalidInput(60)).toBe(false);
		expect(isInvalidInput(3600)).toBe(false);
	});
});

describe('secondsToTime', () => {
	test('should return correct hours, minutes, and seconds', () => {
		expect(secondsToTime(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 });
		expect(secondsToTime(3600)).toEqual({ hours: 1, minutes: 0, seconds: 0 });
		expect(secondsToTime(60)).toEqual({ hours: 0, minutes: 1, seconds: 0 });
		expect(secondsToTime(1)).toEqual({ hours: 0, minutes: 0, seconds: 1 });
	});

	test('should handle zero', () => {
		expect(secondsToTime(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
	});

	test('should handle negative numbers', () => {
		expect(secondsToTime(-1)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
	});

	test('should handle Infinity', () => {
		expect(secondsToTime(Infinity)).toEqual({
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
	});

	test('should handle NaN', () => {
		expect(secondsToTime(NaN)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
	});
});

describe('formatDuration', () => {
	const minute = 60;
	const hour = 60 * minute;
	it('should format seconds into readable format', () => {
		expect(formatDuration(0)).toEqual('0:00');
		expect(formatDuration(5)).toEqual('0:05');
		expect(formatDuration(10)).toEqual('0:10');
		expect(formatDuration(1 * minute + 20)).toEqual('1:20');
		expect(formatDuration(41 * minute)).toEqual('41:00');
		expect(formatDuration(2 * hour + 10)).toEqual('2:00:10');
		expect(formatDuration(12 * hour + 30 * minute + 10)).toEqual('12:30:10');
		expect(formatDuration(36 * hour + 30 * minute + 10)).toEqual('36:30:10');
	});

	it('should deal with edge numerical cases', () => {
		expect(formatDuration(NaN)).toEqual('0:00');
		expect(formatDuration(Infinity)).toEqual('0:00');
		expect(formatDuration(-33)).toEqual('0:00');
	});
});
