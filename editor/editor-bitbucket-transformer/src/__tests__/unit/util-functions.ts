import { escapeHtmlAttribute, unescapeHtmlAttribute, parseMarkdownFormatting } from '../../util';

describe('Utility Functions Tests', () => {
	describe('escapeHtmlAttribute', () => {
		it('should escape all dangerous HTML characters', () => {
			const input = `Text with & < > " ' characters`;
			const expected = `Text with &amp; &lt; &gt; &quot; &#39; characters`;
			expect(escapeHtmlAttribute(input)).toBe(expected);
		});

		it('should handle empty strings', () => {
			expect(escapeHtmlAttribute('')).toBe('');
		});

		it('should handle strings with no special characters', () => {
			const input = 'Plain text content';
			expect(escapeHtmlAttribute(input)).toBe(input);
		});

		it('should handle strings with only special characters', () => {
			expect(escapeHtmlAttribute(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
		});

		it('should handle complex real-world caption text', () => {
			const input = `Caption with 'quotes' & <script>alert("xss")</script>`;
			const expected = `Caption with &#39;quotes&#39; &amp; &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;`;
			expect(escapeHtmlAttribute(input)).toBe(expected);
		});

		it('should handle already escaped entities (double-escaping test)', () => {
			const input = `Text with &amp; already escaped`;
			const expected = `Text with &amp;amp; already escaped`;
			expect(escapeHtmlAttribute(input)).toBe(expected);
		});
	});

	describe('unescapeHtmlAttribute', () => {
		it('should unescape all HTML entities', () => {
			const input = `Text with &amp; &lt; &gt; &quot; &#39; characters`;
			const expected = `Text with & < > " ' characters`;
			expect(unescapeHtmlAttribute(input)).toBe(expected);
		});

		it('should handle empty strings', () => {
			expect(unescapeHtmlAttribute('')).toBe('');
		});

		it('should handle strings with no entities', () => {
			const input = 'Plain text content';
			expect(unescapeHtmlAttribute(input)).toBe(input);
		});

		it('should handle complex real-world escaped text', () => {
			const input = `Caption with &#39;quotes&#39; &amp; &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;`;
			const expected = `Caption with 'quotes' & <script>alert("xss")</script>`;
			expect(unescapeHtmlAttribute(input)).toBe(expected);
		});

		it('should handle order-dependent unescaping correctly', () => {
			// Test that &amp; is unescaped last to avoid double-unescaping
			const input = `&amp;lt;test&amp;gt;`;
			const expected = `&lt;test&gt;`; // Should become &lt;test&gt; not <test>
			expect(unescapeHtmlAttribute(input)).toBe(expected);
		});

		it('should be inverse of escapeHtmlAttribute', () => {
			const original = `Text with & < > " ' mixed characters`;
			const escaped = escapeHtmlAttribute(original);
			const unescaped = unescapeHtmlAttribute(escaped);
			expect(unescaped).toBe(original);
		});
	});

	describe('parseMarkdownFormatting', () => {
		it('should parse bold markdown correctly', () => {
			expect(parseMarkdownFormatting('Text with **bold** content')).toBe(
				'Text with <strong>bold</strong> content',
			);
		});

		it('should parse italic markdown correctly', () => {
			expect(parseMarkdownFormatting('Text with _italic_ content')).toBe(
				'Text with <em>italic</em> content',
			);
		});

		it('should parse strikethrough markdown correctly', () => {
			expect(parseMarkdownFormatting('Text with ~~strikethrough~~ content')).toBe(
				'Text with <s>strikethrough</s> content',
			);
		});

		it('should parse code markdown correctly', () => {
			expect(parseMarkdownFormatting('Text with `code` content')).toBe(
				'Text with <code>code</code> content',
			);
		});

		it('should parse multiple formatting types together', () => {
			const input = 'Caption with **bold** and _italic_ and ~~strike~~ and `code` text';
			const expected =
				'Caption with <strong>bold</strong> and <em>italic</em> and <s>strike</s> and <code>code</code> text';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});

		it('should handle nested formatting gracefully', () => {
			// Test that our regex patterns handle edge cases
			const input = '**bold _inside_ bold**';
			const expected = '<strong>bold <em>inside</em> bold</strong>';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});

		it('should handle empty strings and plain text', () => {
			expect(parseMarkdownFormatting('')).toBe('');
			expect(parseMarkdownFormatting('Plain text')).toBe('Plain text');
		});

		it('should handle malformed markdown gracefully', () => {
			// Test with unmatched markers
			expect(parseMarkdownFormatting('Text with **unmatched')).toBe('Text with **unmatched');
			expect(parseMarkdownFormatting('Text with _unmatched')).toBe('Text with _unmatched');
			expect(parseMarkdownFormatting('Text with `unmatched')).toBe('Text with `unmatched');
		});

		it('should handle multiple instances of same formatting', () => {
			const input = '**first** and **second** bold sections';
			const expected = '<strong>first</strong> and <strong>second</strong> bold sections';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});

		it('should handle complex real-world caption formatting', () => {
			const input =
				'Image showing **important data** with _emphasis_ on `code snippets` and ~~corrections~~';
			const expected =
				'Image showing <strong>important data</strong> with <em>emphasis</em> on <code>code snippets</code> and <s>corrections</s>';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});

		it('should handle code with special characters correctly', () => {
			const input = 'Caption with `code & special chars` and `console.log("test")`';
			const expected =
				'Caption with <code>code & special chars</code> and <code>console.log("test")</code>';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});

		it('should handle mixed formatting with code correctly', () => {
			const input = 'See **bold text** and `inline code` plus _italic text_';
			const expected =
				'See <strong>bold text</strong> and <code>inline code</code> plus <em>italic text</em>';
			expect(parseMarkdownFormatting(input)).toBe(expected);
		});
	});

	describe('Integration Tests - Combined Functions', () => {
		it('should handle complete caption processing pipeline', () => {
			// Simulate real caption processing: markdown parsing → HTML escaping
			const markdownCaption = 'Caption with **bold** and _italic_ & special "chars"';
			const parsed = parseMarkdownFormatting(markdownCaption);
			const escaped = escapeHtmlAttribute(parsed);

			expect(parsed).toBe(
				'Caption with <strong>bold</strong> and <em>italic</em> & special "chars"',
			);
			expect(escaped).toBe(
				'Caption with &lt;strong&gt;bold&lt;/strong&gt; and &lt;em&gt;italic&lt;/em&gt; &amp; special &quot;chars&quot;',
			);
		});

		it('should handle roundtrip processing correctly', () => {
			// Test the full roundtrip: markdown → HTML → escape → unescape
			const original = 'Caption with **bold** and special & chars';
			const parsed = parseMarkdownFormatting(original);
			const escaped = escapeHtmlAttribute(parsed);
			const unescaped = unescapeHtmlAttribute(escaped);

			// After roundtrip, markdown should be converted to HTML but special chars preserved
			expect(unescaped).toBe('Caption with <strong>bold</strong> and special & chars');
		});
	});
});
