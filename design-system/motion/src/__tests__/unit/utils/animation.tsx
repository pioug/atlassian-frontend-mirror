import { getDurationMs } from '../../../utils/get-duration-ms';

describe('getDurationMs', () => {
	it('should return default values animation is empty string', () => {
		expect(getDurationMs('')).toEqual({ duration: 0, delay: 0 });
	});

	it('should return default values if no duration is provided', () => {
		expect(getDurationMs('cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toEqual({
			duration: 0,
			delay: 0,
		});
	});

	it('should convert milliseconds to milliseconds', () => {
		expect(getDurationMs('100ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toEqual({
			duration: 100,
			delay: 0,
		});
	});

	it('should convert milliseconds to milliseconds with delay', () => {
		expect(getDurationMs('100ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn 200ms')).toEqual({
			duration: 100,
			delay: 200,
		});
	});

	it('should convert seconds to milliseconds', () => {
		expect(getDurationMs('1s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toEqual({
			duration: 1000,
			delay: 0,
		});
	});

	it('should convert seconds to milliseconds with delay', () => {
		expect(getDurationMs('2s cubic-bezier(0.66, 0, 0.34, 1) FadeIn 1s')).toEqual({
			duration: 2000,
			delay: 1000,
		});
	});

	it('should convert decimal seconds to milliseconds', () => {
		expect(getDurationMs('0.5s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toEqual({
			duration: 500,
			delay: 0,
		});
		expect(getDurationMs('0.3s cubic-bezier(0.66, 0, 0.34, 1) FadeIn')).toEqual({
			duration: 300,
			delay: 0,
		});
	});

	it('should convert decimal seconds to milliseconds with delay', () => {
		expect(getDurationMs('0.5s cubic-bezier(0.66, 0, 0.34, 1) FadeIn 0.2s')).toEqual({
			duration: 500,
			delay: 200,
		});
		expect(getDurationMs('0.3s cubic-bezier(0.66, 0, 0.34, 1) FadeIn 0.1s')).toEqual({
			duration: 300,
			delay: 100,
		});
	});
});
