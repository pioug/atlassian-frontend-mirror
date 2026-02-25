import { createAtlAttributionHeader } from '../../../service/atl-attribution';
import type { AtlAttributionHeaderData } from '../../../service/atl-attribution';

describe('createAtlAttributionHeader - atl-attribution header', () => {
	it('should create header with required service field and default product', () => {
		const result = createAtlAttributionHeader();

		expect(result).toHaveProperty('atl-attribution');
		expect(Object.keys(result)).toHaveLength(1);
		expect(Object.keys(result)[0]).toBe('atl-attribution');

		const header = JSON.parse(result['atl-attribution']) as AtlAttributionHeaderData;
		expect(header.service).toBe('smart-experiences/smart-user-picker');
		expect(header.product).toBe('platform');
	});

	it('should return valid JSON string for atl-attribution header', () => {
		const result = createAtlAttributionHeader();
		expect(() => JSON.parse(result['atl-attribution'])).not.toThrow();
	});

	it('should not include undefined optional fields in the header', () => {
		const result = createAtlAttributionHeader({ tenantId: 'test-tenant' });
		const header = JSON.parse(result['atl-attribution']) as Record<string, unknown>;

		expect(Object.keys(header)).toContain('tenantId');
		expect(Object.keys(header)).not.toContain('atlWorkspaceId');
	});

	it('should preserve all provided values together', () => {
		const data: Partial<AtlAttributionHeaderData> = {
			product: 'attribution-test',
			tenantId: 'tenant-xyz',
			activationId: 'workspace-xyz',
		};
		const result = createAtlAttributionHeader(data);
		const header = JSON.parse(result['atl-attribution']) as AtlAttributionHeaderData;

		expect(header).toEqual({
			service: 'smart-experiences/smart-user-picker',
			product: 'attribution-test',
			tenantId: 'tenant-xyz',
			atlWorkspaceId: 'ari:cloud:attribution-test:tenant-xyz:workspace/workspace-xyz',
		});
	});

	it('should handle no parameters', () => {
		const result = createAtlAttributionHeader();
		const header = JSON.parse(result['atl-attribution']) as AtlAttributionHeaderData;

		expect(header.service).toBe('smart-experiences/smart-user-picker');
		expect(header.product).toBe('platform');
	});
});
