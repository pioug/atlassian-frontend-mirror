import { type XpcDestinationRegistry, XpcDestinationResolver } from '../src/xpcDestinationResolver';

const studio = XpcDestinationResolver.createProductId('studio');
const confluence = XpcDestinationResolver.createProductId('confluence');
const jira = XpcDestinationResolver.createProductId('jira');

const registry: XpcDestinationRegistry = {
	taxonomyVersion: 1,
	atlassianHostSuffixes: ['atlassian.net'],
	allowedHttpHosts: ['localhost'],
	rules: [
		{
			id: XpcDestinationResolver.createMatcherId('confluence-content'),
			product: confluence,
			routeFamily: XpcDestinationResolver.createRouteFamily('content-page'),
			host: 'atlassian.net',
			hostMatch: 'suffix',
			pathPrefix: '/wiki',
			precedence: 20,
		},
		{
			id: XpcDestinationResolver.createMatcherId('jira-issue'),
			product: jira,
			routeFamily: XpcDestinationResolver.createRouteFamily('issue-view'),
			host: 'atlassian.net',
			hostMatch: 'suffix',
			pathPrefix: '/browse',
			precedence: 20,
		},
		{
			id: XpcDestinationResolver.createMatcherId('studio-local'),
			product: studio,
			host: 'localhost',
			precedence: 10,
		},
	],
};

describe('resolveXpcDestination', () => {
	it('classifies a known different product as cross-product', () => {
		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'https://studio.atlassian.com',
				registry,
				source: { product: studio },
				url: 'https://acme.atlassian.net/wiki/spaces/ENG/pages/123?secret=value#comments',
			}),
		).toEqual({
			outcome: 'cross',
			destinationProduct: confluence,
			routeFamily: XpcDestinationResolver.createRouteFamily('content-page'),
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'exact',
			reason: 'differentKnownProduct',
			matcherId: XpcDestinationResolver.createMatcherId('confluence-content'),
			taxonomyVersion: 1,
		});
	});

	it('classifies the known source product as same-product', () => {
		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'http://localhost:3000',
				registry,
				source: { product: studio },
				url: '/agents/123',
			}),
		).toMatchObject({
			outcome: 'same',
			destinationProduct: studio,
			reason: 'sameKnownProduct',
		});
	});

	it('keeps an unregistered Atlassian route unknown', () => {
		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'https://studio.atlassian.com',
				registry,
				source: { product: studio },
				url: 'https://acme.atlassian.net/people/agent/123',
			}),
		).toEqual({
			outcome: 'unknown',
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'none',
			reason: 'recognizedHostUnknownRoute',
			taxonomyVersion: 1,
		});
	});

	it('excludes third-party and unsupported destinations', () => {
		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'https://studio.atlassian.com',
				registry,
				source: { product: studio },
				url: 'https://evil-atlassian.net.example.com/wiki/example',
			}),
		).toMatchObject({ outcome: 'excluded', reason: 'thirdParty' });
		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'https://studio.atlassian.com',
				registry,
				source: { product: studio },
				url: 'javascript:alert(1)',
			}),
		).toMatchObject({ outcome: 'excluded', reason: 'unsupportedScheme' });
	});

	it('returns unknown when equally strong rules disagree', () => {
		const conflictingRegistry: XpcDestinationRegistry = {
			...registry,
			rules: [
				...registry.rules,
				{
					id: XpcDestinationResolver.createMatcherId('conflicting-route'),
					product: jira,
					host: 'atlassian.net',
					hostMatch: 'suffix',
					pathPrefix: '/wiki',
					precedence: 20,
				},
			],
		};

		expect(
			XpcDestinationResolver.resolve({
				baseUrl: 'https://studio.atlassian.com',
				registry: conflictingRegistry,
				source: { product: studio },
				url: 'https://acme.atlassian.net/wiki/example',
			}),
		).toMatchObject({ outcome: 'unknown', reason: 'ambiguousSharedHost' });
	});

	it('rejects unbounded controlled values', () => {
		expect(() => XpcDestinationResolver.createProductId('Studio / Agents')).toThrow(
			'Invalid controlled XPC product value',
		);
	});
});
