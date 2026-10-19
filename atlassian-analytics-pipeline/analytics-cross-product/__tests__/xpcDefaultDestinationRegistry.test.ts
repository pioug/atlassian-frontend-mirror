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
		['https://home.atlassian.com', 'home'],
		['https://admin.atlassian.com', 'admin'],
	])('classifies the controlled destination %s', (url, destinationProduct) => {
		expect(resolve(url)).toMatchObject({
			destinationProduct,
			outcome: 'cross',
			taxonomyVersion: 1,
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
		expect(resolve('https://example.com/customer/path')).toMatchObject({
			outcome: 'excluded',
			reason: 'thirdParty',
		});
	});
});
