import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SmartLinkStatus } from '../../../constants';
import { getSimulatedBetterMetadata } from '../../../view/BlockCard/views/utils';
import { getContextByStatus } from '../../../view/FlexibleCard/getContextByStatus';
import extractFlexibleUiContext from '../index';

const GATE = 'platform_sl_null_safe_extractors';
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

const getResponsesWithoutData = (key?: string) => [
	{ name: `meta only (${key})`, response: { meta: getMeta(key) } as JsonLd.Response },
	{
		name: `data is null (${key})`,
		response: { meta: getMeta(key), data: null } as unknown as JsonLd.Response,
	},
];

const responsesWithoutData = extensionKeys.flatMap(getResponsesWithoutData);

const responsesWithEmptyData = extensionKeys.map((key) => ({
	name: `data has no @type (${key})`,
	response: { meta: getMeta(key), data: {} } as unknown as JsonLd.Response,
}));

// Only these getSimulatedBetterMetadata branches read data directly and are gated.
const gatedBlockCardKeys = [
	'bitbucket-object-provider',
	'native-bitbucket-object-provider',
	'jira-object-provider',
];

const isGatedBlockCardKey = (name: string) =>
	gatedBlockCardKeys.some((key) => name.endsWith(`(${key})`));

const isBitbucketKey = (name: string) => name.includes('bitbucket-object-provider)');

// The gate is only evaluated when the field it guards is missing: Bitbucket reads `@type`, so `data: {}`
// evaluates it; Jira only guards against missing `data`, so `data: {}` never reaches the gate.
const gatedBlockCardResponses = [
	...responsesWithoutData.filter(({ name }) => isGatedBlockCardKey(name)),
	...responsesWithEmptyData.filter(({ name }) => isBitbucketKey(name)),
];

const ungatedBlockCardResponses = [...responsesWithoutData, ...responsesWithEmptyData].filter(
	(response) => !gatedBlockCardResponses.includes(response),
);

const extract = (response: JsonLd.Response) =>
	extractFlexibleUiContext({
		actionOptions: { hide: false },
		appearance: 'block',
		id: 'id',
		response,
		status: SmartLinkStatus.Resolved,
		url,
	});

describe('extractors with ORS responses that have no data', () => {
	describe(`when ${GATE} is enabled`, () => {
		beforeEach(() => {
			passGate(GATE);
		});

		describe.each(responsesWithoutData)('$name', ({ response }) => {
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
		});

		it.each(gatedBlockCardResponses)(
			'getSimulatedBetterMetadata does not throw for $name',
			({ response }) => {
				expect(getSimulatedBetterMetadata(response).titleMetadata).toBeDefined();
			},
		);

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

	describe(`when ${GATE} is disabled`, () => {
		beforeEach(() => {
			failGate(GATE);
		});

		it.each(responsesWithoutData)(
			'extractFlexibleUiContext keeps existing behaviour and throws for $name',
			({ response }) => {
				expect(() => extract(response)).toThrow(TypeError);
			},
		);

		it.each(
			getResponsesWithoutData('jira-object-provider').concat({
				name: 'bitbucket data has no @type',
				response: {
					meta: getMeta('bitbucket-object-provider'),
					data: {},
				} as unknown as JsonLd.Response,
			}),
		)(
			'getSimulatedBetterMetadata keeps existing behaviour and throws for $name',
			({ response }) => {
				expect(() => getSimulatedBetterMetadata(response)).toThrow(TypeError);
			},
		);
	});

	describe(`responses that do not need ${GATE}`, () => {
		describe.each(responsesWithEmptyData)('$name', ({ response }) => {
			it('extractFlexibleUiContext does not throw and falls back to the url', () => {
				const context = extract(response);

				expect(context?.linkTitle?.text).toBe(url);
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
		});

		it.each(ungatedBlockCardResponses)(
			'getSimulatedBetterMetadata does not throw for $name',
			({ response }) => {
				expect(getSimulatedBetterMetadata(response).titleMetadata).toBeDefined();
			},
		);
	});
});
