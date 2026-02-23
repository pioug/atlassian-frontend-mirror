import { ffTest } from '@atlassian/feature-flags-test-utils';

import { buildAtlAttributionHeaderValue } from '../../../util/atl-attribution';

describe('buildAtlAttributionHeaderValue', () => {
	const cloudId = 'test-cloud-id-abc-123';

	ffTest.on('mentions_custom_headers', 'flag is on', () => {
		it('should return atl-attribution header with tenantId and product', () => {
			const result = buildAtlAttributionHeaderValue({ cloudId, productId: 'confluence' });
			expect(result).toBeDefined();
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed).toEqual({
				tenantId: cloudId,
				product: 'confluence',
			});
		});

		it('should default product to platform when productId is not supplied', () => {
			const result = buildAtlAttributionHeaderValue({ cloudId });
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed.product).toBe('platform');
			expect(parsed.tenantId).toBe(cloudId);
		});

		it('should not include atlWorkspaceId when activationId is not supplied', () => {
			const result = buildAtlAttributionHeaderValue({ cloudId, productId: 'jira' });
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed.atlWorkspaceId).toBeUndefined();
		});

		it('should include atlWorkspaceId when activationId is supplied', () => {
			const activationId = 'activation-456';
			const result = buildAtlAttributionHeaderValue({
				cloudId,
				productId: 'jira',
				activationId,
			});
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed.atlWorkspaceId).toBe(
				`ari:cloud:jira:${cloudId}:workspace/${activationId}`,
			);
		});

		it('should use default product in atlWorkspaceId when productId is not supplied', () => {
			const activationId = 'activation-789';
			const result = buildAtlAttributionHeaderValue({ cloudId, activationId });
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed.atlWorkspaceId).toBe(
				`ari:cloud:platform:${cloudId}:workspace/${activationId}`,
			);
			expect(parsed.product).toBe('platform');
		});

		it('should return the full expected header with all fields', () => {
			const activationId = 'act-full';
			const result = buildAtlAttributionHeaderValue({
				cloudId,
				productId: 'confluence',
				activationId,
			});
			const parsed = JSON.parse(result!['atl-attribution']);
			expect(parsed).toEqual({
				tenantId: cloudId,
				product: 'confluence',
				atlWorkspaceId: `ari:cloud:confluence:${cloudId}:workspace/${activationId}`,
			});
		});
	});

	ffTest.off('mentions_custom_headers', 'flag is off', () => {
		it('should return undefined', () => {
			const result = buildAtlAttributionHeaderValue({ cloudId, productId: 'confluence' });
			expect(result).toBeUndefined();
		});
	});
});
