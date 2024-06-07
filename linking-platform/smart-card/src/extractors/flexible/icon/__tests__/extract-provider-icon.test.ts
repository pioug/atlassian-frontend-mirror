import { type JsonLd } from 'json-ld-types';

import extractProviderIcon from '../extract-provider-icon';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../constants';
import { IconType } from '../../../../constants';

describe('extractProviderIcon', () => {
	const getData = ({
		name,
		provider,
		icon,
	}: {
		name?: string;
		provider?: string;
		icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link;
	}): JsonLd.Data.BaseData => {
		const baseData: JsonLd.Data.BaseData = {
			'@type': 'Object',
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			url: 'https://some-url.com',
		};

		const data: JsonLd.Data.BaseData = {
			...baseData,
			generator: {
				'@type': 'Object',
				'@id': provider,
				icon,
				name,
			},
		};

		return data;
	};

	describe.each([
		['Confluence', CONFLUENCE_GENERATOR_ID, IconType.Confluence, 'Confluence'],
		['Jira', JIRA_GENERATOR_ID, IconType.Jira, 'Jira'],
	])('%s icon', (_, provider, expectedIconType, expectedLabel) => {
		it(`returns ${expectedIconType} with default label`, () => {
			const data = getData({ provider });
			const { icon, label } = extractProviderIcon(data) || {};

			expect(icon).toEqual(expectedIconType);
			expect(label).toEqual(expectedLabel);
		});

		it(`returns ${expectedIconType} with custom label`, () => {
			const customLabel = 'custom-label';
			const data = getData({
				provider,
				name: customLabel,
				icon: 'https://some-url.com',
			});
			const { icon, label } = extractProviderIcon(data) || {};

			expect(icon).toEqual(expectedIconType);
			expect(label).toEqual(customLabel);
		});
	});

	describe('URL', () => {
		const expectedUrl = 'https://some-url.com';
		const jsonldLinkModel: JsonLd.Primitives.Link = {
			'@type': 'Link',
			href: expectedUrl,
		};
		const jsonldImage: JsonLd.Primitives.Image = {
			'@type': 'Image',
			url: expectedUrl,
		};
		const jsonldImageLinkModel: JsonLd.Primitives.Image = {
			'@type': 'Image',
			url: jsonldLinkModel,
		};

		it.each([
			['JsonLd.Primitives.Link (string)', expectedUrl],
			['JsonLd.Primitives.Link (LinkModel)', jsonldLinkModel],
			['JsonLd.Primitives.Image (string)', jsonldImage],
			['JsonLd.Primitives.Image (LinkModel)', jsonldImageLinkModel],
		])('returns icon url from %s', (_, icon) => {
			const { icon: actualIcon, label, url } = extractProviderIcon(getData({ icon })) || {};

			expect(actualIcon).toBeUndefined();
			expect(label).toBeUndefined();
			expect(url).toEqual(expectedUrl);
		});

		it('returns icon url with custom label', () => {
			const customLabel = 'custom-label';

			const { icon, label, url } =
				extractProviderIcon(getData({ name: customLabel, icon: expectedUrl })) || {};

			expect(icon).toBeUndefined();
			expect(label).toEqual(customLabel);
			expect(url).toEqual(expectedUrl);
		});

		it('returns undefined if JSON-LD data is not provided', () => {
			const iconDescriptor = extractProviderIcon();

			expect(iconDescriptor).toBeUndefined();
		});

		it('returns undefined if JSON-LD data does not have url', () => {
			const icon = {
				...jsonldImage,
				url: undefined,
			};
			const iconDescriptor = extractProviderIcon(getData({ icon }));

			expect(iconDescriptor).toBeUndefined();
		});
	});
});
