import { type JsonLd } from '@atlaskit/json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { mocks } from '../../../../utils/mocks';
import { extractEmbedProps } from '../../../embed';

describe('extractEmbedProps', () => {
	it('extracts embed props', () => {
		const props = extractEmbedProps(mocks.unauthorized, 'web');

		expect(props).toEqual({
			isTrusted: true,
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
				image: 'https://some.image.url',
				text: 'provider-name',
			},
			isTrusted: true,
			isSupportTheming: false,
			link: 'https://some.url',
			title: 'I love cheese',
			type: ['Object'],
		});
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

ffTest.on('smart_links_noun_support', 'entity support', () => {
	it('extracts embed props with provider details', () => {
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
				image: 'https://www.ilovecheese.com',
			},
			isTrusted: true,
			isSupportTheming: false,
			link: 'https://some.url',
			title: 'I love cheese',
			preview: {
				src: 'https://www.ilovecheese.com',
			},
			type: ['Object'],
		});
	});

	describe('embed icon behaviour with standardise flag on', () => {
		it('returns object icon url when it exists', () => {
			const props = extractEmbedProps(mocks.entityDataSuccess, 'web');
			expect(props.context?.icon).toEqual('https://www.ilovecheese.com');
		});

		it(`returns provider icon if object icon url doesn't exist`, () => {
			const props = extractEmbedProps(mocks.entityDataSuccess, 'web');
			expect(props.context?.icon).toEqual('https://www.ilovecheese.com');
		});
	});
});
