import { createXpcDefaultDestinationRegistry } from '../src/xpcDefaultDestinationRegistry';
import { XpcDestinationResolver } from '../src/xpcDestinationResolver';

const studioSource = {
	product: XpcDestinationResolver.createProductId('studio'),
};

const resolve = (url: string, localhostProduct = false) =>
	XpcDestinationResolver.resolve({
		baseUrl: localhostProduct ? 'http://localhost:3000' : 'https://studio.atlassian.com',
		registry: createXpcDefaultDestinationRegistry({
			...(localhostProduct ? { localhostProduct: studioSource.product } : {}),
		}),
		source: studioSource,
		url,
	});

describe('createXpcDefaultDestinationRegistry', () => {
	it.each([
		['https://acme.atlassian.net/wiki/spaces/TEAM', 'confluence'],
		['https://acme.atlassian.net/browse/TEST-1', 'jira'],
		['https://acme.atlassian.net/helpcenter/hub', 'jira'],
		['https://acme.atlassian.net/servicedesk/customer/portal/1', 'jira'],
		['https://servo-playground.jira-dev.com/wiki/spaces/TEAM', 'confluence'],
		['https://acme.jira-dev.com/browse/TEST-1', 'jira'],
		['https://acme.jira-dev.com/jira/software/projects/TEST', 'jira'],
		['https://servo-playground.jira-dev.com/helpcenter/hub', 'jira'],
		['https://acme.jira-dev.com/servicedesk/customer/portal/1', 'jira'],
		['https://home.atlassian.com', 'home'],
		['https://admin.atlassian.com', 'admin'],
	])('classifies the controlled destination %s', (url, destinationProduct) => {
		expect(resolve(url)).toMatchObject({
			destinationProduct,
			outcome: 'cross',
			taxonomyVersion: 3,
		});
	});

	it.each([
		['https://acme.atlassian.net/helpcenter/hub', 'jira-help-center-route'],
		['https://acme.atlassian.net/servicedesk/customer/portal/1', 'jira-customer-portal-route'],
		['https://servo-playground.jira-dev.com/helpcenter/hub', 'jira-help-center-route-staging'],
	])('classifies the controlled Help Center route %s', (url, matcherId) => {
		expect(resolve(url)).toMatchObject({
			destinationProduct: 'jira',
			destinationSubProduct: 'help-center',
			matcherId,
			outcome: 'cross',
			routeFamily: 'help-center',
			taxonomyVersion: 3,
		});
	});

	it('supports an explicitly controlled localhost product', () => {
		expect(resolve('http://localhost:3000/w/workspace', true)).toMatchObject({
			destinationProduct: 'studio',
			outcome: 'same',
		});
	});

	it('keeps unsupported Atlassian routes unknown and third-party hosts excluded', () => {
		expect(resolve('https://acme.atlassian.net/unsupported')).toMatchObject({
			outcome: 'unknown',
			reason: 'recognizedHostUnknownRoute',
		});
		expect(resolve('https://acme.jira-dev.com/unsupported')).toMatchObject({
			outcome: 'unknown',
			reason: 'recognizedHostUnknownRoute',
		});
		expect(resolve('https://example.com/customer/path')).toMatchObject({
			outcome: 'excluded',
			reason: 'thirdParty',
		});
	});

	it.each([
		'https://acme.atlassian.net/helpcentering/hub',
		'https://acme.atlassian.net/servicedesk/customers/portal/1',
		'https://acme.jira-dev.com/helpcentering/hub',
		'https://acme.jira-dev.com/servicedesk/customers/portal/1',
	])('keeps the near-miss Help Center route %s unknown', (url) => {
		expect(resolve(url)).toEqual({
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'none',
			outcome: 'unknown',
			reason: 'recognizedHostUnknownRoute',
			taxonomyVersion: 3,
		});
	});

	it('excludes a host spoofing an Atlassian domain', () => {
		expect(resolve('https://acme.atlassian.net.evil.example/helpcenter/hub')).toEqual({
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'none',
			outcome: 'excluded',
			reason: 'thirdParty',
			taxonomyVersion: 3,
		});
	});
});
