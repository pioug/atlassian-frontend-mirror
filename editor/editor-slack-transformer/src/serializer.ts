import {
	MarkdownSerializer as PMMarkdownSerializer,
	MarkdownSerializerState as PMMarkdownSerializerState,
	type NodeSerializerSpec,
	type MarkSerializerSpec,
} from '@atlaskit/editor-prosemirror/markdown';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { escapeMarkdown } from './util';

export class MarkdownSerializerState extends PMMarkdownSerializerState {
	nodes: NodeSerializerSpec;
	marks: { [mark: string]: MarkSerializerSpec };

	/**
	 * Defines the internal variables used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L172
	 */
	delim: string = '';
	out: string = '';
	closed: Node | null = null;

	/**
	 * Defines the internal atBlank method used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L241
	 */
	atBlank(): boolean {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		return /(^|\n)$/.test(this.out);
	}

	/**
	 * Defines the internal flushClose method used in the markdown serializer
	 * @see https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L202
	 */
	flushClose(size: number = 2): void {
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

	constructor(nodes: NodeSerializerSpec, marks: { [mark: string]: MarkSerializerSpec }) {
		// @ts-ignore -next-line
		super(nodes, marks, {});

		this.nodes = nodes;
		this.marks = marks;
	}

	renderContent(parent: PMNode): void {
		parent.forEach((child: PMNode, _offset: number, index: number) => {
			if (
				// If child is an empty Textblock we need to insert a zwnj-character in order to preserve that line in markdown
				child.isTextblock &&
				!child.textContent &&
				// If child is a Codeblock we need to handle this separately as we want to preserve empty code blocks
				!(child.type.name === 'codeBlock') &&
				!(child.content && child.content.size > 0)
			) {
				return nodes.empty_line(this, child);
			}

			return this.render(child, parent, index);
		});
	}
}

export class MarkdownSerializer extends PMMarkdownSerializer {
	serialize(content: PMNode): string {
		const state = new MarkdownSerializerState(this.nodes, this.marks);

		state.renderContent(content);

		return state.out === '\u200c' ? '' : state.out; // Return empty string if editor only contains a zero-non-width character
	}
}

/**
 * Stubs for unsupported nodes
 */
const unsupportedNodes = {
	table(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[table]');
		state.closeBlock(node);
	},
	blockCard(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[block card]');
		state.closeBlock(node);
	},
	embedCard(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[embedded card]');
		state.closeBlock(node);
	},
	/**
	 * Inline cards with url type attributes will be sent as a link
	 */
	inlineCard(state: MarkdownSerializerState, node: PMNode): void {
		const content = node.attrs.url ? `[<${node.attrs.url}|inline card>]` : '[inline card]';

		state.write(content);
	},
	inlineExtension(state: MarkdownSerializerState): void {
		state.write('[inline extension]');
	},
	mediaInline(state: MarkdownSerializerState, node: PMNode): void {
		const content =
			node.attrs?.type === 'image' ? '[inline image attached]' : '[inline file attached]';
		state.write(content);
	},
	extension(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[extension]');
		state.closeBlock(node);
	},
	bodiedExtension(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[bodied extension]');
		state.closeBlock(node);
	},
	taskList(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[task list]');
		state.closeBlock(node);
	},
	expand(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[expand]');
		state.closeBlock(node);
	},
	nestedExpand(state: MarkdownSerializerState, node: PMNode): void {
		state.write('[nested expand]');
		state.closeBlock(node);
	},
	confluenceUnsupportedBlock(state: MarkdownSerializerState): void {
		state.write('');
	},
	confluenceUnsupportedInline(state: MarkdownSerializerState): void {
		state.write('');
	},
	unsupportedInline(state: MarkdownSerializerState): void {
		state.write('');
	},
	unsupportedBlock(state: MarkdownSerializerState): void {
		state.write('');
	},
};

export const nodes = {
	blockquote(state: MarkdownSerializerState, node: PMNode): void {
		state.wrapBlock('> ', null, node, () => state.renderContent(node));
	},
	codeBlock(state: MarkdownSerializerState, node: PMNode): void {
		state.write('```');
		state.ensureNewLine();
		state.text(node.textContent ? node.textContent : '\u200c', false);
		state.ensureNewLine();
		state.write('```');
		state.closeBlock(node);
	},
	heading(state: MarkdownSerializerState, node: PMNode): void {
		state.renderInline(node);
		state.closeBlock(node);
	},
	rule(state: MarkdownSerializerState, node: PMNode): void {
		state.closeBlock(node);
	},
	bulletList(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
		}
	},
	orderedList(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
		}
	},
	listItem(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number): void {
		const delimiter = parent.type.name === 'bulletList' ? '• ' : `${index + 1}. `;

		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			if (i > 0) {
				state.write('\n');
			}

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

		if (index === parent.childCount - 1) {
			state.write('\n');
		}
	},
	caption(state: MarkdownSerializerState, node: PMNode): void {
		state.renderInline(node);
		state.closeBlock(node);
	},
	paragraph(state: MarkdownSerializerState, node: PMNode): void {
		state.renderInline(node);
		state.closeBlock(node);
	},
	hardBreak(state: MarkdownSerializerState): void {
		state.write('  \n');
	},
	text(state: MarkdownSerializerState, node: PMNode): void {
		const lines = node.textContent.split('\n');

		for (let i = 0; i < lines.length; i++) {
			state.write();
			state.out += escapeMarkdown(lines[i]);

			if (i !== lines.length - 1) {
				state.out += '\n';
			}
		}
	},
	empty_line(state: MarkdownSerializerState, node: PMNode): void {
		state.write('\u200c'); // zero-width-non-joiner
		state.closeBlock(node);
	},
	mention(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number): void {
		const isLastNode = parent.childCount === index + 1;
		let delimiter = '';
		if (!isLastNode) {
			const nextNode = parent.child(index + 1);
			const nextNodeHasLeadingSpace = nextNode.textContent.indexOf(' ') === 0;
			delimiter = nextNodeHasLeadingSpace ? '' : ' ';
		}

		state.write(`@${node.attrs.id}${delimiter}`);
	},
	emoji(state: MarkdownSerializerState, node: PMNode): void {
		state.write(node.attrs.text || node.attrs.shortName);
	},
	mediaGroup(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
		}
	},
	mediaSingle(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
			state.write('\n');
		}
	},
	/**
	 * Slack markdown does not have specific syntax for images/files.
	 * We just show that there's an image attached as a link and a media just as a text.
	 */
	media(state: MarkdownSerializerState): void {
		state.write('[media attached]');
		state.write('\n');
	},
	image(state: MarkdownSerializerState, node: PMNode): void {
		state.write(`[<${node.attrs.src}|image attached>]`);
	},
	date(state: MarkdownSerializerState, node: PMNode): void {
		/**
		 *  The year will be omitted if the date refers to the current year.
		 *  Timestamp should be transformed to Unix time.
		 */
		const unixTime = (+node.attrs.timestamp / 1000) | 0;

		state.write(
			`<!date^${unixTime}^{date_short}|${new Date(+node.attrs.timestamp).toDateString()}>`,
		);
	},
	decisionList(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
		}
	},
	decisionItem(state: MarkdownSerializerState, node: PMNode, parent: PMNode, index: number): void {
		state.write('<> ');
		state.renderInline(node);
		state.write('\n');

		if (index === parent.childCount - 1) {
			state.write('\n');
		}
	},
	layoutSection(state: MarkdownSerializerState, node: PMNode): void {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);

			state.render(child, node, i);
		}
	},
	layoutColumn(state: MarkdownSerializerState, node: PMNode): void {
		state.renderInline(node);
	},
	status(state: MarkdownSerializerState, node: PMNode): void {
		state.write(`*${node.attrs.text}*`);
	},
	panel(state: MarkdownSerializerState, node: PMNode): void {
		state.renderInline(node);
	},
	placeholder(state: MarkdownSerializerState, node: PMNode): void {
		state.write(node.attrs.text);
	},
	confluenceJiraIssue(state: MarkdownSerializerState, node: PMNode): void {
		state.write(` JIRA | ${node.attrs.issueKey} `);
	},
	...unsupportedNodes,
};

