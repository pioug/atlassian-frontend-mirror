// jest.mock('')
import { shouldSample } from '../shouldSample';

describe('#shouldSample()', () => {
	afterEach(() => {
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	describe('with default threshold value (of 0.5)', () => {
		it('should return false', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.499999);
			expect(shouldSample()).toBe(false);
		});

		it('should return true', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.50000001);
			expect(shouldSample()).toBe(true);
		});
	});

	describe('with provided threshold value', () => {
		it('should return false', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.69999999);
			expect(shouldSample(0.7)).toBe(false);
		});

		it('should return true', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
			expect(shouldSample(0.2)).toBe(true);
		});
	});
});
