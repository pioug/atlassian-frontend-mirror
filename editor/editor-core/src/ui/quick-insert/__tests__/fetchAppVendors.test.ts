import { AppVendorRequestError } from '../app-vendor/AppVendorRequestError';
import { fetchAppVendors } from '../app-vendor/fetchAppVendors';
import type { AppVendorLookup } from '../app-vendor/getAppVendorLookup';

const forgeLookup: AppVendorLookup = {
	id: 'forge:ari:cloud:ecosystem::app/forge-app',
	kind: 'forge',
	value: 'ari:cloud:ecosystem::app/forge-app',
};
const connectLookup: AppVendorLookup = {
	id: 'connect:connect-app',
	kind: 'connect',
	value: 'connect-app',
};

const originalFetch = global.fetch;
const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

const mockFetchResponse = (response: Partial<Response>) =>
	fetchMock.mockResolvedValue({ ok: true, status: 200, ...response } as Response);

describe('fetchAppVendors', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	it('requests every lookup as an aliased Marketplace field in one request', async () => {
		const fetchSpy = mockFetchResponse({ json: () => Promise.resolve({ data: {} }) });

		await fetchAppVendors([forgeLookup, connectLookup]);

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const [path, init] = fetchSpy.mock.calls[0];
		const body = JSON.parse(String(init?.body));
		expect(path).toBe('/gateway/api/graphql');
		expect(body.query).toBe(
			'query QuickInsertAppVendorsQuery($a0: ID!, $a1: String!) { ' +
				'a0: marketplaceAppByCloudAppId(cloudAppId: $a0) { partner { name } } ' +
				'a1: marketplaceAppByKey(appKey: $a1) { partner { name } } }',
		);
		expect(body.variables).toEqual({ a0: forgeLookup.value, a1: connectLookup.value });
	});

	it('maps aliases to partner names and unlisted apps to null', async () => {
		mockFetchResponse({
			json: () => Promise.resolve({ data: { a0: { partner: { name: 'Gliffy' } }, a1: null } }),
		});

		await expect(fetchAppVendors([forgeLookup, connectLookup])).resolves.toEqual(
			new Map([
				[forgeLookup.id, 'Gliffy'],
				[connectLookup.id, null],
			]),
		);
	});

	it('omits lookups whose aliased field errored so they can be retried', async () => {
		mockFetchResponse({
			json: () =>
				Promise.resolve({
					data: { a0: { partner: { name: 'Gliffy' } }, a1: null },
					errors: [{ message: 'Timeout', path: ['a1'] }],
				}),
		});

		await expect(fetchAppVendors([forgeLookup, connectLookup])).resolves.toEqual(
			new Map([[forgeLookup.id, 'Gliffy']]),
		);
	});

	it.each([401, 403, 429])('rejects with a blocking error for HTTP %s', async (status) => {
		mockFetchResponse({ ok: false, status });

		const error = await fetchAppVendors([forgeLookup]).catch((caught) => caught);

		expect(error).toBeInstanceOf(AppVendorRequestError);
		expect(error.isBlocking).toBe(true);
	});

	it('rejects with a retryable error for server failures', async () => {
		mockFetchResponse({ ok: false, status: 503 });

		const error = await fetchAppVendors([forgeLookup]).catch((caught) => caught);

		expect(error).toBeInstanceOf(AppVendorRequestError);
		expect(error.isBlocking).toBe(false);
	});

	it('rejects with a retryable error when the response has no data', async () => {
		mockFetchResponse({ json: () => Promise.resolve({ errors: [{ message: 'Timeout' }] }) });

		const error = await fetchAppVendors([forgeLookup]).catch((caught) => caught);

		expect(error).toBeInstanceOf(AppVendorRequestError);
		expect(error.isBlocking).toBe(false);
	});

	describe('timeout', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('aborts a request that does not settle within 10 seconds', async () => {
			// Mirror fetch: reject with an AbortError once the request's signal is aborted.
			fetchMock.mockImplementation(
				(_, init) =>
					new Promise((_resolve, reject) => {
						if (init?.signal) {
							init.signal.onabort = () => reject(new DOMException('Aborted', 'AbortError'));
						}
					}),
			);

			const request = fetchAppVendors([forgeLookup]).catch((caught) => caught);
			jest.advanceTimersByTime(10_000);
			const error = await request;

			expect(error).toEqual(expect.objectContaining({ name: 'AbortError' }));
			expect(error).not.toBeInstanceOf(AppVendorRequestError);
		});

		it('clears the timeout once the request settles', async () => {
			mockFetchResponse({ json: () => Promise.resolve({ data: {} }) });

			await fetchAppVendors([forgeLookup]);

			expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false);
			expect(jest.getTimerCount()).toBe(0);
		});
	});
});
