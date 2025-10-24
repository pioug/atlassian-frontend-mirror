import { BitbucketTransformer } from '../..';
import {
	doc,
	mediaSingle,
	media,
	caption,
	strong,
	em,
	strike,
	code,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

describe('Caption edge cases and sanitization', () => {
	const transformer = new BitbucketTransformer(defaultSchema);

	describe('HTML → ADF parsing edge cases', () => {
		it('parses data-caption with strikethrough markdown ~~text~~', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="A ~~struck~~ text" />`;

			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption('A ', strike('struck'), ' text'),
				),
			)(defaultSchema);

			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});

		it('sanitizes HTML tags in data-caption and treats them as literal text', () => {
			const html = `<img src="http://example.com/image.jpg" data-caption="<strong>bold</strong> & <em>italic</em>" />`;

			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption('<strong>bold</strong> & <em>italic</em>'),
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

		it('parses figcaption with markdown formatting', () => {
			const html = `
        <figure>
          <img src="http://example.com/image.jpg" />
          <figcaption>**bold** _italic_ ~~strike~~ \`code\`</figcaption>
        </figure>
      `;

			const expected = doc(
				mediaSingle()(
					media({ url: 'http://example.com/image.jpg', type: 'external', alt: '' })(),
					caption(strong('bold'), ' ', em('italic'), ' ', strike('strike'), ' ', code('code')),
				),
			)(defaultSchema);

			const parsed = transformer.parse(html, { shouldParseCaptions: true });
			expect(parsed).toEqualDocument(expected);
		});

		it('unescapes attribute entities then sanitizes when building caption', () => {
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

	describe('ADF → Markdown serialization edge cases', () => {
		it('serializes strikethrough mark in captions using entity-encoded tildes', () => {
			const adf = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('A ', strike('struck'), ' text'),
				),
			)(defaultSchema);

			const md = transformer.encode(adf);
			expect(md).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='A &#126;&#126;struck&#126;&#126; text' }\n",
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

		it('serializes literal HTML in caption text without interpreting as HTML', () => {
			const adf = doc(
				mediaSingle({ layout: 'center' })(
					media({ url: 'http://path/to/image.jpg', type: 'external' })(),
					caption('<script>alert(1)</script>'),
				),
			)(defaultSchema);

			const md = transformer.encode(adf);
			expect(md).toEqual(
				"![](http://path/to/image.jpg){: data-layout='center' data-caption='&lt;script&gt;alert&#40;1&#41;&lt;/script&gt;' }\n",
			);
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
	});
});
