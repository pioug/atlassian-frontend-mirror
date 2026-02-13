import fetchMock from 'fetch-mock/cjs/client';
import { meros } from 'meros/browser';
import type { ServiceConfig } from '../types';
import { requestServiceMultipart } from '../multipartServiceUtils';

// Defined locally because the meros package's `exports` field doesn't expose Part
type Part<Body, Fallback> =
	| { json: false; headers: Record<string, string>; body: Fallback }
	| { json: true; headers: Record<string, string>; body: Body };

jest.mock('meros/browser', () => ({
	meros: jest.fn(),
}));

const url = 'http://cheese';

const mockAuthorNames = ['Alice', 'Bob', 'Charlie'];
type MockContent = { author: string };
const makeMockMerosMultipartResult = (): AsyncGenerator<Part<MockContent, string>> => {
	async function* generator(): AsyncGenerator<Part<MockContent, string>> {
		const parts: Part<MockContent, string>[] = [
			{
				json: true,
				body: { author: mockAuthorNames[0] },
				headers: { 'content-type': 'application/json' },
			},
			{
				json: true,
				body: { author: mockAuthorNames[1] },
				headers: { 'content-type': 'application/json' },
			},
			{
				json: true,
				body: { author: mockAuthorNames[2] },
				headers: { 'content-type': 'application/json' },
			},
		];
		for (const part of parts) {
			yield part;
		}
	}
	return generator();
};

const makeMockMerosResponse = (
	responseJsonBody?: Record<any, any>,
	status: number = 200,
): Response => {
	const mockHeaders = new Headers();
	mockHeaders.append('Content-Type', 'application/json');
	// @ts-ignore
	return {
		headers: mockHeaders,
		ok: true,
		redirected: false,
		status,
		statusText: '',
		type: 'default',
		url: '',
		body: null,
		bodyUsed: false,
		async json() {
			return responseJsonBody;
		},
	};
};

describe('requestServiceMultipart', () => {
	afterEach(() => {
		fetchMock.restore();
		(meros as jest.Mock).mockReset();
	});

	it("returns the response body when Meros doesn't return parts", async () => {
		// given
		const mockResponse = makeMockMerosResponse({ totalBooks: 2, totalCost: 10 });
		fetchMock.mock({
			matcher: `begin:${url}`,
			response: {
				status: 200,
			},
		});
		(meros as jest.Mock).mockResolvedValue(mockResponse);
		const serviceConfig: ServiceConfig = {
			url,
		};

		// when
		type MockBody = { totalBooks?: number; totalCost?: number };
		const result = await requestServiceMultipart<unknown, MockBody>(serviceConfig); // unknown to make sure that multipart branch is not used in assertions

		// then
		if (result.isMultipart) {
			throw new Error('Did not expect a multipart result here');
		}
		expect(result.isMultipart).toBe(false);
		expect(result.body.totalBooks).toBe(2);
		expect(result.body.totalCost).toBe(10);
	});

	it('rejects when there is no response body', async () => {
		// given
		fetchMock.mock({
			matcher: `begin:${url}`,
			response: {
				status: 204,
			},
		});
		const serviceConfig: ServiceConfig = {
			url,
		};

		// when
		const resultPromise = requestServiceMultipart<unknown, unknown>(serviceConfig); // unknown to make sure that response types are not used in assertions

		// then
		try {
			await resultPromise;
			throw new Error('Expected requestServiceMultipart promise to reject');
		} catch (e) {
			expect(e).toBeDefined();
			expect((e as any).code).toBe(204);
		}
	});

	it('returns multipart response when meros parses a multipart response', async () => {
		// given
		fetchMock.mock({
			matcher: `begin:${url}`,
			response: {
				status: 200,
			},
		});
		const mockMerosResult = makeMockMerosMultipartResult();
		(meros as jest.Mock).mockResolvedValue(mockMerosResult);
		const serviceConfig: ServiceConfig = {
			url,
		};

		// when
		const result = await requestServiceMultipart<{ author?: string }, unknown>(serviceConfig); // unknown to make sure that single-part response branch is not used in assertions

		// then
		if (!result.isMultipart) {
			throw new Error('Expected a multipart result here');
		}
		expect(result.isMultipart).toBe(true);
		let authorNameIndex = 0;
		for await (const part of result.parts) {
			expect(part.headers).toEqual({ 'content-type': 'application/json' });
			expect(part.json).toBe(true);
			expect(part.body).toEqual({ author: mockAuthorNames[authorNameIndex] });
			authorNameIndex += 1;
		}
	});

	it('rejects when fetch is 4xx', async () => {
		// given
		fetchMock.mock({
			matcher: `begin:${url}`,
			response: {
				status: 400,
			},
		});
		const mockMerosResult = makeMockMerosMultipartResult();
		(meros as jest.Mock).mockResolvedValue(mockMerosResult);
		const serviceConfig: ServiceConfig = {
			url,
		};

		// when
		const resultPromise = requestServiceMultipart<unknown, unknown>(serviceConfig); // unknown to make sure that response types are not used in assertions

		// then
		try {
			await resultPromise;
			throw new Error('Expected promise to throw');
		} catch (e) {
			expect(e).toBeDefined();
			expect((e as any).code).toBe(400);
		}
	});
});
