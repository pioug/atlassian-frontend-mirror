import { type JsonLd } from 'json-ld-types';

import { IconType, SmartLinkStatus } from '../../../../constants';
import { extractErrorIcon } from '../index';

describe('extractErrorIcon', () => {
	it('returns provider icon', () => {
		const icon = extractErrorIcon({
			meta: {
				auth: [],
				definitionId: 'confluence-object-provider',
				visibility: 'restricted',
				access: 'forbidden',
				resourceType: 'page',
				key: 'confluence-object-provider',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				generator: {
					'@type': 'Application',
					'@id': 'https://www.atlassian.com/#Confluence',
					name: 'Confluence',
				},
				'@type': ['Document', 'schema:TextDigitalDocument'],
			},
		} as JsonLd.Response);

		expect(icon).toEqual({ icon: IconType.Confluence });
	});

	it.each([
		[SmartLinkStatus.Forbidden, IconType.Forbidden],
		[SmartLinkStatus.Unauthorized, IconType.Forbidden],
		[SmartLinkStatus.NotFound, IconType.Error],
		[SmartLinkStatus.Errored, IconType.Default],
		[SmartLinkStatus.Fallback, IconType.Default],
	])('returns fallback icon', (status: SmartLinkStatus, iconType: IconType) => {
		const icon = extractErrorIcon(undefined, status);

		expect(icon).toEqual({ icon: iconType });
	});
});
