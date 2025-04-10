import { SmartLinkResponse } from '@atlaskit/linking-types';

import { TEST_INTERACTIVE_HREF_LINK } from '../../common/__mocks__/linkingPlatformJsonldMocks';
import {
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	genericExtractPropsFromJSONLD,
} from '../../index';

const defaultExtractorFunction = () => ({
	title: { text: 'default extractor function' },
});

const extractorPrioritiesByType = {
	Object: 0,
	Document: 5,
};

const extractorFunctionsByType = {
	Object: () => ({ title: { text: 'object extractor function' } }),
	Document: () => ({ title: { text: 'document extractor function' } }),
};

const defaultOptions = {
	defaultExtractorFunction,
	extractorPrioritiesByType,
	extractorFunctionsByType,
	json: {},
};

describe('genericExtractPropsFromJSONLD()', () => {
	it('should extract props using the default extractor function when json is undefined', () => {
		const options = {
			...defaultOptions,
			json: undefined,
		};
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'default extractor function',
			},
		});
	});

	it('should extract props using the default extractor function when @type is undefined', () => {
		const options = defaultOptions;
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'default extractor function',
			},
		});
	});

	it('should extract props using the default extractor function when @type is not known', () => {
		const options = {
			...defaultOptions,
			json: {
				'@type': 'foobar',
			},
		};
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'default extractor function',
			},
		});
	});

	it('should extract props using the extractor function for the type when type is known', () => {
		const options = {
			...defaultOptions,
			json: {
				'@type': 'Object',
			},
		};
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'object extractor function',
			},
		});
	});

	it('should extract props using the highest priority extractor function for one of the types when type is an array and one of the types is known', () => {
		const options = {
			...defaultOptions,
			json: {
				'@type': ['Object', 'Document'],
			},
		};
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'document extractor function',
			},
		});
	});

	it('should extract props using the default extractor function when type is an array and none of the types are known', () => {
		const options = {
			...defaultOptions,
			json: {
				'@type': ['foo', 'bar'],
			},
		};
		expect(genericExtractPropsFromJSONLD(options)).toEqual({
			title: {
				text: 'default extractor function',
			},
		});
	});
});

describe('extractSmartLinkEmbed()', () => {
	it('should return undefined when response is not an entity and has no preview', () => {
		const response = { data: {} } as SmartLinkResponse;
		expect(extractSmartLinkEmbed(response)).toBeUndefined();
	});

	it('should return embed URL when response is a design entity with embed URL', () => {
		const response = {
			meta: { visibility: 'public', access: 'granted' },
			data: { '@type': 'Object', embedUrl: 'https://example.com/embed' },
			nounData: { ['atlassian:design']: { liveEmbedUrl: 'https://example.com/embed' } },
		} as unknown as SmartLinkResponse;

		expect(extractSmartLinkEmbed(response)).toEqual({ src: 'https://example.com/embed' });
	});

	it('should return undefined when response is an entity without embed URL', () => {
		const response = {
			meta: { visibility: 'public' },
			data: { '@type': 'Object' },
			nounData: {},
		} as SmartLinkResponse;

		expect(extractSmartLinkEmbed(response)).toBeUndefined();
	});

	it('should return preview when response is not an entity but has a valid preview', () => {
		const response = {
			data: {
				'@type': 'Document',
				preview: TEST_INTERACTIVE_HREF_LINK,
			},
		} as unknown as SmartLinkResponse;

		expect(extractSmartLinkEmbed(response)).toEqual({ src: 'https://my.url.com' });
	});
});

describe('extractSmartLinkTitle()', () => {
	it('should return entity title when response is an entity', () => {
		const response = {
			meta: { visibility: 'public', access: 'granted' },
			data: { '@type': 'Object', name: 'Entity Title' },
			nounData: { displayName: 'Entity Title' },
		} as unknown as SmartLinkResponse;

		expect(extractSmartLinkTitle(response)).toEqual('Entity Title');
	});

	it('should return undefined when response is not an entity and has no title', () => {
		const response = { data: {} } as SmartLinkResponse;
		expect(extractSmartLinkTitle(response)).toBeUndefined();
	});

	it('should return title when response is not an entity but has a title', () => {
		const response = {
			data: {
				'@type': 'Document',
				name: 'Non-Entity Title',
			},
		} as unknown as SmartLinkResponse;

		expect(extractSmartLinkTitle(response)).toEqual('Non-Entity Title');
	});
});
