import { getComputedAnimationDurationMs } from '../../../utils/get-computed-animation-duration-ms';
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

	it('should use the longest concurrent animation rather than treating the next duration as a delay', () => {
		expect(
			getDurationMs(
				'150ms cubic-bezier(0.4, 1, 0.6, 1) ScaleXIn backwards, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn backwards',
			),
		).toEqual({
			duration: 150,
			delay: 0,
		});
	});

	it('should return the duration and delay of the longest animation in a list', () => {
		expect(getDurationMs('100ms FadeIn 50ms, 200ms ScaleIn 25ms')).toEqual({
			duration: 200,
			delay: 25,
		});
	});
});

describe('getComputedAnimationDurationMs', () => {
	it('should measure concurrent computed animation lists', () => {
		expect(getComputedAnimationDurationMs('ScaleIn, FadeIn', '0.15s, 0.15s', '0s, 0s')).toBe(150);
	});

	it('should combine matching durations and delays and use the longest total', () => {
		expect(getComputedAnimationDurationMs('FadeIn, ScaleIn', '100ms, 200ms', '50ms, 25ms')).toBe(
			225,
		);
	});

	it('should repeat shorter timing lists to match the animation-name list', () => {
		expect(getComputedAnimationDurationMs('FadeIn, ScaleIn', '100ms', '25ms, 50ms')).toBe(150);
	});

	it('should ignore excess timing values that have no corresponding animation name', () => {
		expect(getComputedAnimationDurationMs('FadeIn', '100ms, 5s', '25ms, 2s')).toBe(125);
	});

	it('should ignore animation-name entries set to none', () => {
		expect(getComputedAnimationDurationMs('none, FadeIn', '5s, 200ms', '0s, 25ms')).toBe(225);
	});

	it('should account for negative animation delays', () => {
		expect(getComputedAnimationDurationMs('FadeIn', '150ms', '-50ms')).toBe(100);
	});

	it('should ignore invalid computed time values', () => {
		expect(getComputedAnimationDurationMs('FadeIn', 'invalid', '0s')).toBe(0);
	});
});
