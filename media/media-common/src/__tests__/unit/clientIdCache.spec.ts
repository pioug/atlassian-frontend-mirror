import {
	setClientIdForFile,
	getClientIdForFile,
	clearClientIdCache,
	extractClientIdsFromHtml,
} from '../../copyIntent';

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

		it('should return the same clientId on multiple reads (supports multiple pastes)', () => {
			setClientIdForFile('file-123', 'client-abc');
			expect(getClientIdForFile('file-123')).toBe('client-abc');
			// Second call should still return the same value (not consumed)
			expect(getClientIdForFile('file-123')).toBe('client-abc');
			// Third call too
			expect(getClientIdForFile('file-123')).toBe('client-abc');
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

		it('should evict the oldest entry when cache exceeds max size (20)', () => {
			// Fill the cache to the limit
			for (let i = 0; i < 20; i++) {
				setClientIdForFile(`file-${i}`, `client-${i}`);
			}

			// All entries should be present (reads no longer consume entries)
			expect(getClientIdForFile('file-0')).toBe('client-0');
			expect(getClientIdForFile('file-10')).toBe('client-10');

			// Adding one more should evict the oldest (file-0)
			setClientIdForFile('file-overflow', 'client-overflow');

			// file-0 was the oldest entry and should be evicted
			expect(getClientIdForFile('file-0')).toBeUndefined();

			// The new entry should be retrievable
			expect(getClientIdForFile('file-overflow')).toBe('client-overflow');

			// Other entries should still exist
			expect(getClientIdForFile('file-10')).toBe('client-10');
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

	it('should extract clientId from a media node (data-id before data-client-id)', () => {
		const html = `
			<div data-node-type="media" data-id="file-123" data-client-id="client-abc" data-type="file"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBe('client-abc');
	});

	it('should extract clientId from a media node (data-client-id before data-id)', () => {
		const html = `
			<div data-node-type="media" data-client-id="client-abc" data-id="file-123" data-type="file"></div>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-123')).toBe('client-abc');
	});

	it('should extract clientId from a mediaInline node', () => {
		const html = `
			<span data-node-type="mediaInline" data-id="file-456" data-client-id="client-xyz"></span>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-456')).toBe('client-xyz');
	});

	it('should map all file IDs to the single shared clientId (editor-to-editor)', () => {
		// All media nodes in a paste share the same clientId
		const html = `
			<div data-node-type="media" data-id="file-1" data-client-id="client-shared"></div>
			<div data-node-type="media" data-id="file-2" data-client-id="client-shared"></div>
			<span data-node-type="mediaInline" data-id="file-3" data-client-id="client-shared"></span>
		`;

		extractClientIdsFromHtml(html);

		expect(getClientIdForFile('file-1')).toBe('client-shared');
		expect(getClientIdForFile('file-2')).toBe('client-shared');
		expect(getClientIdForFile('file-3')).toBe('client-shared');
	});

	it('should skip HTML without data-client-id or blob URL clientId', () => {
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

	// Renderer-to-editor copy: clientId is embedded in the blob URL on the <img> child,
	// NOT as a data-client-id attribute on the media div.
	describe('renderer-to-editor copy (blob URL format)', () => {
		it('should extract clientId from a blob URL src on an img tag', () => {
			const html = `
				<div data-type="file" data-node-type="media" data-id="7fe369b1-84e7-4365-a60a-3582f284583f" data-collection="contentId-6173521156">
					<img src="blob:https://hello.atlassian.net/a5c59994-744a-483e-bbbc-a96d57025e91#media-blob-url=true&amp;id=7fe369b1-84e7-4365-a60a-3582f284583f&amp;collection=contentId-6173521156&amp;contextId=6173521156&amp;mimeType=image%2Fpng&amp;name=screenshot.png&amp;size=42595&amp;width=741&amp;height=471&amp;clientId=604d2f43-c264-4a11-9ea2-dca8cf131262" alt="">
				</div>
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('7fe369b1-84e7-4365-a60a-3582f284583f')).toBe(
				'604d2f43-c264-4a11-9ea2-dca8cf131262',
			);
		});

		it('should map all file IDs to the single shared clientId (renderer-to-editor)', () => {
			// All media nodes in a paste share the same clientId — extracted from the first blob URL found
			const html = `
				<div data-type="file" data-node-type="media" data-id="file-id-1" data-collection="contentId-123">
					<img src="blob:https://hello.atlassian.net/uuid-1#media-blob-url=true&amp;id=file-id-1&amp;contextId=ctx-1&amp;clientId=client-shared" alt="">
				</div>
				<div data-type="file" data-node-type="media" data-id="file-id-2" data-collection="contentId-123">
					<img src="blob:https://hello.atlassian.net/uuid-2#media-blob-url=true&amp;id=file-id-2&amp;contextId=ctx-1&amp;clientId=client-shared" alt="">
				</div>
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('file-id-1')).toBe('client-shared');
			expect(getClientIdForFile('file-id-2')).toBe('client-shared');
		});

		it('should extract clientId from an SSR HTTPS src with media-blob-url hash', () => {
			const html = `
				<div data-type="file" data-node-type="media" data-id="8b3bdd80-b417-43d4-8c29-bb9719d0ff06" data-collection="contentId-123">
					<img data-fileid="8b3bdd80-b417-43d4-8c29-bb9719d0ff06" data-source="ssr-server"
						src="https://example.com/media-api/file/8b3bdd80-b417-43d4-8c29-bb9719d0ff06/image?client=2fe14cc5-7bfc-4dd0-891b-e469a55d2a34&amp;collection=contentId-123#media-blob-url=true&amp;id=8b3bdd80-b417-43d4-8c29-bb9719d0ff06&amp;clientId=2fe14cc5-7bfc-4dd0-891b-e469a55d2a34&amp;contextId=contentId-123&amp;collection=contentId-123" alt="">
				</div>
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('8b3bdd80-b417-43d4-8c29-bb9719d0ff06')).toBe(
				'2fe14cc5-7bfc-4dd0-891b-e469a55d2a34',
			);
		});

		it('should extract clientId from SSR HTML with multiple media nodes', () => {
			const html = `
				<div data-type="file" data-node-type="media" data-id="file-id-1" data-collection="contentId-123">
					<img data-source="ssr-server" src="https://example.com/media-api/file/file-id-1/image?client=client-shared#media-blob-url=true&amp;id=file-id-1&amp;clientId=client-shared&amp;collection=contentId-123" alt="">
				</div>
				<div data-type="file" data-node-type="media" data-id="file-id-2" data-collection="contentId-123">
					<img data-source="ssr-server" src="https://example.com/media-api/file/file-id-2/image?client=client-shared#media-blob-url=true&amp;id=file-id-2&amp;clientId=client-shared&amp;collection=contentId-123" alt="">
				</div>
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('file-id-1')).toBe('client-shared');
			expect(getClientIdForFile('file-id-2')).toBe('client-shared');
		});

		it('should skip blob URLs that are not media blob URLs', () => {
			const html = `
				<img src="blob:https://example.com/some-other-blob-uuid" alt="">
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('some-other-blob-uuid')).toBeUndefined();
		});

		it('should not extract from a media blob URL that has no clientId param', () => {
			const html = `
				<img src="blob:https://hello.atlassian.net/uuid-1#media-blob-url=true&amp;id=file-id-1&amp;contextId=ctx-1" alt="">
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('file-id-1')).toBeUndefined();
		});

		it('should handle real-world renderer HTML with multiple mediaSingle nodes', () => {
			// Simulates the actual HTML pasted from a Confluence renderer page
			const html = `
				<div data-layout="center" data-width="507" data-width-type="pixel" data-node-type="mediaSingle">
					<div data-type="file" data-node-type="media" data-id="7fe369b1-84e7-4365-a60a-3582f284583f" data-collection="contentId-6173521156" data-file-mime-type="image/png">
						<div>
							<img src="blob:https://hello.atlassian.net/a5c59994-744a-483e-bbbc-a96d57025e91#media-blob-url=true&amp;id=7fe369b1-84e7-4365-a60a-3582f284583f&amp;collection=contentId-6173521156&amp;contextId=6173521156&amp;mimeType=image%2Fpng&amp;clientId=604d2f43-c264-4a11-9ea2-dca8cf131262" alt="">
						</div>
					</div>
				</div>
				<div data-layout="center" data-width="460" data-width-type="pixel" data-node-type="mediaSingle">
					<div data-type="file" data-node-type="media" data-id="fc534dbe-b518-4a76-91a0-c22f7e1a7e4f" data-collection="contentId-6173521156" data-file-mime-type="image/png">
						<div>
							<img src="blob:https://hello.atlassian.net/275c15f3-158b-4ea5-a698-6dc27c3d8dc3#media-blob-url=true&amp;id=fc534dbe-b518-4a76-91a0-c22f7e1a7e4f&amp;collection=contentId-6173521156&amp;contextId=6173521156&amp;mimeType=image%2Fpng&amp;clientId=604d2f43-c264-4a11-9ea2-dca8cf131262" alt="">
						</div>
					</div>
				</div>
			`;

			extractClientIdsFromHtml(html);

			expect(getClientIdForFile('7fe369b1-84e7-4365-a60a-3582f284583f')).toBe(
				'604d2f43-c264-4a11-9ea2-dca8cf131262',
			);
			expect(getClientIdForFile('fc534dbe-b518-4a76-91a0-c22f7e1a7e4f')).toBe(
				'604d2f43-c264-4a11-9ea2-dca8cf131262',
			);
		});
	});
});
