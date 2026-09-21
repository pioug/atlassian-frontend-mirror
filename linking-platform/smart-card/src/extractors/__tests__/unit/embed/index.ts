import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { mocks } from '../../../../utils/mocks';
import { extractEmbedProps } from '../../../embed';

describe('extractEmbedProps', () => {
	it('extracts embed props', () => {
		const props = extractEmbedProps(mocks.unauthorized, 'web');

		expect(props).toEqual({
			isTrusted: true,
			isSupportProductContext: false,
			link: 'https://some.url',
			title: 'I love cheese',
			isSupportTheming: false,
			type: ['Object'],
		});
	});

	it('extracts embed props with provider details', () => {
		const data = {
			...mocks.unauthorized.data,
			generator: {
				'@type': 'Application',
				name: 'provider-name',
				icon: {
					'@type': 'Image',
					url: 'https://some.image.icon',
				},
				image: {
					'@type': 'Image',
					url: 'https://some.image.url',
				},
			},
		} as JsonLd.Data.BaseData;
		const props = extractEmbedProps({ ...mocks.unauthorized, data }, 'web');

		expect(props).toEqual({
			context: {
				icon: 'https://some.image.icon',
				iconLabel: 'provider-name',
				id: undefined,
				image: 'https://some.image.url',
				text: 'provider-name',
			},
			isTrusted: true,
			isSupportProductContext: false,
			isSupportTheming: false,
			link: 'https://some.url',
			preview: undefined,
			title: 'I love cheese',
			type: ['Object'],
		});
	});

	it('supports host product context for the AVP Platform provider', () => {
		const props = extractEmbedProps(
			{
				...mocks.unauthorized,
				meta: { ...mocks.unauthorized.meta, key: 'avpplatform-object-provider' },
			},
			'web',
		);

		expect(props.isSupportProductContext).toBe(true);
	});
});

describe('embed icon behaviour with standardise flag on', () => {
	it('returns object icon url when it exists', () => {
		const data = {
			...mocks.success.data,
			icon: {
				href: 'http://object-icon.url',
				'@type': 'Link',
			},
			generator: {
				'@type': 'Application',
				name: 'provider-name',
				icon: {
					'@type': 'Image',
					url: 'https://provider-icon.url',
				},
				image: {
					'@type': 'Image',
					url: 'https://object.image.url',
				},
			},
		} as JsonLd.Data.BaseData;
		const props = extractEmbedProps({ ...mocks.success, data }, 'web');
		expect(props.context?.icon).toEqual('http://object-icon.url');
	});

	it(`returns provider icon if object icon url doesn't exist`, () => {
		const data = {
			...mocks.success.data,
			icon: undefined,
			generator: {
				'@type': 'Application',
				name: 'provider-name',
				icon: {
					'@type': 'Image',
					url: 'https://provider-icon.url',
				},
				image: {
					'@type': 'Image',
					url: 'https://object.image.url',
				},
			},
		} as JsonLd.Data.BaseData;
		const props = extractEmbedProps({ ...mocks.success, data }, 'web');
		expect(props.context?.icon).toEqual('https://provider-icon.url');
	});
});

describe('entity support', () => {
	it('extracts embed props with provider details', () => {
		failGate('platform_lp_use_generator_icon_for_provider');

		const meta = {
			...mocks.unauthorized.meta,
			generator: {
				name: 'I love cheese',
				icon: {
					url: 'https://www.ilovecheese.com',
				},
			},
		};
		const props = extractEmbedProps({ ...mocks.entityDataSuccess, meta }, 'web');

		expect(props).toEqual({
			context: {
				text: 'I love cheese',
				icon: 'https://www.ilovecheese.com',
				iconLabel: 'I love cheese',
				id: undefined,
				image: 'https://www.ilovecheese.com',
			},
			isTrusted: true,
			isSupportProductContext: false,
			isSupportTheming: false,
			link: 'https://some.url',
			title: 'I love cheese',
			preview: {
				src: 'https://www.ilovecheese.com',
			},
			type: ['Object'],
		});
	});
});

describe('entity embed icon behaviour', () => {
	const response = {
		...mocks.entityDataSuccess,
		meta: {
			...mocks.entityDataSuccess.meta,
			generator: {
				name: 'Google Drive',
				icon: { url: 'https://provider-icon.com/icon.png' },
			},
		},
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

	it('exposes separate entity and provider icons when the provider icon gate is on', () => {
		passGate('platform_lp_use_generator_icon_for_provider');

		const props = extractEmbedProps(response, 'web');

		expect(props.context?.icon).toEqual('https://entity-icon.com/icon.png');
		expect(props.context?.iconLabel).toEqual('document');
		expect(props.context?.providerIcon).toEqual('https://provider-icon.com/icon.png');
		expect(props.context?.providerIconLabel).toEqual('Google Drive');
		expect(props.context?.image).toEqual('https://provider-icon.com/icon.png');
		expect(props.context?.text).toEqual('Google Drive');
	});

	it('retains the legacy entity-only context when the provider icon gate is off', () => {
		failGate('platform_lp_use_generator_icon_for_provider');

		const props = extractEmbedProps(response, 'web');

		expect(props.context?.icon).toEqual('https://entity-icon.com/icon.png');
		expect(props.context?.iconLabel).toEqual('document');
		expect(props.context?.providerIcon).toBeUndefined();
		expect(props.context?.providerIconLabel).toBeUndefined();
		expect(props.context?.image).toEqual('https://entity-icon.com/icon.png');
		expect(props.context?.text).toEqual('Google Drive');
	});
});
