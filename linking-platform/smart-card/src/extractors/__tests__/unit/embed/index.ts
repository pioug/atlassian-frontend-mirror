import { type JsonLd } from 'json-ld-types';

import { mocks } from '../../../../utils/mocks';
import { extractEmbedProps } from '../../../embed';

describe('extractEmbedProps', () => {
	it('extracts embed props', () => {
		const props = extractEmbedProps(
			mocks.unauthorized.data as JsonLd.Data.BaseData,
			mocks.unauthorized.meta,
			'web',
		);

		expect(props).toEqual({
			isTrusted: true,
			link: 'https://some.url',
			title: 'I love cheese',
			isSupportTheming: false,
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
		const props = extractEmbedProps(data, mocks.unauthorized.meta, 'web');

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
			const props = extractEmbedProps(data, mocks.success.meta, 'web');
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
			const props = extractEmbedProps(data, mocks.success.meta, 'web');
			expect(props.context?.icon).toEqual('https://provider-icon.url');
		});
	});
});
