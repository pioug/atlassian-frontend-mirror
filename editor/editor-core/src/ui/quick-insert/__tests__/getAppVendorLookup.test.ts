import { getAppVendorLookup } from '../app-vendor/getAppVendorLookup';

const FORGE_APP_ID = '4a3a8b2c-1f0e-4d6b-9c1a-2b3c4d5e6f70';

describe('getAppVendorLookup', () => {
	it('looks up Forge apps by their full app ARI', () => {
		expect(
			getAppVendorLookup({
				app: { key: FORGE_APP_ID, source: 'ecosystem' },
				extensionType: 'com.atlassian.ecosystem',
			}),
		).toEqual({
			id: `forge:ari:cloud:ecosystem::app/${FORGE_APP_ID}`,
			kind: 'forge',
			value: `ari:cloud:ecosystem::app/${FORGE_APP_ID}`,
		});
	});

	it('does not prefix a Forge app key that is already an ARI', () => {
		const ari = `ari:cloud:ecosystem::app/${FORGE_APP_ID}`;

		expect(
			getAppVendorLookup({
				app: { key: ari, source: 'ecosystem' },
				extensionType: 'com.atlassian.ecosystem',
			}),
		).toEqual({ id: `forge:${ari}`, kind: 'forge', value: ari });
	});

	it('looks up other ecosystem apps by their Connect app key', () => {
		expect(
			getAppVendorLookup({
				app: { key: 'com.gliffy.integration.confluence', source: 'ecosystem' },
				extensionType: 'com.atlassian.confluence.macro.core',
			}),
		).toEqual({
			id: 'connect:com.gliffy.integration.confluence',
			kind: 'connect',
			value: 'com.gliffy.integration.confluence',
		});
	});

	it.each([
		['internal apps', { key: 'confluence.macros', source: 'internal' as const }],
		['apps without provenance', { key: 'confluence.macros' }],
		['ecosystem apps without a key', { key: '', source: 'ecosystem' as const }],
		['items without an app', undefined],
	])('returns undefined for %s', (_, app) => {
		expect(
			getAppVendorLookup({ app, extensionType: 'com.atlassian.confluence.macro.core' }),
		).toBeUndefined();
	});
});
