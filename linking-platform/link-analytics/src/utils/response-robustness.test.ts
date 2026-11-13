import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { fakeFactory, mocks } from '../__fixtures__/mocks';
import { getResolvedAttributes } from './get-resolved-attributes';
import { getResourceSubtype } from './get-resource-subtype';
import { resolveAttributes } from './resolve-attributes';

const values: unknown[] = [
	undefined,
	null,
	false,
	true,
	0,
	42,
	'',
	'synthetic private value',
	[],
	[null],
	{},
	{ value: 'private' },
	['Object'],
	[['Image']],
	'application/pdf',
	'schema:SpreadsheetDigitalDocument',
];
// Deliberately bypass the static contract to model malformed network JSON.
const asResponse = (value: unknown): JsonLd.Response => value as JsonLd.Response;

describe('response robustness', () => {
	it('preserves gate-off omission for absent data', () => {
		failGate('platform_smartlinks_subtype_analytics');
		expect(getResolvedAttributes({ url: 'some-url' }, undefined)).not.toHaveProperty(
			'destinationObjectSubtype',
		);
	});

	it('omits the subtype with absent data regardless of malformed metadata', () => {
		passGate('platform_smartlinks_subtype_analytics');
		for (const meta of values) {
			expect(
				getResolvedAttributes({ url: 'some-url' }, asResponse({ meta, data: null })),
			).not.toHaveProperty('destinationObjectSubtype');
		}
		for (const access of values) {
			for (const requestAccess of values) {
				const response = asResponse({
					meta: { access, visibility: 'not_found', requestAccess },
					data: null,
				});
				expect(getResolvedAttributes({ url: 'some-url' }, response)).not.toHaveProperty(
					'destinationObjectSubtype',
				);
			}
		}
	});

	it('keeps a usable subtype even when meta is unavailable', () => {
		passGate('platform_smartlinks_subtype_analytics');
		const response = asResponse({ data: { 'schema:fileFormat': 'application/pdf' } });
		expect(getResolvedAttributes({ url: 'some-url' }, response)).toMatchObject({
			status: null,
			destinationObjectSubtype: 'pdf',
		});
	});

	it('prioritises formats and safely falls back across all field shapes', () => {
		for (const format of values) {
			for (const type of values) {
				const expected =
					typeof format === 'string' && format.trim().length > 0
						? format === 'application/pdf'
							? 'pdf'
							: 'other'
						: type === 'schema:SpreadsheetDigitalDocument'
							? 'spreadsheet'
							: undefined;
				expect(getResourceSubtype({ 'schema:fileFormat': format, '@type': type })).toBe(expected);
			}
		}
	});

	it.each(values.map((value, index) => [index, value] as const))(
		'omits unusable data shape %s through attributes and lifecycle',
		async (_index, data) => {
			passGate('platform_smartlinks_subtype_analytics');
			const response = asResponse({ meta: mocks.success.meta, data });
			expect(getResolvedAttributes({ url: 'some-url' }, response)).not.toHaveProperty(
				'destinationObjectSubtype',
			);
			const client = new (fakeFactory(async () => response))();
			expect(
				await resolveAttributes({ url: 'some-url' }, client, { getState: () => ({}) }),
			).not.toHaveProperty('destinationObjectSubtype');
		},
	);

	it.each([
		['undefined response', undefined],
		['null response', null],
		['empty response', {}],
		['missing meta with valid data', { data: { 'schema:fileFormat': 'application/pdf' } }],
		['null meta', { meta: null }],
		['undefined meta', { meta: undefined }],
		['array response', []],
		['string response', 'unexpected'],
		['false response', false],
		['number response', 42],
	])('does not throw for %s', async (_name, value) => {
		passGate('platform_smartlinks_subtype_analytics');
		const response = asResponse(value);
		expect(() => getResolvedAttributes({ url: 'some-url' }, response)).not.toThrow();
		const client = new (fakeFactory(async () => response))();
		await expect(
			resolveAttributes({ url: 'some-url' }, client, { getState: () => ({}) }),
		).resolves.toBeDefined();
		await expect(
			resolveAttributes({ url: 'some-url' }, client, {
				getState: () => ({ 'some-url': { details: response, status: 'resolved' } }),
			}),
		).resolves.toBeDefined();
	});

	it.each(values.map((value, index) => [index, value] as const))(
		'handles nested meta and datasource shape %s',
		(_index, value) => {
			passGate('platform_smartlinks_subtype_analytics');
			const response = asResponse({
				meta: { ...mocks.success.meta, requestAccess: value },
				datasources: value,
				data: null,
			});
			expect(getResolvedAttributes({ url: 'some-url' }, response)).not.toHaveProperty(
				'destinationObjectSubtype',
			);
		},
	);
});
