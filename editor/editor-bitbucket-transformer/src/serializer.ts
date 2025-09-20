/* eslint-disable require-unicode-regexp */
import {
	MarkdownSerializer as PMMarkdownSerializer,
	MarkdownSerializerState as PMMarkdownSerializerState,
	type NodeSerializerSpec,
	type MarkSerializerSpec,
} from '@atlaskit/editor-prosemirror/markdown';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { escapeMarkdown, stringRepeat, escapeHtmlAttribute } from './util';
import tableNodes from './tableSerializer';

/**
 * Look for series of backticks in a string, find length of the longest one, then
 * generate a backtick chain of a length longer by one. This is the only proven way
 * to escape backticks inside code block and inline code (for python-markdown)
 */
export const generateOuterBacktickChain: (text: string, minLength?: number) => string = (() => {
	function getMaxLength(text: string): number {
		const matches = text.match(/`+/g);
		if (matches) {
			return matches.reduce((prev, val) => (val.length > prev.length ? val : prev), '').length;
		}
		return 0;
	}

	return function (text: string, minLength = 1): string {
		const length = Math.max(minLength, getMaxLength(text) + 1);
		return stringRepeat('`', length);
	};
})();

export class MarkdownSerializerState extends PMMarkdownSerializerState {
	context = { insideTable: false };
	captionForMedia = '';

	nodes: NodeSerializerSpec;
	marks: { [mark: string]: MarkSerializerSpec };

	/**
	 * Defines the internal variables used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L172
	 */
	delim: string = '';
	out: string = '';
	closed: Node | null = null;

	constructor(nodes: NodeSerializerSpec, marks: { [mark: string]: MarkSerializerSpec }) {
		// @ts-ignore -next-line
		super(nodes, marks, {});

		this.nodes = nodes;
		this.marks = marks;
	}

	/**
	 * Defines the internal atBlank method used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L241
	 */
	atBlank() {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		return /(^|\n)$/.test(this.out);
	}

	/**
	 * Defines the internal flushClose method used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L202
	 */
	flushClose(size: number = 2) {
		if (this.closed) {
			if (!this.atBlank()) {
				this.out += '\n';
			}
			if (size > 1) {
				let delimMin = this.delim;
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				const trim = /\s+$/.exec(delimMin);
				if (trim) {
					delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
				}
				for (let i = 1; i < size; i++) {
					this.out += delimMin + '\n';
				}
			}
			this.closed = null;
		}
	}

	renderContent(parent: PMNode): void {
		parent.forEach((child: PMNode, _offset: number, index: number) => {
			if (
				// If child is an empty Textblock we need to insert a zwnj-character in order to preserve that line in markdown
				child.isTextblock &&
				!child.textContent &&
				// If child is a Codeblock we need to handle this separately as we want to preserve empty code blocks
				!(child.type.name === 'codeBlock') &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				!(child.content && (child.content as any).size > 0)
			) {
				return nodes.empty_line(this, child);
			}

			return this.render(child, parent, index);
		});
	}

	/**
	 * This method override will properly escape backticks in text nodes with "code" mark enabled.
	 * Bitbucket uses python-markdown which does not honor escaped backtick escape sequences \`
	 * inside a backtick fence.
	 *
	 * @see MarkdownSerializerState.renderInline()
	 */
	renderInline(parent: PMNode): void {
		const active: Mark[] = [];
		let trailing = '';

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const progress = (node: PMNode | null, _?: any, index?: number) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let marks = node ? node.marks.filter((mark) => this.marks[mark.type.name as any]) : [];

			let leading = trailing;
			trailing = '';
			// If whitespace has to be expelled from the node, adjust
			// leading and trailing accordingly.
			if (
				node &&
				node.isText &&
				marks.some((mark) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const info = this.marks[mark.type.name as any];
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return info && (info as any).expelEnclosingWhitespace;
				})
			) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, require-unicode-regexp
				const [, lead, inner, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text!)!;
				leading += lead;
				trailing = trail;
				if (lead || trail) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					node = inner ? (node as any).withText(inner) : null;
					if (!node) {
						marks = active;
					}
				}
			}

			const code =
				marks.length && marks[marks.length - 1].type.name === 'code' && marks[marks.length - 1];
			const len = marks.length - (code ? 1 : 0);

			// Try to reorder 'mixable' marks, such as em and strong, which
			// in Markdown may be opened and closed in different order, so
			// that order of the marks for the token matches the order in
			// active.
			// eslint-disable-next-line no-labels
			outer: for (let i = 0; i < len; i++) {
				const mark: Mark = marks[i];
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if (!(this.marks[mark.type.name as any] as any).mixable) {
					break;
				}
				for (let j = 0; j < active.length; j++) {
					const other = active[j];
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					if (!(this.marks[other.type.name as any] as any).mixable) {
						break;
					}
					if (mark.eq(other)) {
						if (i > j) {
							marks = marks
								.slice(0, j)
								.concat(mark)
								.concat(marks.slice(j, i))
								.concat(marks.slice(i + 1, len));
						} else if (j > i) {
							marks = marks
								.slice(0, i)
								.concat(marks.slice(i + 1, j))
								.concat(mark)
								.concat(marks.slice(j, len));
						}
						// eslint-disable-next-line no-labels
						continue outer;
					}
				}
			}

			// Find the prefix of the mark set that didn't change
			let keep = 0;
			while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) {
				++keep;
			}

			// Close the marks that need to be closed
			while (keep < active.length) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.text(this.markString(active.pop()!, false, parent, index!), false);
			}

			// Output any previously expelled trailing whitespace outside the marks
			if (leading) {
				this.text(leading);
			}

			// Open the marks that need to be opened
			while (active.length < len) {
				const add = marks[active.length];
				active.push(add);
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.text(this.markString(add, true, parent, index!), false);
			}

			if (node) {
				if (!code || !node.isText) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.render(node, parent, index!);
				} else if (node.text) {
					// Generate valid monospace, fenced with series of backticks longer that backtick series inside it.
					let text = node.text;
					const backticks = generateOuterBacktickChain(node.text as string, 1);

					// Make sure there is a space between fences, otherwise python-markdown renderer will get confused
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					if (text.match(/^`/)) {
						text = ' ' + text;
					}

					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					if (text.match(/`$/)) {
						text += ' ';
					}

					this.text(backticks + text + backticks, false);
				}
			}
		};

		parent.forEach((child: PMNode, _offset: number, index: number) => {
			progress(child, parent, index);
		});

		progress(null);
	}
}

