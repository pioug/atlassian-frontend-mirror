import { type JsonLd } from '@atlaskit/json-ld-types';

import extractUrlIcon from '../extract-url-icon';

describe('extractUrlIcon', () => {
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
	])('returns icon url from %s', (_, jsonld) => {
		const { icon, label, url } = extractUrlIcon(jsonld) || {};

		expect(icon).toBeUndefined();
		expect(label).toBeUndefined();
		expect(url).toEqual(expectedUrl);
	});

	it('returns icon url with custom label', () => {
		const customLabel = 'custom-label';

		const { icon, label, url } = extractUrlIcon(expectedUrl, customLabel) || {};

		expect(icon).toBeUndefined();
		expect(label).toEqual(customLabel);
		expect(url).toEqual(expectedUrl);
	});

	it('returns undefined if JSON-LD data is not provided', () => {
		const iconDescriptor = extractUrlIcon();

		expect(iconDescriptor).toBeUndefined();
	});

	it('returns undefined if JSON-LD data does not have url', () => {
		const iconDescriptor = extractUrlIcon({
			...jsonldImage,
			url: undefined,
		});

		expect(iconDescriptor).toBeUndefined();
	});
});
