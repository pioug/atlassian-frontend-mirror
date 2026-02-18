import { setClientIdForFile, getClientIdForFile, clearClientIdCache, extractClientIdsFromHtml } from '../../copyIntent';

describe('clientIdCache', () => {
	beforeEach(() => {
		clearClientIdCache();
	});

	describe('setClientIdForFile and getClientIdForFile', () => {
		it('should store and retrieve clientId for a file', () => {
			setClientIdForFile('file-123', 'client-abc');
			expect(getClientIdForFile('file-123')).toBe('client-abc');
		});

		it('should return undefined for unknown file', () => {
			expect(getClientIdForFile('unknown-file')).toBeUndefined();
		});

		it('should consume the entry after retrieval (one-time use)', () => {
			setClientIdForFile('file-123', 'client-abc');
			expect(getClientIdForFile('file-123')).toBe('client-abc');
			// Second call should return undefined
			expect(getClientIdForFile('file-123')).toBeUndefined();
		});

		it('should handle multiple files', () => {
			setClientIdForFile('file-1', 'client-1');
			setClientIdForFile('file-2', 'client-2');
			setClientIdForFile('file-3', 'client-3');

			expect(getClientIdForFile('file-2')).toBe('client-2');
			expect(getClientIdForFile('file-1')).toBe('client-1');
			expect(getClientIdForFile('file-3')).toBe('client-3');
		});

		it('should allow overwriting existing entry', () => {
			setClientIdForFile('file-123', 'client-old');
			setClientIdForFile('file-123', 'client-new');
			expect(getClientIdForFile('file-123')).toBe('client-new');
		});

		it('should evict the oldest entry when cache exceeds max size (100)', () => {
			// Fill the cache to the limit
			for (let i = 0; i < 100; i++) {
				setClientIdForFile(`file-${i}`, `client-${i}`);
			}

			// The first entry should still be present
			expect(getClientIdForFile('file-0')).toBe('client-0');

			// Re-add file-0 so the cache is full again (file-0 was consumed above)
			setClientIdForFile('file-0', 'client-0');

			// Adding one more should evict the oldest (file-1, since file-0 was re-added)
			setClientIdForFile('file-overflow', 'client-overflow');

			// file-1 was the oldest remaining entry and should be evicted
			expect(getClientIdForFile('file-1')).toBeUndefined();

			// The new entry should be retrievable
			expect(getClientIdForFile('file-overflow')).toBe('client-overflow');

			// Other entries should still exist
			expect(getClientIdForFile('file-50')).toBe('client-50');
		});
	});

	describe('clearClientIdCache', () => {
		it('should clear all cached entries', () => {
			setClientIdForFile('file-1', 'client-1');
			setClientIdForFile('file-2', 'client-2');

			clearClientIdCache();

			expect(getClientIdForFile('file-1')).toBeUndefined();
			expect(getClientIdForFile('file-2')).toBeUndefined();
		});
	});

});

describe('extractClientIdsFromHtml', () => {
	beforeEach(() => {
		clearClientIdCache();
	});

	it('should extract clientId from media nodes (data-id before data-client-id)', () => {
		const html = `
			<div data-node-type="media" data-id="file-123" data-client-id="client-abc" data-type="file"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBe('client-abc');
	});

	it('should extract clientId from media nodes (data-client-id before data-id)', () => {
		const html = `
			<div data-node-type="media" data-client-id="client-abc" data-id="file-123" data-type="file"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBe('client-abc');
	});

	it('should extract clientId from mediaInline nodes', () => {
		const html = `
			<span data-node-type="mediaInline" data-id="file-456" data-client-id="client-xyz"></span>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-456')).toBe('client-xyz');
	});

	it('should extract multiple clientIds from HTML', () => {
		const html = `
			<div data-node-type="media" data-id="file-1" data-client-id="client-1"></div>
			<div data-node-type="media" data-id="file-2" data-client-id="client-2"></div>
			<span data-node-type="mediaInline" data-id="file-3" data-client-id="client-3"></span>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-1')).toBe('client-1');
		expect(getClientIdForFile('file-2')).toBe('client-2');
		expect(getClientIdForFile('file-3')).toBe('client-3');
	});

	it('should not extract from non-media nodes', () => {
		const html = `
			<div data-node-type="paragraph" data-id="file-123" data-client-id="client-abc"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBeUndefined();
	});

	it('should skip HTML without data-client-id', () => {
		const html = `
			<div data-node-type="media" data-id="file-123"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBeUndefined();
	});

	it('should handle empty or undefined HTML', () => {
		expect(() => extractClientIdsFromHtml('')).not.toThrow();
		expect(() => extractClientIdsFromHtml(undefined as any)).not.toThrow();
	});

	it('should handle real-world HTML from editor copy', () => {
		const html = `
			<meta charset="utf-8">
			<div data-pm-slice="1 1 []">
				<div data-node-type="mediaSingle" data-layout="center">
					<div data-node-type="media" data-id="abc-123-def" data-type="file"
						data-collection="MediaServicesSample" data-width="100" data-height="100"
						data-client-id="12345678-90ab-cdef-1234-567890abcdef">
					</div>
				</div>
			</div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('abc-123-def')).toBe('12345678-90ab-cdef-1234-567890abcdef');
	});
});

