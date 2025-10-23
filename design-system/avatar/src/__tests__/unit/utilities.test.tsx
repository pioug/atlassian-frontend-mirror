import { getAppearanceForAppType } from '../../utilities';

describe('getAppearanceForAppType', () => {
	it('should return the hexagon appearance for the app type agent', () => {
		expect(getAppearanceForAppType('agent')).toBe('hexagon');
	});

	it('should return the circle appearance for the app type user', () => {
		expect(getAppearanceForAppType('user')).toBe('circle');
	});

	it('should return the circle appearance for the app type system', () => {
		expect(getAppearanceForAppType('system')).toBe('circle');
	});

	it('should return the default circle appearance for the app type for unknown app type', () => {
		expect(getAppearanceForAppType('unknown')).toBe('circle');
	});
});
