import { type JsonLd } from '@atlaskit/json-ld-types';

import { TEST_BASE_DATA, TEST_NAME } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractNameFromJsonLd } from '../index';

const TEST_RESPONSE: JsonLd.Response = {
	meta: {
		visibility: 'public',
		access: 'granted',
	},
	data: TEST_BASE_DATA,
};

describe('extractNameFromJsonLd', () => {
	it('returns the name when present in response data', () => {
		expect(extractNameFromJsonLd(TEST_RESPONSE)).toBe(TEST_NAME);
	});

	it('returns undefined when details is undefined', () => {
		expect(extractNameFromJsonLd(undefined)).toBeUndefined();
	});

	it('returns undefined when details is not provided', () => {
		expect(extractNameFromJsonLd()).toBeUndefined();
	});

	it('returns undefined when data is missing', () => {
		// @ts-ignore For testing purpose
		expect(extractNameFromJsonLd({ meta: TEST_RESPONSE.meta })).toBeUndefined();
	});

	it('returns undefined when name is not present in data', () => {
		const responseWithoutName: JsonLd.Response = {
			...TEST_RESPONSE,
			data: {
				...TEST_BASE_DATA,
				name: undefined,
			},
		};
		expect(extractNameFromJsonLd(responseWithoutName)).toBeUndefined();
	});

	it('returns undefined when name is an empty string', () => {
		const responseWithEmptyName: JsonLd.Response = {
			...TEST_RESPONSE,
			data: {
				...TEST_BASE_DATA,
				name: '',
			},
		};
		expect(extractNameFromJsonLd(responseWithEmptyName)).toBeUndefined();
	});

	it('returns the name string when data has a name field', () => {
		const customName = 'Custom Link Name';
		const responseWithCustomName: JsonLd.Response = {
			...TEST_RESPONSE,
			data: {
				...TEST_BASE_DATA,
				name: customName,
			},
		};
		expect(extractNameFromJsonLd(responseWithCustomName)).toBe(customName);
	});
});
