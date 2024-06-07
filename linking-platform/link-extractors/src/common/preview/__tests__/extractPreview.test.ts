import { type JsonLd } from 'json-ld-types';

import { expectToEqual } from '@atlaskit/media-test-helpers';

import {
	TEST_BASE_DATA,
	TEST_INTERACTIVE_HREF_LINK,
	TEST_INTERACTIVE_HREF_URL,
	TEST_LINK,
	TEST_OBJECT,
	TEST_STRING,
	TEST_URL,
} from '../../__mocks__/linkingPlatformJsonldMocks';
import { extractPreview } from '../extractPreview';

describe('extractPreview()', () => {
	it('returns raw string as src - link', () => {
		const data: JsonLd.Data.BaseData = { ...TEST_BASE_DATA };
		data.preview = {
			...(TEST_LINK as JsonLd.Primitives.LinkModel),
			'atlassian:aspectRatio': 0.72,
		};
		expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
	});

	it('returns raw string as src - interactive href without type annotation', () => {
		const data: JsonLd.Data.BaseData = { ...TEST_BASE_DATA };
		data.preview = {
			...(TEST_INTERACTIVE_HREF_LINK as any),
			'atlassian:aspectRatio': 0.72,
		};
		delete (data as any).preview['@type'];
		expectToEqual(extractPreview(data, 'web', 'interactiveHref'), {
			src: TEST_INTERACTIVE_HREF_URL,
			aspectRatio: 0.72,
		});
	});

	it('returns raw string as src - interactive href', () => {
		const data: JsonLd.Data.BaseData = { ...TEST_BASE_DATA };
		data.preview = {
			...(TEST_INTERACTIVE_HREF_LINK as any),
			'atlassian:aspectRatio': 0.72,
		};
		expectToEqual(extractPreview(data, 'web', 'interactiveHref'), {
			src: TEST_INTERACTIVE_HREF_URL,
			aspectRatio: 0.72,
		});
	});

	it('returns raw url as src - object', () => {
		const data = { ...TEST_BASE_DATA };
		data.preview = {
			...TEST_OBJECT,
			'atlassian:aspectRatio': 0.72,
		};
		expectToEqual(extractPreview(data), { src: TEST_URL, aspectRatio: 0.72 });
	});

	it('returns raw HTML as content - object', () => {
		const data = { ...TEST_BASE_DATA };
		data.preview = TEST_OBJECT;
		data.preview.content = TEST_STRING;
		delete data.preview.url;
		expect(extractPreview(data)).toEqual({ content: TEST_STRING });
	});
});
