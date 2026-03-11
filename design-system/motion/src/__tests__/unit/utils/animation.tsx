import { getDurationMs } from '../../../utils/animation';

describe('getDurationMs', () => {
	it('should convert milliseconds to milliseconds', () => {
		expect(getDurationMs('100ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toBe(100);
	});

	it('should convert seconds to milliseconds', () => {
		expect(getDurationMs('1s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toBe(1000);
	});

	it('should convert decimal seconds to milliseconds', () => {
		expect(getDurationMs('0.5s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toBe(500);
		expect(getDurationMs('0.3s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toBe(300);
	});
});
