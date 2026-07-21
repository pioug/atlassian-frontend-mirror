import { rawObjectToAnimation } from '../../raw-object-to-animation';

describe('rawObjectToAnimation transformer', () => {
	it('should build a single-property transition', () => {
		const result = rawObjectToAnimation({
			duration: 150,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			properties: ['background-color'],
		} as any);

		expect(result).toBe('background-color 150ms cubic-bezier(0.4, 1, 0.6, 1)');
	});

	it('should build comma-separated transitions for multi-property tokens', () => {
		const result = rawObjectToAnimation({
			duration: 100,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			properties: ['background-color', 'border-color', 'color'],
		} as any);

		expect(result).toBe(
			'background-color 100ms cubic-bezier(0.4, 1, 0.6, 1), border-color 100ms cubic-bezier(0.4, 1, 0.6, 1), color 100ms cubic-bezier(0.4, 1, 0.6, 1)',
		);
	});

	it('should append the delay to each transition when provided', () => {
		const result = rawObjectToAnimation({
			duration: 100,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			delay: 50,
			properties: ['background-color', 'border-color'],
		} as any);

		expect(result).toBe(
			'background-color 100ms cubic-bezier(0.4, 1, 0.6, 1) 50ms, border-color 100ms cubic-bezier(0.4, 1, 0.6, 1) 50ms',
		);
	});

	it('should build comma-separated keyframe animations', () => {
		const result = rawObjectToAnimation({
			duration: 250,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			keyframes: ['ScaleIn80to100', 'FadeIn0to100'],
		} as any);

		expect(result).toBe(
			'250ms cubic-bezier(0.4, 1, 0.6, 1) ScaleIn80to100, 250ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100',
		);
	});

	it('should append fill mode to each keyframe animation when provided', () => {
		const result = rawObjectToAnimation({
			duration: 250,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			keyframes: ['ScaleIn80to100', 'FadeIn0to100'],
			fill: 'forwards',
		} as any);

		expect(result).toBe(
			'250ms cubic-bezier(0.4, 1, 0.6, 1) ScaleIn80to100 forwards, 250ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100 forwards',
		);
	});

	it('should append fill mode to each property transition when provided', () => {
		const result = rawObjectToAnimation({
			duration: 150,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			properties: ['background-color', 'color'],
			fill: 'backwards',
		} as any);

		expect(result).toBe(
			'background-color 150ms cubic-bezier(0.4, 1, 0.6, 1) backwards, color 150ms cubic-bezier(0.4, 1, 0.6, 1) backwards',
		);
	});

	it('should append fill mode after delay when both are provided', () => {
		const result = rawObjectToAnimation({
			duration: 100,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			delay: 50,
			properties: ['background-color'],
			fill: 'forwards',
		} as any);

		expect(result).toBe('background-color 100ms cubic-bezier(0.4, 1, 0.6, 1) 50ms forwards');
	});

	it('should not append fill mode when not provided', () => {
		const result = rawObjectToAnimation({
			duration: 150,
			curve: 'cubic-bezier(0.4, 1, 0.6, 1)',
			properties: ['background-color'],
		} as any);

		expect(result).toBe('background-color 150ms cubic-bezier(0.4, 1, 0.6, 1)');
	});
});
