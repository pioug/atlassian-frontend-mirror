import { generateMediaUserPreferences, type UserPreferences } from './getMediaUserPreferences';

describe('generateMediaUserPreferences', () => {
	let mockUserPreferences: UserPreferences;
	let mediaUserPreferences: ReturnType<typeof generateMediaUserPreferences>;

	beforeEach(() => {
		// Create a mock implementation of UserPreferences
		mockUserPreferences = {
			set: jest.fn(),
			get: jest.fn(),
		};
		mediaUserPreferences = generateMediaUserPreferences(mockUserPreferences);
	});

	describe('set', () => {
		it('should call the underlying set method with string value for boolean preference', () => {
			mediaUserPreferences.set('videoCaptionsEnabled', true);
			expect(mockUserPreferences.set).toHaveBeenCalledWith('videoCaptionsEnabled', 'true');

			mediaUserPreferences.set('videoCaptionsEnabled', false);
			expect(mockUserPreferences.set).toHaveBeenCalledWith('videoCaptionsEnabled', 'false');
		});

		it('should call the underlying set method with string value for string preference', () => {
			mediaUserPreferences.set('videoCaptionsPreferredLocale', 'en-US');
			expect(mockUserPreferences.set).toHaveBeenCalledWith('videoCaptionsPreferredLocale', 'en-US');
		});
	});

	describe('get', () => {
		it('should return undefined when underlying get returns null', () => {
			(mockUserPreferences.get as jest.Mock).mockReturnValue(null);
			const result = mediaUserPreferences.get('videoCaptionsEnabled');
			expect(result).toBeUndefined();
		});

		it('should return undefined when underlying get returns undefined', () => {
			(mockUserPreferences.get as jest.Mock).mockReturnValue(undefined);
			const result = mediaUserPreferences.get('videoCaptionsEnabled');
			expect(result).toBeUndefined();
		});

		it('should convert string "true" to boolean true for boolean preferences', () => {
			(mockUserPreferences.get as jest.Mock).mockReturnValue('true');
			const result = mediaUserPreferences.get('videoCaptionsEnabled');
			expect(result).toBe(true);
		});

		it('should convert string "false" to boolean false for boolean preferences', () => {
			(mockUserPreferences.get as jest.Mock).mockReturnValue('false');
			const result = mediaUserPreferences.get('videoCaptionsEnabled');
			expect(result).toBe(false);
		});

		it('should return string value as is for string preferences', () => {
			const expectedValue = 'en-US';
			(mockUserPreferences.get as jest.Mock).mockReturnValue(expectedValue);
			const result = mediaUserPreferences.get('videoCaptionsPreferredLocale');
			expect(result).toBe(expectedValue);
		});
	});
});
