jest.mock('../../../mediaFeatureFlag-local', () => ({
	getLocalMediaFeatureFlag: jest.fn().mockReturnValue(null),
}));
import { getGenericFeatureFlag } from '../../genericFeatureFlag';
import { getLocalMediaFeatureFlag } from '../../../mediaFeatureFlag-local';

const defaultFlags = {
	'my-first-flag': true,
	'my-second-flag': false,
	'my-third-flag': 33,
	'my-fourth-flag': 'hi-mate',
};

const consumerFlags = {
	'my-first-flag': false,
	'my-second-flag': true,
	'my-third-flag': 1,
	'my-fourth-flag': 'bye-mate',
};

describe('getGenericFeatureFlag', () => {
	describe('shoud return default if no value passed', () => {
		let key: keyof typeof defaultFlags;
		for (key in defaultFlags) {
			it(key, () => {
				expect(getGenericFeatureFlag(key, defaultFlags)).toEqual(defaultFlags[key]);
				expect(getGenericFeatureFlag(key, defaultFlags, {})).toEqual(defaultFlags[key]);
			});
		}
	});

	it('should return consumer value if passed through', () => {
		expect(getGenericFeatureFlag('my-first-flag', defaultFlags, consumerFlags)).toEqual(false);
		expect(getGenericFeatureFlag('my-second-flag', defaultFlags, consumerFlags)).toEqual(true);
		expect(getGenericFeatureFlag('my-third-flag', defaultFlags, consumerFlags)).toEqual(1);
		expect(getGenericFeatureFlag('my-fourth-flag', defaultFlags, consumerFlags)).toEqual(
			'bye-mate',
		);
	});

	it('should use localStorage override if available even if flags passed', () => {
		(getLocalMediaFeatureFlag as jest.Mock).mockReturnValue('true');
		expect(getGenericFeatureFlag('my-first-flag', defaultFlags, consumerFlags)).toBe(true);
		expect(getGenericFeatureFlag('my-first-flag', defaultFlags)).toBe(true);
		expect(getGenericFeatureFlag('my-first-flag', defaultFlags, {})).toBe(true);

		(getLocalMediaFeatureFlag as jest.Mock).mockReturnValue('true');
		expect(getGenericFeatureFlag('my-second-flag', defaultFlags, consumerFlags)).toBe(true);
		expect(getGenericFeatureFlag('my-second-flag', defaultFlags)).toBe(true);
		expect(getGenericFeatureFlag('my-second-flag', defaultFlags, {})).toBe(true);

		(getLocalMediaFeatureFlag as jest.Mock).mockReturnValue('55');
		expect(getGenericFeatureFlag('my-third-flag', defaultFlags, consumerFlags)).toBe(55);
		expect(getGenericFeatureFlag('my-third-flag', defaultFlags)).toBe(55);
		expect(getGenericFeatureFlag('my-third-flag', defaultFlags, {})).toBe(55);

		// Local storage MUST store strings wrapped with double quotes
		(getLocalMediaFeatureFlag as jest.Mock).mockReturnValue('"cya"');
		expect(getGenericFeatureFlag('my-fourth-flag', defaultFlags, consumerFlags)).toBe('cya');
		expect(getGenericFeatureFlag('my-fourth-flag', defaultFlags)).toBe('cya');
		expect(getGenericFeatureFlag('my-fourth-flag', defaultFlags, {})).toBe('cya');

		// Cleaning up mock
		(getLocalMediaFeatureFlag as jest.Mock).mockReturnValue(null);
	});
});
