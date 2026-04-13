import { fg } from '@atlaskit/platform-feature-flags';

import { DEFAULT_CONFIG } from '../constants';
import { logException } from '../sentry/main';

import { BaseGraphQlClient } from './index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

jest.mock('./utils', () => ({
	handleGraphQLRequest: jest.fn().mockResolvedValue({ data: {} }),
}));

const VALID_CLOUD_ID = 'a436116f-02ce-4520-8fbb-7301462a1674';
const VALID_ARI = `ari:cloud:platform::site/${VALID_CLOUD_ID}`;

describe('BaseGraphQlClient.createQueryContextHeaders', () => {
	let client: BaseGraphQlClient;

	describe('flag off (legacy behaviour)', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			(fg as jest.Mock).mockReturnValue(false);
			client = new BaseGraphQlClient(DEFAULT_CONFIG.stargateRoot, { logException });
		});

		it('sends invalid ARI when cloudId defaults to "None" sentinel (legacy bug)', async () => {
			const { handleGraphQLRequest } = await import('./utils');
			await client.makeGraphQLRequest({ query: '{ test }' });
			expect(handleGraphQLRequest).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Object),
				expect.objectContaining({
					headers: { 'X-Query-Context': 'ari:cloud:platform::site/None' },
				}),
			);
		});

		it('sends invalid ARI when cloudId is empty string due to "None" fallback (legacy bug)', async () => {
			client.setContext({ cloudId: '' });
			const { handleGraphQLRequest } = await import('./utils');
			await client.makeGraphQLRequest({ query: '{ test }' });
			expect(handleGraphQLRequest).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Object),
				expect.objectContaining({
					headers: { 'X-Query-Context': 'ari:cloud:platform::site/None' },
				}),
			);
		});

		it('builds ARI without validation when cloudId is set', async () => {
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
	});

	describe('flag on (fixed behaviour)', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			(fg as jest.Mock).mockReturnValue(true);
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
});
