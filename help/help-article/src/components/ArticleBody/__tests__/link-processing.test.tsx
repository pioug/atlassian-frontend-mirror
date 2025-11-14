/**
 * @jest-environment jsdom
 */
import { processLinksForNewTab } from '../index';

describe('processLinksForNewTab', () => {
	it('should add target="_blank" to links without target attribute', () => {
		const input = '<p>Check out <a href="https://example.com">this link</a> for more info.</p>';
		const result = processLinksForNewTab(input);

		expect(result).toContain('target="_blank"');
		expect(result).toContain('rel="noopener noreferrer"');
	});

	it('should not modify links that already have target="_blank"', () => {
		const input =
			'<p>Visit <a href="https://example.com" target="_blank" rel="nofollow">this site</a>.</p>';
		const result = processLinksForNewTab(input);

		expect(result).toContain('target="_blank"');
		expect(result).toContain('rel="nofollow noopener noreferrer"');
	});

	it('should override other target values', () => {
		const input = '<p>See <a href="https://example.com" target="_self">this page</a>.</p>';
		const result = processLinksForNewTab(input);

		expect(result).toContain('target="_blank"');
		expect(result).not.toContain('target="_self"');
	});

	it('should handle multiple links in the same content', () => {
		const input = `
			<div>
				<a href="https://link1.com">Link 1</a>
				<a href="https://link2.com" target="_blank">Link 2</a>
				<a href="https://link3.com" target="_self">Link 3</a>
			</div>
		`;
		const result = processLinksForNewTab(input);

		// Count occurrences of target="_blank"
		const matches = result.match(/target="_blank"/g);
		expect(matches).toHaveLength(3);
	});

	it('should not affect links without href attribute', () => {
		const input = '<p>This is <a name="anchor">an anchor</a> not a link.</p>';
		const result = processLinksForNewTab(input);

		expect(result).not.toContain('target="_blank"');
		expect(result).toBe(input); // Should remain unchanged
	});

	it('should preserve existing rel attributes while adding security attributes', () => {
		const input = '<a href="https://example.com" rel="bookmark">Link</a>';
		const result = processLinksForNewTab(input);
		expect(result).toContain('target="_blank"');
		expect(result).toContain('rel="bookmark noopener noreferrer"');
	});
});