/**
 * Slack markdown does not have specific syntax for (sub|super)script, underline, text color.
 */
const unsupportedMarks = {
	subsup: {
		open: '',
		close: '',
	},
	underline: {
		open: '',
		close: '',
	},
	textColor: {
		open: '',
		close: '',
	},
	backgroundColor: {
		open: '',
		close: '',
	},
	typeAheadQuery: {
		open: '',
		close: '',
	},
	confluenceInlineComment: {
		open: '',
		close: '',
	},
	annotation: {
		open: '',
		close: '',
	},
	unsupportedMark: {
		open: '',
		close: '',
	},
};

export const marks: {
	annotation: {
		close: string;
		open: string;
	};
	backgroundColor: {
		close: string;
		open: string;
	};
	code: {
		close: string;
		escape: boolean;
		open: string;
	};
	confluenceInlineComment: {
		close: string;
		open: string;
	};
	em: {
		close: string;
		expelEnclosingWhitespace: boolean;
		mixable: boolean;
		open: string;
	};
	link: {
		close: string;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		open: (_state: MarkdownSerializerState, mark: any) => string;
	};
	strike: {
		close: string;
		expelEnclosingWhitespace: boolean;
		mixable: boolean;
		open: string;
	};
	strong: {
		close: string;
		expelEnclosingWhitespace: boolean;
		mixable: boolean;
		open: string;
	};
	subsup: {
		close: string;
		open: string;
	};
	textColor: {
		close: string;
		open: string;
	};
	typeAheadQuery: {
		close: string;
		open: string;
	};
	underline: {
		close: string;
		open: string;
	};
	unsupportedMark: {
		close: string;
		open: string;
	};
} = {
	em: { open: '_', close: '_', mixable: true, expelEnclosingWhitespace: true },
	strong: {
		open: '*',
		close: '*',
		mixable: true,
		expelEnclosingWhitespace: true,
	},
	strike: {
		open: '~',
		close: '~',
		mixable: true,
		expelEnclosingWhitespace: true,
	},
	link: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		open(_state: MarkdownSerializerState, mark: any): string {
			return '<' + mark.attrs.href + '|';
		},
		close: '>',
	},
	code: { open: '`', close: '`', escape: false },
	...unsupportedMarks,
};