/**
 * Render caption content as markdown text by applying marks directly
 * This avoids creating temporary serializer states
 */
function renderCaptionAsMarkdown(node: PMNode, state: MarkdownSerializerState): string {
	let result = '';
	node.descendants((child, pos) => {
		if (child.type.name === 'text') {
			let text = child.text || '';
			// Apply marks using the existing mark serializers
			child.marks.forEach((mark) => {
				const markSerializer = state.marks[mark.type.name];
				if (
					markSerializer &&
					typeof markSerializer.open === 'string' &&
					typeof markSerializer.close === 'string'
				) {
					text = markSerializer.open + text + markSerializer.close;
				}
			});
			result += text;
		}
		return false; // Don't recurse further
	});
	return result;
}

export class MarkdownSerializer extends PMMarkdownSerializer {
	serialize(content: PMNode): string {
		const state = new MarkdownSerializerState(this.nodes, this.marks);

		state.renderContent(content);
		return state.out === '\u200c' ? '' : state.out; // Return empty string if editor only contains a zero-non-width character
	}
}

const editorNodes = {
	blockquote(state: MarkdownSerializerState, node: PMNode) {
		state.wrapBlock('> ', null, node, () => state.renderContent(node));
	},
	codeBlock(state: MarkdownSerializerState, node: PMNode) {
		const backticks = generateOuterBacktickChain(node.textContent, 3);
		state.write(backticks + (node.attrs.language || '') + '\n');
		state.text(node.textContent ? node.textContent : '\u200c', false);
		state.ensureNewLine();
		state.write(backticks);
		state.closeBlock(node);
	},
	extension: function extension(state: MarkdownSerializerState, node: PMNode) {
		// if the extension is a code suggestion, render it as a suggestion
		if (node.attrs.extensionKey === 'codesuggestions:suggestion-node') {
			const backticks = generateOuterBacktickChain(node.textContent, 3);
			state.write(backticks + 'suggestion' + '\n');
			const userContent = node.attrs.text || '';
			state.text(userContent, false);
			state.ensureNewLine();
			state.write(backticks);
			state.closeBlock(node);
		}
	},
	heading(state: MarkdownSerializerState, node: PMNode) {
		state.write(state.repeat('#', node.attrs.level) + ' ');
		state.renderInline(node);
		state.closeBlock(node);
	},
	rule(state: MarkdownSerializerState, node: PMNode) {
		state.write(node.attrs.markup || '---');
		state.closeBlock(node);
	},
	bulletList(state: MarkdownSerializerState, node: PMNode) {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			state.render(child, node, i);
		}
	},
	orderedList(state: MarkdownSerializerState, node: PMNode) {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			state.render(child, node, i);
		}
	},
	listItem(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number) {
		const num = Number(parent?.attrs?.order);
		const order = Number.isNaN(num) || num < 0 ? 1 : Math.floor(num);
		const delimiter = parent.type.name === 'bulletList' ? '* ' : `${order + index}. `;
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			// if  at second child or more of list item, add a newline
			if (i > 0) {
				state.write('\n');
			}
			// if at first child of list item, add delimiter (e.g "1.").
			// if at second child or more of list item, only add spacing (not delimiter)
			if (i === 0) {
				state.wrapBlock('  ', delimiter, node, () => state.render(child, parent, i));
			} else {
				state.wrapBlock('    ', null, node, () => state.render(child, parent, i));
			}
			if (child.type.name === 'paragraph' && i > 0) {
				state.write('\n');
			}
			state.flushClose(1);
		}
		// if we're at the final list item, add a final closing newline
		if (index === parent.childCount - 1) {
			state.write('\n');
		}
	},
	paragraph(state: MarkdownSerializerState, node: PMNode) {
		state.renderInline(node);
		state.closeBlock(node);
	},
	mediaGroup(state: MarkdownSerializerState, node: PMNode) {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			state.render(child, node, i);
		}
	},
	mediaSingle(state: MarkdownSerializerState, node: PMNode, parent: PMNode) {
		// First pass: collect caption if it exists (always enabled for now - can be made configurable later)
		let captionText = '';
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			if (child.type.name === 'caption') {
				captionText = renderCaptionAsMarkdown(child, state);
				break;
			}
		}

		// Store caption for media serializer to use
		state.captionForMedia = captionText ? escapeHtmlAttribute(captionText) : '';

		// Second pass: render only media nodes (caption serializer will be a no-op)
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			if (child.type.name === 'media') {
				state.render(child, node, i);
			}
		}

		// Add newline after mediaSingle if not in table
		if (!parent.type.name.startsWith('table')) {
			state.write('\n');
		}
	},
	media(state: MarkdownSerializerState, node: PMNode, parent: PMNode) {
		const widthAttributeMarkdown = parent.attrs.width ? ` data-width='${parent.attrs.width}'` : '';
		const widthTypeAttributeMarkdown = parent.attrs.widthType
			? ` data-width-type='${parent.attrs.widthType}'`
			: '';
		const layoutAttributeMarkdown = parent.attrs.layout
			? ` data-layout='${parent.attrs.layout}'`
			: '';

		// Check if caption was set by the mediaSingle serializer
		const captionText = state.captionForMedia || '';
		const captionAttributeMarkdown = captionText ? ` data-caption='${captionText}'` : '';

		const nodeAttributesMarkdown =
			widthAttributeMarkdown +
			widthTypeAttributeMarkdown +
			layoutAttributeMarkdown +
			captionAttributeMarkdown;

		if (nodeAttributesMarkdown) {
			state.write(`![](${node.attrs.url}){:${nodeAttributesMarkdown} }`);
		} else {
			state.write(`![](${node.attrs.url})`);
		}
	},
	image(state: MarkdownSerializerState, node: PMNode) {
		// Note: the 'title' is not escaped in this flavor of markdown.
		state.write(
			'![' +
				escapeMarkdown(node.attrs.alt) +
				'](' +
				node.attrs.src +
				(node.attrs.title ? ` '${escapeMarkdown(node.attrs.title)}'` : '') +
				')',
		);
	},
	hardBreak(state: MarkdownSerializerState) {
		state.write('  \n');
	},
	text(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number) {
		const previousNode = index === 0 ? null : parent.child(index - 1);
		let text = node.textContent;

		// BB converts 4 spaces at the beginning of the line to code block
		// that's why we escape 4 spaces with zero-width-non-joiner
		const fourSpaces = '    ';
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		if (!previousNode && /^\s{4}/.test(node.textContent)) {
			text = node.textContent.replace(fourSpaces, '\u200c' + fourSpaces);
		}

		const lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const startOfLine = state.atBlank() || !!state.closed;
			state.write();
			state.out += escapeMarkdown(lines[i], startOfLine, state.context.insideTable);
			if (i !== lines.length - 1) {
				if (lines[i] && lines[i].length && lines[i + 1] && lines[i + 1].length) {
					state.out += '  ';
				}
				state.out += '\n';
			}
		}
	},
	empty_line(state: MarkdownSerializerState, node: PMNode) {
		state.write('\u200c'); // zero-width-non-joiner
		state.closeBlock(node);
	},
	mention(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number) {
		const isLastNode = parent.childCount === index + 1;
		let delimiter = '';
		if (!isLastNode) {
			const nextNode = parent.child(index + 1);
			const nextNodeHasLeadingSpace = nextNode.textContent.indexOf(' ') === 0;
			delimiter = nextNodeHasLeadingSpace ? '' : ' ';
		}

		state.write(`@${node.attrs.id}${delimiter}`);
	},
	emoji(state: MarkdownSerializerState, node: PMNode) {
		state.write(node.attrs.shortName);
	},
	inlineCard(state: MarkdownSerializerState, node: PMNode) {
		state.write(`[${node.attrs.url}](${node.attrs.url}){: data-inline-card='' }`);
	},
	caption(state: MarkdownSerializerState, node: PMNode, parent: PMNode) {
		if (parent.type.name === 'mediaSingle') {
			// Caption is already handled by mediaSingle serializer - do nothing
		} else {
			// Normal caption rendering for other contexts
			state.renderInline(node);
		}
	},
};

export const nodes = { ...editorNodes, ...tableNodes };

export const marks = {
	em: { open: '_', close: '_', mixable: true, expelEnclosingWhitespace: true },
	strong: {
		open: '**',
		close: '**',
		mixable: true,
		expelEnclosingWhitespace: true,
	},
	strike: {
		open: '~~',
		close: '~~',
		mixable: true,
		expelEnclosingWhitespace: true,
	},
	link: {
		open: '[',
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		close(_state: MarkdownSerializerState, mark: any) {
			return '](' + mark.attrs['href'] + ')';
		},
	},
	code: { open: '`', close: '`' },
};
