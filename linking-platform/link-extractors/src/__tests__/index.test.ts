import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { TEST_INTERACTIVE_HREF_LINK } from '../__mocks__/linkingPlatformJsonldMocks';
import { extractEntityIcon } from '../extract-entity-icon';
import { extractSmartLinkAri } from '../extract-smart-link-ari';
import { extractSmartLinkCreatedBy } from '../extract-smart-link-created-by';
import { extractSmartLinkCreatedOn } from '../extract-smart-link-created-on';
import { extractSmartLinkEmbed } from '../extract-smart-link-embed';
import { extractSmartLinkModifiedBy } from '../extract-smart-link-modified-by';
import { extractSmartLinkModifiedOn } from '../extract-smart-link-modified-on';
import { extractSmartLinkProvider } from '../extract-smart-link-provider';
import { extractSmartLinkTitle } from '../extract-smart-link-title';
import { extractSmartLinkUrl } from '../extract-smart-link-url';
import { genericExtractPropsFromJSONLD } from '../generic-extract-props-from-jsonld';

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

describe('entity data', () => {
	describe('extractSmartLinkEmbed()', () => {
		it('should return undefined when response is not an entity and has no preview', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkEmbed(response)).toBeUndefined();
		});

		it('should return embed URL when response is a design entity with embed URL', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object', embedUrl: 'https://example.com/embed' },
				entityData: { liveEmbedUrl: 'https://example.com/embed' },
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkEmbed(response)).toEqual({ src: 'https://example.com/embed' });
		});

		it('should return undefined when response is an entity without embed URL', () => {
			const response = {
				meta: { visibility: 'public' },
				data: { '@type': 'Object' },
				entityData: {},
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
				entityData: { displayName: 'Entity Title' },
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

	describe('extractSmartLinkUrl()', () => {
		it('should return entity URL when response is an entity', () => {
			const url = 'https://example.com/entity';
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: {
					url,
				},
			} as SmartLinkResponse;

			expect(extractSmartLinkUrl(response)).toEqual(url);
		});

		it('should return undefined when response is not an entity and has no URL', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkUrl(response)).toBeUndefined();
		});

		it('should return URL when response is not an entity but has a URL', () => {
			const url = 'https://example.com/document';
			const response = {
				data: {
					'@type': 'Document',
					url,
				},
			} as SmartLinkResponse;

			expect(extractSmartLinkUrl(response)).toEqual(url);
		});
	});

	describe('extractEntityIcon()', () => {
		it('should return design entity icon and type', () => {
			const url = 'https://example.com/icon.png';
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: {
					displayName: 'Entity Title',
					iconUrl: url,
					status: 'READY_FOR_DEVELOPMENT',
					type: 'FILE',
					id: 'entity-id',
					url: 'https://example.com/entity',
				},
			} as SmartLinkResponse;

			expect(extractEntityIcon(response)).toEqual({ url, label: 'FILE' });
		});
		it('should return undefined for unsupported entity shapes', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: {
					displayName: 'Entity Title',
					id: 'entity-id',
					url: 'https://example.com/entity',
				},
			} as SmartLinkResponse;

			expect(extractEntityIcon(response)).toBeUndefined();
		});
		it('should return document type icon', () => {
			const url = 'https://example.com/icon.png';
			const response = {
				meta: {
					visibility: 'public',
					access: 'granted',
					generator: {
						name: 'Google',
						icon: {
							url: 'https://google-icon.com/icon.png',
						},
					},
				},
				data: { '@type': 'Object' },
				entityData: {
					displayName: 'Entity Title',
					type: {
						category: 'document',
						iconUrl: url,
					},
					id: 'entity-id',
					url: 'https://example.com/entity',
				},
			};

			expect(extractEntityIcon(response as any)).toEqual({
				url: 'https://example.com/icon.png',
				label: 'document',
			});
		});
	});

	describe('extractSmartLinkProvider()', () => {
		it('should return entityProvider when response is an entity and meta.generator is present', () => {
			failGate('platform_lp_use_generator_icon_for_provider');

			const response = {
				meta: {
					generator: {
						name: 'Figma',
						image: 'https://static.figma.com/app/icon/1/favicon.ico',
						icon: {
							url: 'https://static.figma.com/app/icon/1/favicon.ico',
						},
					},
				},
				data: { '@type': 'Object' },
				entityData: {},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkProvider(response)).toEqual({
				text: 'Figma',
				id: undefined,
				icon: 'https://static.figma.com/app/icon/1/favicon.ico',
				image: 'https://static.figma.com/app/icon/1/favicon.ico',
				iconLabel: 'Figma',
			});
		});

		it('should return `undefined` when response is an entity but meta is missing generator', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: {
					displayName: 'Entity Title',
					iconUrl: 'https://example.com/icon.png',
				},
			} as SmartLinkResponse;
			expect(extractSmartLinkProvider(response)).toBeUndefined();
		});

		it('should return `undefined` when response is not an entity and data has no provider', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkProvider(response)).toBeUndefined();
		});

		it('should return provider information when response is not an entity but has a provider', () => {
			const response = {
				data: {
					'@type': 'Document',
					generator: {
						'@type': 'Application',
						name: 'Figma',
						icon: {
							'@type': 'Image',
							url: 'https://static.figma.com/app/icon/1/favicon.ico',
						},
					},
				},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkProvider(response)).toEqual({
				text: 'Figma',
				id: undefined,
				icon: 'https://static.figma.com/app/icon/1/favicon.ico',
				image: undefined,
				iconLabel: 'Figma',
			});
		});

		const documentEntityResponse = {
			meta: {
				generator: {
					name: 'Google Drive',
					id: 'google-drive',
					icon: {
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
			data: { '@type': 'Object' },
			entityData: {
				displayName: 'Entity',
				id: 'entity-id',
				url: 'https://entity-url.com',
				type: {
					category: 'document',
					iconUrl: 'https://entity-icon.com/icon.png',
				},
			},
		} as unknown as SmartLinkResponse;

		it('should use generator icon URL and label for document entity providers when the gate is on', () => {
			passGate('platform_lp_use_generator_icon_for_provider');

			expect(extractSmartLinkProvider(documentEntityResponse)).toEqual({
				text: 'Google Drive',
				id: 'google-drive',
				icon: 'https://provider-icon.com/icon.png',
				image: 'https://provider-icon.com/icon.png',
				iconLabel: 'Google Drive',
			});
		});

		it('should keep using entity icon URL and label for document entity providers when the gate is off', () => {
			failGate('platform_lp_use_generator_icon_for_provider');

			expect(extractSmartLinkProvider(documentEntityResponse)).toEqual({
				text: 'Google Drive',
				id: 'google-drive',
				icon: 'https://entity-icon.com/icon.png',
				image: 'https://entity-icon.com/icon.png',
				iconLabel: 'document',
			});
		});
	});

	describe('extractSmartLinkAri()', () => {
		it('should return entity ARI when response is an entity', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: { ari: 'ari:cloud:jira:1234567890' },
			} as SmartLinkResponse;

			expect(extractSmartLinkAri(response)).toEqual('ari:cloud:jira:1234567890');
		});

		it('should return undefined when response is not an entity and has no ARI', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkAri(response)).toBeUndefined();
		});

		it('should return ARI when response is not an entity but has an ARI', () => {
			const response = {
				data: {
					'@type': 'Document',
					['atlassian:ari']: 'ari:cloud:jira:1234567890',
				},
			} as SmartLinkResponse;

			expect(extractSmartLinkAri(response)).toEqual('ari:cloud:jira:1234567890');
		});
	});

	describe('extractSmartLinkCreatedOn()', () => {
		it('should return createdOn date when response is an entity', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				entityData: { createdAt: '2023-01-01T00:00:00Z' },
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkCreatedOn(response)).toEqual('2023-01-01T00:00:00Z');
		});

		it('should return undefined when response is not an entity and has no createdOn date', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkCreatedOn(response)).toBeUndefined();
		});

		it('should return createdOn date when response is not an entity but has a createdOn date', () => {
			const response = {
				data: {
					'@type': 'Document',
					['schema:dateCreated']: '2023-01-01T00:00:00Z',
				},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkCreatedOn(response)).toEqual('2023-01-01T00:00:00Z');
		});
	});

	describe('extractSmartLinkModifiedOn()', () => {
		it('should return modifiedOn date when response is an entity', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: { lastUpdatedAt: '2023-01-01T00:00:00Z' },
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkModifiedOn(response)).toEqual('2023-01-01T00:00:00Z');
		});

		it('should return undefined when response is not an entity and has no modifiedOn date', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkModifiedOn(response)).toBeUndefined();
		});

		it('should return modifiedOn date when response is not an entity but has a modifiedOn date', () => {
			const response = {
				data: {
					'@type': 'Document',
					updated: '2023-01-01T00:00:00Z',
				},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkModifiedOn(response)).toEqual('2023-01-01T00:00:00Z');
		});
	});

	describe('extractSmartLinkCreatedBy()', () => {
		it('should return createdBy when response is an entity', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: { createdBy: { displayName: 'user123' } },
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkCreatedBy(response)).toEqual('user123');
		});

		it('should return undefined when response is not an entity and has no createdBy', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkCreatedBy(response)).toBeUndefined();
		});

		it('should return createdBy when response is not an entity but has a createdBy', () => {
			const response = {
				data: {
					'@type': 'Document',
					attributedTo: [{ name: 'user123' }],
				},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkCreatedBy(response)).toEqual('user123');
		});
	});

	describe('extractSmartLinkModifiedBy()', () => {
		it('should return modifiedBy when response is an entity', () => {
			const response = {
				meta: { visibility: 'public', access: 'granted' },
				data: { '@type': 'Object' },
				entityData: { lastUpdatedBy: { displayName: 'user123' } },
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkModifiedBy(response)).toEqual('user123');
		});

		it('should return undefined when response is not an entity and has no modifiedBy', () => {
			const response = { data: {} } as SmartLinkResponse;
			expect(extractSmartLinkModifiedBy(response)).toBeUndefined();
		});

		it('should return modifiedBy when response is not an entity but has a modifiedBy', () => {
			const response = {
				data: {
					'@type': 'Document',
					['atlassian:updatedBy']: { name: 'user123' },
				},
			} as unknown as SmartLinkResponse;

			expect(extractSmartLinkModifiedBy(response)).toEqual('user123');
		});
	});
});
