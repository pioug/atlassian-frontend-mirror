import { BitbucketTransformer } from '../..';
import {
	doc,
	mediaSingle,
	media,
	caption,
	strong,
	em,
	code,
	strike,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

describe('Caption HTML Parsing Tests', () => {
	const transformer = new BitbucketTransformer(defaultSchema);

	describe('HTML → ADF parsing with data-caption attributes', () => {
		it('should parse HTML img with data-caption attribute to mediaSingle with caption', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="This is a simple caption" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption('This is a simple caption'),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should parse HTML img with data-caption and resizing attributes', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="Image with resizing" data-layout="align-start" data-width="50.5" data-width-type="percentage" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'align-start', width: 50.5, widthType: 'percentage' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption('Image with resizing'),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should parse HTML img with special characters in data-caption', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="Caption with 'single quotes' and &quot;double quotes&quot;" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption('Caption with \'single quotes\' and "double quotes"'),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should parse HTML img with escaped single quotes in data-caption', () => {
			// This tests the case where our serializer generated HTML entity escaped quotes
			const html = `<img src="http://path/to/image.jpg" data-caption="Caption with &#39;escaped quotes&#39; here" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption("Caption with 'escaped quotes' here"),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should not parse captions when shouldParseCaptions is false', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="This caption should be ignored" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: false,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should parse HTML img without data-caption (backward compatibility)', () => {
			const html = `<img src="http://path/to/image.jpg" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});
	});

	describe('ADF → Markdown serialization', () => {
		it('should serialize mediaSingle with caption to markdown with data-caption attribute', () => {
			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('This is a simple caption'),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='This is a simple caption' }\n",
			);
		});

		it('should serialize complex caption content with preserved formatting in data-caption', () => {
			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('Caption with ', strong('bold'), ' and ', em('italic'), ' text'),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='Caption with &#42;&#42;bold&#42;&#42; and &#95;italic&#95; text' }\n",
			);
		});

		it('should serialize caption with code/backticks correctly', () => {
			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('Caption with ', code('code snippet'), ' and more ', code('inline code')),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='Caption with &#96;code snippet&#96; and more &#96;inline code&#96;' }\n",
			);
		});

		it('should parse HTML img with markdown formatting in data-caption', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="Caption with **bold** and _italic_ text" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption('Caption with ', strong('bold'), ' and ', em('italic'), ' text'),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should parse HTML img with code/backticks in data-caption', () => {
			const html = `<img src="http://path/to/image.jpg" data-caption="Caption with \`code snippet\` and more \`code\`" data-layout="center" />`;

			const expectedDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external', alt: '' })(),
					caption('Caption with ', code('code snippet'), ' and more ', code('code')),
				),
			)(defaultSchema);

			const parsedDoc = transformer.parse(html, {
				shouldParseCaptions: true,
				shouldParseImageResizingAttributes: true,
			});
			expect(parsedDoc).toEqualDocument(expectedDoc);
		});

		it('should escape quotes in caption data attributes', () => {
			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption("Caption with 'single quotes'"),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='Caption with &#39;single quotes&#39;' }\n",
			);
		});
	});

	describe('Serialization Safety Tests', () => {
		it('should serialize captions consistently (default behavior)', () => {
			const defaultTransformer = new BitbucketTransformer(defaultSchema);

			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('Consistent caption behavior'),
				),
			)(defaultSchema);

			const markdown = defaultTransformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='Consistent caption behavior' }\n",
			);
		});

		it('should handle documents without captions gracefully', () => {
			const transformer = new BitbucketTransformer(defaultSchema);

			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual("![](http://path/to/image.jpg){: data-layout='center' }\n");
		});

		it('should maintain backward compatibility with existing transformer usage', () => {
			// This tests that our changes don't break existing code patterns
			const transformer = new BitbucketTransformer(defaultSchema, {
				disableBitbucketLinkStripping: true,
			});

			const adfDoc = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('Backward compatibility test'),
				),
			)(defaultSchema);

			const markdown = transformer.encode(adfDoc);
			expect(markdown).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='Backward compatibility test' }\n",
			);
		});
	});

	describe('Additional edge cases for captions', () => {
		const transformer = new BitbucketTransformer(defaultSchema);

		it('parses data-caption with strikethrough markdown ~~text~~ and serializes safely', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="hello ~~strike~~ world" />`;
			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption('hello ', strike('strike'), ' world'),
				),
			)(defaultSchema);
			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);

			// Now serialize back and ensure tildes are entity-encoded
			const markdown = transformer.encode(expected);
			expect(markdown).toEqual(
				"![](http://example.com/image.jpg){: data-layout='center' data-caption='hello &#126;&#126;strike&#126;&#126; world' }\n",
			);
		});

		it('serializes a wide range of special characters safely in data-caption', () => {
			const adf = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('[](){}!| * _ ` ~ < > & " \'"'),
				),
			)(defaultSchema);
			const md = transformer.encode(adf);
			expect(md).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='&#91;&#93;&#40;&#41;&#123;&#125;&#33;&#124; &#42; &#95; &#96; &#126; &lt; &gt; &amp; &quot; &#39;&quot;' }\n",
			);
		});

		it('treats literal HTML in caption text as text (sanitized on parse)', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="<b>bold</b> & <i>italic</i>" />`;
			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption('<b>bold</b> & <i>italic</i>'),
				),
			)(defaultSchema);
			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});

		it('does not interpret unmatched single markdown markers', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="A * lone asterisk and _ underscore" />`;
			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption('A * lone asterisk and _ underscore'),
				),
			)(defaultSchema);
			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});

		it('ignores whitespace-only data-caption', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="   \t\n" />`;
			const expected = doc(
				mediaSingle()(media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })()),
			)(defaultSchema);
			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});

		it('escapes attr-list-like sequences in captions so they do not break attributes', () => {
			const adf = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption("{: data-layout='left' } suspicious"),
				),
			)(defaultSchema);
			const md = transformer.encode(adf);
			expect(md).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='&#123;: data-layout=&#39;left&#39; &#125; suspicious' }\n",
			);
		});

		it('unescapes attribute entities and then sanitizes when building caption', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="&lt;b&gt;bold&lt;/b&gt; and &#39;quote&#39;" />`;
			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption("<b>bold</b> and 'quote'"),
				),
			)(defaultSchema);
			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});
	});
});
