/**
 * @jest-environment node
 */

import { resolveProvidedUrlByBoundary } from './index';

describe('resolveProvidedUrlByBoundary (SSR)', () => {
	beforeEach(() => {
		(globalThis as any).ssrContext = { isInFedramp: false, isInIC: false };
	});

	afterEach(() => {
		delete (globalThis as any).ssrContext;
	});

	describe('Isolated Cloud boundary', () => {
		beforeEach(() => {
			(globalThis as any).ssrContext.isInIC = true;
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
			(globalThis as any).ssrContext.isInFedramp = true;
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

	describe('Commercial boundary', () => {
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

		it('returns null when default is explicitly null and no specific key matches', () => {
			expect(
				resolveProvidedUrlByBoundary({
					'isolated-cloud': new URL('https://ic.example.com'),
					default: null,
				}),
			).toBeNull();
		});
	});
});
