import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { SmartLinkStatus } from '../../../constants';
import { getSimulatedBetterMetadata } from '../../../view/BlockCard/views/utils';
import { getContextByStatus } from '../../../view/FlexibleCard/getContextByStatus';
import extractFlexibleUiContext from '../index';

const url = 'https://some.url';

const getMeta = (key?: string): JsonLd.Meta.BaseMeta =>
	({
		access: 'granted',
		auth: [],
		definitionId: 'definition-id',
		key,
		visibility: 'public',
	}) as JsonLd.Meta.BaseMeta;

const extensionKeys = [
	'bitbucket-object-provider',
	'confluence-object-provider',
	'dragonfruit-object-provider',
	'jira-object-provider',
	'mercury-object-provider',
	'native-bitbucket-object-provider',
	'slack-object-provider',
	'trello-object-provider',
	undefined,
];

const responsesWithoutData = extensionKeys.flatMap((key) => [
	{ name: `meta only (${key})`, response: { meta: getMeta(key) } as JsonLd.Response },
	{
		name: `data is null (${key})`,
		response: { meta: getMeta(key), data: null } as unknown as JsonLd.Response,
	},
]);

const responsesWithEmptyData = extensionKeys.map((key) => ({
	name: `data has no @type (${key})`,
	response: { meta: getMeta(key), data: {} } as unknown as JsonLd.Response,
}));

const extract = (response: JsonLd.Response) =>
	extractFlexibleUiContext({
		actionOptions: { hide: false },
		appearance: 'block',
		id: 'id',
		response,
		status: SmartLinkStatus.Resolved,
		url,
	});

describe('extractors with missing or empty ORS response fields', () => {
	describe.each([...responsesWithoutData, ...responsesWithEmptyData])('$name', ({ response }) => {
		it('extractFlexibleUiContext does not throw and falls back to the url', () => {
			const context = extract(response);

			expect(context?.linkTitle?.text).toBe(url);
			expect(context?.url).toBeUndefined();
			expect(context?.type).toBeUndefined();
		});

		it('getContextByStatus does not throw for resolved status', () => {
			expect(() =>
				getContextByStatus({
					actionOptions: { hide: false },
					appearance: 'block',
					response,
					status: SmartLinkStatus.Resolved,
					url,
				} as Parameters<typeof getContextByStatus>[0]),
			).not.toThrow();
		});

		it('getSimulatedBetterMetadata does not throw', () => {
			expect(getSimulatedBetterMetadata(response).titleMetadata).toBeDefined();
		});
	});

	it('extractFlexibleUiContext does not throw when meta is missing', () => {
		const response = { data: { '@type': 'Object', name: 'name' } } as unknown as JsonLd.Response;

		const context = extractFlexibleUiContext({
			response,
			status: SmartLinkStatus.Resolved,
			url,
		});

		expect(context?.meta).toEqual({
			objectId: undefined,
			resourceType: undefined,
			tenantId: undefined,
		});
	});
});
