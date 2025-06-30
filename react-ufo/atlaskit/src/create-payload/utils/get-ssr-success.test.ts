// Mock the ssr module
jest.mock('../../ssr', () => ({
	getSSRSuccess: jest.fn(),
}));

import * as ssr from '../../ssr';

import getSSRSuccess from './get-ssr-success';

describe('getSSRSuccess', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when interaction type is not page_load', () => {
		it('should return undefined for press interaction', () => {
			const result = getSSRSuccess('press');
			expect(result).toBeUndefined();
			expect(ssr.getSSRSuccess).not.toHaveBeenCalled();
		});

		it('should return undefined for transition interaction', () => {
			const result = getSSRSuccess('transition');
			expect(result).toBeUndefined();
			expect(ssr.getSSRSuccess).not.toHaveBeenCalled();
		});
	});

	describe('when interaction type is page_load', () => {
		it('should return true when SSR was successful', () => {
			(ssr.getSSRSuccess as jest.Mock).mockReturnValue(true);

			const result = getSSRSuccess('page_load');

			expect(result).toBe(true);
			expect(ssr.getSSRSuccess).toHaveBeenCalledTimes(1);
		});

		it('should return false when SSR was not successful', () => {
			(ssr.getSSRSuccess as jest.Mock).mockReturnValue(false);

			const result = getSSRSuccess('page_load');

			expect(result).toBe(false);
			expect(ssr.getSSRSuccess).toHaveBeenCalledTimes(1);
		});

		it('should return undefined when SSR success is undefined', () => {
			(ssr.getSSRSuccess as jest.Mock).mockReturnValue(undefined);

			const result = getSSRSuccess('page_load');

			expect(result).toBeUndefined();
			expect(ssr.getSSRSuccess).toHaveBeenCalledTimes(1);
		});

		it('should handle when ssr.getSSRSuccess throws an error', () => {
			(ssr.getSSRSuccess as jest.Mock).mockImplementation(() => {
				throw new Error('SSR API not available');
			});

			expect(() => getSSRSuccess('page_load')).toThrow('SSR API not available');
			expect(ssr.getSSRSuccess).toHaveBeenCalledTimes(1);
		});
	});
});
