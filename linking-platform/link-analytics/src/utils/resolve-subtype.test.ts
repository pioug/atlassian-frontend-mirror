import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { fakeFactory, mocks } from '../__fixtures__/mocks';
import type { CardStore } from '../types';
import { resolveAttributes } from './resolve-attributes';

describe('resource subtype lifecycle attributes', () => {
	it.each([true, false])('includes the subtype with cached response = %s', async (cached) => {
		passGate('platform_smartlinks_subtype_analytics');
		const data: JsonLd.Data.Document = {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Document',
			'schema:fileFormat': 'application/pdf',
		};
		const response: JsonLd.Response = { ...mocks.success, data };
		const fetch = jest.fn(async () => response);
		const client = new (fakeFactory(fetch))();
		const store: CardStore = {
			getState: () => {
				if (cached) {
					return { 'some-url': { details: response, status: 'resolved' } };
				}
				return {};
			},
		};
		expect(await resolveAttributes({ url: 'some-url' }, client, store)).toHaveProperty(
			'destinationObjectSubtype',
			'pdf',
		);
	});

	it('omits the subtype when resolution fails without data', async () => {
		passGate('platform_smartlinks_subtype_analytics');
		const fetch = jest.fn(async () => {
			throw new Error('synthetic private error');
		});
		const client = new (fakeFactory(fetch))();
		expect(
			await resolveAttributes({ url: 'some-url' }, client, { getState: () => ({}) }),
		).not.toHaveProperty('destinationObjectSubtype');
	});
});
