import { createSchema } from '../../../../schema/create-schema';
import {
	codeBlock,
	codeBlockWithExtendedAttributes,
	toJSON as codeBlockToJSON,
} from '../../../../schema/nodes/code-block';
import {
	fromHTML,
	toHTML,
} from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema codeBlock node`, () => {
	const schema = makeSchema();
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(codeBlock).toStrictEqual({
			attrs: {
				language: {
					default: null,
				},
				uniqueId: {
					default: null,
				},
				localId: {
					default: null,
				},
			},
			code: true,
			content: '(text | unsupportedInline)*',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			defining: true,
			group: 'block',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					preserveWhitespace: 'full',
					tag: 'pre',
				},
				{
					getAttrs: expect.anything(),
					getContent: expect.anything(),
					preserveWhitespace: 'full',
					tag: 'div[style]',
				},
				{
					getAttrs: expect.anything(),
					preserveWhitespace: 'full',
					tag: 'table[style]',
				},
				{
					getAttrs: expect.anything(),
					preserveWhitespace: 'full',
					tag: 'div.code-block',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('should have code property to be true', () => {
		expect(schema.nodes.codeBlock.spec.code).toEqual(true);
	});

	describe('parse from html', () => {
		const expectedCode = `if (true) {
    console.log('tada')
}`;
		describe('parse from editor encoded HTML', () => {
			describe('when language is not set', () => {
				it('converts to block code node', () => {
					const doc = fromHTML(
						'<pre><span>window.alert("hello");<span></pre>',
						schema,
					);

					expect(doc.firstChild!.type.name).toEqual('codeBlock');
				});

				it('has language attribute as null', () => {
					const doc = fromHTML(
						'<pre><span>window.alert("hello");<span></pre>',
						schema,
					);

					expect(doc.firstChild!.attrs['language']).toEqual(null);
				});
			});

			describe('when language is set', () => {
				it('converts to block code node', () => {
					const doc = fromHTML(
						'<pre data-language="javascript"><span>window.alert("hello");<span></pre>',
						schema,
					);

					expect(doc.firstChild!.type.spec).toEqual(codeBlock);
				});

				it(`extracts language "python" from data-language attribute`, () => {
					const doc = fromHTML(
						`<pre data-language='python'><span>window.alert("hello");<span></pre>`,
						schema,
					);

					expect(doc.firstChild!.attrs['language']).toEqual('python');
				});
			});

			it('preserves all newlines and whitespace', () => {
				const doc = fromHTML(
					'<pre><span></span>    bar\n       baz\n</pre>',
					schema,
				);

				expect(doc.firstChild!.textContent).toEqual('    bar\n       baz\n');
			});
		});

		describe('parse from Bitbucket', () => {
			describe('when language is not set', () => {
				it('converts to block code node', () => {
					const doc = fromHTML(
						'<div class="codehilite"><pre><span>window.alert("hello");<span></pre></div>',
						schema,
					);

					expect(doc.firstChild!.type.spec).toEqual(codeBlock);
				});

				it('has language attribute as null', () => {
					const doc = fromHTML(
						'<div class="codehilite"><pre><span>window.alert("hello");<span></pre></div>',
						schema,
					);
					const codeBlock = doc.firstChild!;

					expect(codeBlock.attrs.language).toEqual(null);
				});
			});

			describe('when other class similar to language is set', () => {
				it('has language attribute as null', () => {
					const doc = fromHTML(
						'<div class="codehilite nolanguage-javascript"><pre><span>window.alert("hello");<span></pre></div>',
						schema,
					);
					const codeBlock = doc.firstChild!;

					expect(codeBlock.attrs.language).toEqual(null);
				});
			});
		});

		it('should parse code block from Android Studio Koala, which used pre tag', () => {
			const doc = fromHTML(
				`<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><div style="background-color:#2b2b2b;color:#a9b7c6"><pre style="font-family:'JetBrains Mono',monospace;font-size:9.8pt;"><span style="color:#cc7832;">if&#32;</span>(<span style="color:#cc7832;">true</span>)&#32;{<br>&#32;&#32;&#32;&#32;console.log(<span style="color:#6a8759;">'tada'</span>)<br>}</pre></div></body></html>`,
				schema,
			);
			expect(doc.firstChild!.type.spec).toEqual(codeBlock);
			expect(doc.firstChild!.content.firstChild!.text).toBe(expectedCode);
		});

		describe(`parse tag div['style']`, () => {
			it('should parse code block from tag with font-family monospace css', () => {
				const doc = fromHTML(
					`<meta charset="utf-8"><div style="font-family: Menlo, Monaco, 'Courier New', monospace;">Code :D</div>`,
					schema,
				);
				expect(doc.firstChild!.type.spec).toEqual(codeBlock);
			});

			it('should parse code block from Android Studio Hedgehog', () => {
				const doc = fromHTML(
					`<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><div style="background-color:#2b2b2b;color:#a9b7c6;font-family:'JetBrains Mono',monospace;font-size:9.8pt;white-space:pre;"><span style="color:#cc7832;">if&#32;</span>(<span style="color:#cc7832;">true</span>)&#32;{<br>&#32;&#32;&#32;&#32;console.log(<span style="color:#6a8759;">'tada'</span>)<br>}</div></body></html>`,
					schema,
				);
				expect(doc.firstChild!.type.spec).toEqual(codeBlock);
				expect(doc.firstChild!.content.firstChild!.text).toBe(expectedCode);
			});

			it('should parse code block from Idea IDE', () => {
				const doc = fromHTML(
					`<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><div style="background-color:#2b2b2b;color:#a9b7c6;font-family:'JetBrains Mono',monospace;font-size:9.8pt;"><pre><span style="color:#cc7832;">if&#32;</span>(<span style="color:#cc7832;">true</span>)&#32;{<br>&#32;&#32;&#32;&#32;console.<span style="color:#ffc66d;">log</span>(<span style="color:#6a8759;">'tada'</span>)<br>}</pre></div></body></html>`,
					schema,
				);
				expect(doc.firstChild!.content.firstChild!.text).toBe(expectedCode);
			});

			it('should parse code block from VS Code', () => {
				const doc = fromHTML(
					`<meta charset='utf-8'><div style="color: #cccccc;background-color: #1f1f1f;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #c586c0;">if</span><span style="color: #cccccc;"> (</span><span style="color: #569cd6;">true</span><span style="color: #cccccc;">) {</span></div><div><span style="color: #cccccc;">    </span><span style="color: #9cdcfe;">console</span><span style="color: #cccccc;">.</span><span style="color: #dcdcaa;">log</span><span style="color: #cccccc;">(</span><span style="color: #ce9178;">'tada'</span><span style="color: #cccccc;">)</span></div><div><span style="color: #cccccc;">}</span></div></div>`,
					schema,
				);
				expect(doc.firstChild!.type.spec).toEqual(codeBlock);
				expect(doc.firstChild!.content.firstChild!.text).toBe(expectedCode);
			});

			it('should parse code block from tag with `whitespace: pre` css', () => {
				const doc = fromHTML(
					'<meta charset="utf-8"><div style="white-space: pre;">Hello</div>',
					schema,
				);
				expect(doc.firstChild!.type.name).toEqual('codeBlock');
			});

			it('should not create code block for `whitespace pre-wrap` css', () => {
				const doc = fromHTML(
					'<meta charset="utf-8"><div style="white-space: pre-wrap;">Hello</div>',
					schema,
				);
				expect(doc.firstChild!.type.name).toEqual('paragraph');
			});
		});

		describe('when language is set', () => {
			it('converts to block code node', () => {
				const doc = fromHTML(
					'<div class="codehilite language-javascript"><pre><span>window.alert("hello");<span></pre></div>',
					schema,
				);

				expect(doc.firstChild!.type.spec).toEqual(codeBlock);
			});

			it(`extracts language attribute from class "language-python"`, () => {
				const doc = fromHTML(
					`<div class="codehilite language-python"><pre><span>window.alert("hello");<span></pre></div>`,
					schema,
				);
				const codeBlock = doc.firstChild!;

				expect(codeBlock.attrs.language).toEqual('python');
			});

			it('removes last new line', () => {
				const doc = fromHTML(
					'<div class="codehilite"><pre><span>hello world;<span><span>\n<span></pre></div>',
					schema,
				);

				expect(doc.firstChild!.textContent).toEqual('hello world;');
			});

			it('preserves newlines in the middle and whitespace', () => {
				const doc = fromHTML(
					'<div class="codehilite"><pre><span></span>    bar\n       baz</pre></div>',
					schema,
				);

				expect(doc.firstChild!.textContent).toEqual('    bar\n       baz');
			});
		});
	});

	describe('convert to HTML', () => {
		const schema = makeSchema();

		describe('when language is not set', () => {
			it('converts to pre tag', () => {
				const codeBlock = schema.nodes.codeBlock.create();
				expect(toHTML(codeBlock, schema)).toContain('<pre');
			});

			it('does not set data-language attributes', () => {
				const codeBlock = schema.nodes.codeBlock.create();
				expect(toHTML(codeBlock, schema)).not.toContain('data-language');
			});
		});

		describe('when language is set to null', () => {
			it('does not set data-language attributes', () => {
				const codeBlock = schema.nodes.codeBlock.create({ language: null });
				expect(toHTML(codeBlock, schema)).not.toContain('data-language');
			});
		});

		describe('when language is set to undefined', () => {
			it('does not set data-language attributes', () => {
				const codeBlock = schema.nodes.codeBlock.create({
					language: undefined,
				});
				expect(toHTML(codeBlock, schema)).not.toContain('data-language');
			});
		});

		describe('when language is set to a value', () => {
			it('converts to pre tag', () => {
				const codeBlock = schema.nodes.codeBlock.create({
					language: 'javascript',
				});
				expect(toHTML(codeBlock, schema)).toContain('<pre');
			});

			it('sets data-language attributes', () => {
				const codeBlock = schema.nodes.codeBlock.create({
					language: 'javascript',
				});
				expect(toHTML(codeBlock, schema)).toContain(
					'data-language="javascript"',
				);
			});
		});
	});
});

