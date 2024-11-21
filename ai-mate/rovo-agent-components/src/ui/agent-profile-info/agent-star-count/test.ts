import { formatNumber } from './utils';

describe('formatNumber', () => {
	it('should format numbers less than 1000 correctly', () => {
		expect(formatNumber(500)).toBe('500');
		expect(formatNumber(999)).toBe('999');
	});

	it('should format numbers in the thousands correctly', () => {
		expect(formatNumber(1000)).toBe('1.0k');
		expect(formatNumber(1500)).toBe('1.5k');
		expect(formatNumber(999999)).toBe('1000.0k');
	});

	it('should format numbers in the millions correctly', () => {
		expect(formatNumber(1e6)).toBe('1.0M');
		expect(formatNumber(2.5e6)).toBe('2.5M');
		expect(formatNumber(999999999)).toBe('1000.0M');
	});

	it('should format numbers in the billions correctly', () => {
		expect(formatNumber(1e9)).toBe('1.0B');
		expect(formatNumber(2.5e9)).toBe('2.5B');
		expect(formatNumber(1e10)).toBe('10.0B');
	});
});
