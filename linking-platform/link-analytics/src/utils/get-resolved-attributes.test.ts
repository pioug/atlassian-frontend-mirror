import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { mocks } from '../__fixtures__/mocks';
import { getResolvedAttributes } from './get-resolved-attributes';

describe('getResolvedAttributes', () => {
	const documentContext: JsonLd.Primitives.Context = {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	};
	const linkDetails = {
		url: 'some-url',
	};

	it('omits the subtype when its gate is disabled', () => {
		failGate('platform_smartlinks_subtype_analytics');
		const data: JsonLd.Data.Document = {
			'@context': documentContext,
			'@type': 'schema:SpreadsheetDigitalDocument',
			'schema:fileFormat': 'application/vnd.google-apps.spreadsheet',
		};
		const response: JsonLd.Response = { ...mocks.success, data };
		expect(getResolvedAttributes(linkDetails, response)).not.toHaveProperty(
			'destinationObjectSubtype',
		);
	});

	it('adds only the classified subtype when its gate is enabled', () => {
		const data: JsonLd.Data.Document = {
			'@context': documentContext,
			'@type': 'schema:SpreadsheetDigitalDocument',
			'schema:fileFormat': 'application/vnd.google-apps.spreadsheet',
		};
		const response: JsonLd.Response = { ...mocks.success, data };
		passGate('platform_smartlinks_subtype_analytics');
		expect(getResolvedAttributes(linkDetails, response)).toEqual({
			status: 'resolved',
			statusDetails: null,
			displayCategory: 'smartLink',
			extensionKey: 'object-provider',
			destinationTenantId: 'tenantId',
			destinationActivationId: 'activationId',
			destinationContainerId: null,
			destinationCategory: 'object',
			destinationProduct: 'jira',
			destinationSubproduct: 'core',
			destinationObjectId: null,
			destinationObjectType: null,
			canBeDatasource: false,
			destinationObjectSubtype: 'spreadsheet',
		});
	});

	it.each([
		['absent response', undefined],
		['absent data', { meta: mocks.unauthorized.meta }],
		['null data', { meta: mocks.forbidden.meta, data: null }],
		['empty data', { meta: mocks.success.meta, data: {} }],
	])('omits the subtype for %s when the gate is enabled', (_name, response) => {
		passGate('platform_smartlinks_subtype_analytics');
		expect(
			getResolvedAttributes(linkDetails, response as JsonLd.Response | undefined),
		).not.toHaveProperty('destinationObjectSubtype');
	});

	it('includes a specific type fallback without file format', () => {
		passGate('platform_smartlinks_subtype_analytics');
		const data: JsonLd.Data.Document = {
			'@context': documentContext,
			'@type': ['schema:SpreadsheetDigitalDocument', 'Object'],
		};
		expect(getResolvedAttributes(linkDetails, { ...mocks.success, data })).toHaveProperty(
			'destinationObjectSubtype',
			'spreadsheet',
		);
	});

	it('returns attributes for unresolved links', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.notFound);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'not_found',
				displayCategory: 'link',
			}),
		);
	});

	it('returns Analytics attributes successfully', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.success);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'smartLink',
				extensionKey: 'object-provider',
				canBeDatasource: false,
			}),
		);
	});

	it('returns Analytics attributes successfully with canBeDatasource = true when datasources are present in the response details', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.withDatasources);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'smartLink',
				extensionKey: 'object-provider',
				canBeDatasource: true,
			}),
		);
	});

	it('should return `displayCategory` as `link` even if the link can be resolved', () => {
		const resolvedAttributes = getResolvedAttributes(
			{ ...linkDetails, displayCategory: 'link' },
			mocks.success,
		);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'link',
				extensionKey: 'object-provider',
			}),
		);
	});
});
