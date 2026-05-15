import { DEFAULT_CONFIG } from '../constants';
import { logException } from '../sentry/main';

import { BaseGraphQlClient } from './index';

jest.mock('./utils', () => ({
	handleGraphQLRequest: jest.fn().mockResolvedValue({ data: {} }),
}));

const VALID_CLOUD_ID = 'a436116f-02ce-4520-8fbb-7301462a1674';
const VALID_ARI = `ari:cloud:platform::site/${VALID_CLOUD_ID}`;

describe('BaseGraphQlClient.createQueryContextHeaders', () => {
	let client: BaseGraphQlClient;

	beforeEach(() => {
		jest.clearAllMocks();
		client = new BaseGraphQlClient(DEFAULT_CONFIG.stargateRoot, { logException });
	});

	it('returns no header when cloudId is not set', async () => {
		const { handleGraphQLRequest } = await import('./utils');
		await client.makeGraphQLRequest({ query: '{ test }' });
		expect(handleGraphQLRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Object),
			expect.objectContaining({ headers: {} }),
		);
	});

	it('returns no header when cloudId is empty string', async () => {
		client.setContext({ cloudId: '' });
		const { handleGraphQLRequest } = await import('./utils');
		await client.makeGraphQLRequest({ query: '{ test }' });
		expect(handleGraphQLRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Object),
			expect.objectContaining({ headers: {} }),
		);
	});

	it('builds valid ARI header for a valid cloudId', async () => {
		client.setContext({ cloudId: VALID_CLOUD_ID });
		const { handleGraphQLRequest } = await import('./utils');
		await client.makeGraphQLRequest({ query: '{ test }' });
		expect(handleGraphQLRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Object),
			expect.objectContaining({
				headers: { 'X-Query-Context': VALID_ARI },
			}),
		);
	});

	it('returns no header when cloudId is invalid', async () => {
		client.setContext({ cloudId: 'invalid id with spaces!' });
		const { handleGraphQLRequest } = await import('./utils');
		await client.makeGraphQLRequest({ query: '{ test }' });
		expect(handleGraphQLRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(Object),
			expect.objectContaining({ headers: {} }),
		);
	});
});
