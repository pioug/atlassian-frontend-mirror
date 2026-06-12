import { resolveProvidedUrlByBoundary } from './index';

describe('resolveProvidedUrlByBoundary (browser)', () => {
	afterEach(() => {
		globalThis.document.cookie = 'Atl-Ctx-Perimeter=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		globalThis.document.cookie =
			'Atl-Ctx-Isolation-Context-Domain=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		globalThis.document.cookie =
			'Atl-Ctx-Isolation-Context-Id=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	});

	describe('Isolated Cloud boundary', () => {
		beforeEach(() => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=commercial';
			globalThis.document.cookie =
				'Atl-Ctx-Isolation-Context-Domain=simcity.atlassian-isolated.net';
		});

		it('returns the isolated-cloud URL when key is provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': new URL('https://ic.example.com'),
					'fedramp-moderate': new URL('https://fr.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://ic.example.com'));
		});

		it('returns null when isolated-cloud key is explicitly null', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': null,
					default: new URL('https://example.com'),
				}),
			).toBeNull();
		});

		it('returns default when isolated-cloud key is not provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'fedramp-moderate': new URL('https://fr.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://example.com'));
		});
	});

	describe('FedRAMP Moderate boundary', () => {
		beforeEach(() => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=fedramp-moderate';
		});

		it('returns the fedramp-moderate URL when key is provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': new URL('https://ic.example.com'),
					'fedramp-moderate': new URL('https://fr.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://fr.example.com'));
		});

		it('returns default when fedramp-moderate key is not provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': new URL('https://ic.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://example.com'));
		});
	});

	describe('Commercial boundary (no cookies set)', () => {
		it('returns the commercial URL when key is provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					commercial: new URL('https://commercial.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://commercial.example.com'));
		});

		it('returns default when commercial key is not provided', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': new URL('https://ic.example.com'),
					default: new URL('https://example.com'),
				}),
			).toEqual(new URL('https://example.com'));
		});
	});
});