// eslint-disable-next-line jest/no-identical-title
describe(`${packageName}/schema: codeBlock_with_extended_attributes node (stage-0)`, () => {
	const stage0Schema = makeStage0Schema();

	it('base codeBlock node definition is unchanged (backward compat)', () => {
		// The base codeBlock spec should not include wrap or hideLineNumbers
		expect(codeBlock.attrs).not.toHaveProperty('wrap');
		expect(codeBlock.attrs).not.toHaveProperty('hideLineNumbers');
	});

	it('variant node spec has wrap and hideLineNumbers attrs with correct defaults', () => {
		expect(codeBlockWithExtendedAttributes.attrs).toMatchObject({
			wrap: { default: null },
			hideLineNumbers: { default: false },
		});
	});

	it('creates codeBlock with wrap null when wrap is omitted', () => {
		const node = stage0Schema.nodes.codeBlock.create();
		expect(node.attrs.wrap).toBeNull();
		expect(Boolean(node.attrs.wrap)).toBe(false);
	});

	it('variant node spec includes language attr (full attr set)', () => {
		expect(codeBlockWithExtendedAttributes.attrs).toMatchObject({
			language: { default: null },
		});
	});

	describe('stage-0: convert to JSON', () => {
		it('does not serialize wrap when wrap is null', () => {
			const node = stage0Schema.nodes.codeBlock.create({ wrap: null });
			expect(codeBlockToJSON(node).attrs).not.toHaveProperty('wrap');
		});

		it('serializes wrap when wrap is false', () => {
			const node = stage0Schema.nodes.codeBlock.create({ wrap: false });
			expect(codeBlockToJSON(node).attrs).toMatchObject({ wrap: false });
		});

		it('serializes wrap when wrap is true', () => {
			const node = stage0Schema.nodes.codeBlock.create({ wrap: true });
			expect(codeBlockToJSON(node).attrs).toMatchObject({ wrap: true });
		});
	});

	describe('stage-0: convert to HTML', () => {
		it('adds data-wrap="false" when wrap is false', () => {
			const node = stage0Schema.nodes.codeBlock.create({ wrap: false });
			expect(toHTML(node, stage0Schema)).toContain('data-wrap="false"');
		});

		it('adds data-wrap="true" when wrap is true', () => {
			const node = stage0Schema.nodes.codeBlock.create({ wrap: true });
			expect(toHTML(node, stage0Schema)).toContain('data-wrap="true"');
		});

		it('does not add data-hide-line-numbers when hideLineNumbers is false (default)', () => {
			const node = stage0Schema.nodes.codeBlock.create({
				hideLineNumbers: false,
			});
			expect(toHTML(node, stage0Schema)).not.toContain(
				'data-hide-line-numbers',
			);
		});

		it('adds data-hide-line-numbers="true" when hideLineNumbers is true', () => {
			const node = stage0Schema.nodes.codeBlock.create({
				hideLineNumbers: true,
			});
			expect(toHTML(node, stage0Schema)).toContain(
				'data-hide-line-numbers="true"',
			);
		});

		it('sets data-language when language is set', () => {
			const node = stage0Schema.nodes.codeBlock.create({
				language: 'typescript',
			});
			expect(toHTML(node, stage0Schema)).toContain(
				'data-language="typescript"',
			);
		});
	});

	describe('stage-0: parse from HTML', () => {
		it('parses wrap=true from data-wrap attribute', () => {
			const doc = fromHTML(
				'<pre data-language="javascript" data-wrap="true"><code>hello</code></pre>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.wrap).toBe(true);
		});

		it('parses wrap=true when data-wrap is absent (defaults to wrapped for external HTML paste)', () => {
			const doc = fromHTML('<pre><code>hello</code></pre>', stage0Schema);
			expect(doc.firstChild!.attrs.wrap).toBe(true);
		});

		it('parses wrap=false when data-wrap is absent from Fabric editor paste', () => {
			const doc = fromHTML(
				'<pre data-pm-slice="0 0 []"><code>hello</code></pre>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.wrap).toBe(false);
		});

		it('parses wrap=false when data-wrap="false" is explicit (preserves intentional unwrap)', () => {
			const doc = fromHTML(
				'<pre data-wrap="false"><code>hello</code></pre>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.wrap).toBe(false);
		});

		it('parses wrap=true from VS Code/Android Studio style div code blocks', () => {
			const doc = fromHTML(
				'<div style="font-family: Menlo, Monaco, monospace;">hello</div>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.wrap).toBe(true);
		});

		it('parses wrap=true from GitHub/Gist code tables', () => {
			const doc = fromHTML(
				'<table style="border-collapse: collapse;"><tbody><tr><td class="blob-code">hello</td></tr></tbody></table>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.wrap).toBe(true);
		});

		it('parses wrap=true from react-syntax-highlighter code blocks', () => {
			const doc = fromHTML('<div class="code-block">hello</div>', stage0Schema);
			expect(doc.firstChild!.attrs.wrap).toBe(true);
		});

		it('parses hideLineNumbers=true from data-hide-line-numbers="true"', () => {
			const doc = fromHTML(
				'<pre data-hide-line-numbers="true"><code>hello</code></pre>',
				stage0Schema,
			);
			expect(doc.firstChild!.attrs.hideLineNumbers).toBe(true);
		});

		it('parses hideLineNumbers=false when data-hide-line-numbers is absent (default behaviour preserved)', () => {
			const doc = fromHTML('<pre><code>hello</code></pre>', stage0Schema);
			expect(doc.firstChild!.attrs.hideLineNumbers).toBe(false);
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'codeBlock', 'unsupportedInline'],
		marks: ['unsupportedMark', 'unsupportedNodeAttribute'],
	});
}

function makeStage0Schema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'codeBlock', 'unsupportedInline'],
		marks: ['unsupportedMark', 'unsupportedNodeAttribute'],
		customNodeSpecs: {
			codeBlock: codeBlockWithExtendedAttributes,
		},
	});
}
