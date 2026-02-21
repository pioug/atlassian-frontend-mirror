import type { NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { TextDefinition as Text } from './text';
import type { BreakoutMarkDefinition } from '../marks/breakout';
import type { MarksObject, NoMark } from './types/mark';
import { codeBlock as codeBlockFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';

export type CodeBlockBaseDefinition = {
	attrs?: CodeBlockAttrs;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedInline true
	 */
	content?: Array<Text & NoMark>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'codeBlock';
};

export type CodeBlockAttrs = {
	language?: string;
	localId?: string;
	uniqueId?: string;
};

/**
 * @name codeBlock_with_no_marks_node
 */
export type CodeBlockDefinition = CodeBlockBaseDefinition & NoMark;

/**
 * @name codeBlock_node
 */
export type CodeBlockWithMarksDefinition = CodeBlockBaseDefinition &
	MarksObject<BreakoutMarkDefinition>;

const getLanguageFromEditorStyle = (dom: HTMLElement): string | undefined => {
	return dom.getAttribute('data-language') || undefined;
};

// example of BB style:
// <div class="codehilite language-javascript"><pre><span>hello world</span><span>\n</span></pre></div>
const getLanguageFromBitbucketStyle = (dom: HTMLElement): string | undefined => {
	if (dom && dom.classList.contains('codehilite')) {
		// code block html from Bitbucket always contains an extra new line
		return extractLanguageFromClass(dom.className);
	}
	return;
};

// If there is a child code element, check that for data-language
const getLanguageFromCode = (dom: HTMLElement): string | undefined => {
	const firstChild = dom.firstElementChild;
	if (firstChild && firstChild.nodeName === 'CODE') {
		return firstChild.getAttribute('data-language') || undefined;
	}
};

const extractLanguageFromClass = (className: string): string | undefined => {
	// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
	const languageRegex = /(?:^|\s)language-([^\s]+)/u;
	const result = languageRegex.exec(className);
	if (result && result[1]) {
		return result[1];
	}
	return;
};

const removeLastNewLine = (dom: HTMLElement): HTMLElement => {
	const parent = dom && dom.parentElement;
	if (parent && parent.classList.contains('codehilite')) {
		// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		dom.textContent = dom.textContent!.replace(/\n$/u, '');
	}
	return dom;
};

function parseCodeFromHtml(node: Node) {
	let code = '';
	node.childNodes.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			// append text
			code += child.nodeValue;
		} else if (child.nodeType === Node.ELEMENT_NODE && child instanceof Element) {
			const tagName = child.tagName.toLowerCase();
			if (tagName === 'div' || tagName === 'p') {
				// add a newline before its content, unless it's the first child to avoid leading newlines
				if (child.previousElementSibling !== null) {
					code += '\n';
				}
			}
			if (tagName === 'br') {
				code += '\n';
			} else {
				code += parseCodeFromHtml(child);
			}
		}
	});
	return code;
}

export const codeBlock: NodeSpec = codeBlockFactory({
	parseDOM: [
		{
			tag: 'pre',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				let dom = domNode as HTMLElement;
				const language =
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					getLanguageFromBitbucketStyle(dom.parentElement!) ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					getLanguageFromEditorStyle(dom.parentElement!) ||
					getLanguageFromCode(dom) ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					dom.getAttribute('data-language')!;
				dom = removeLastNewLine(dom);
				return { language };
			},
		},
		// Handle VSCode, Android Studio paste
		// Checking `white-space: pre-wrap` is too aggressive @see ED-2627
		{
			tag: 'div[style]',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				if (
					dom.style.whiteSpace === 'pre' ||
					(dom.style.fontFamily && dom.style.fontFamily.toLowerCase().indexOf('monospace') > -1)
				) {
					return {};
				}
				return false;
			},
			getContent: (domNode, schema) => {
				const code = parseCodeFromHtml(domNode);
				return code ? Fragment.from(schema.text(code)) : Fragment.empty;
			},
		},
		// Handle GitHub/Gist paste
		{
			tag: 'table[style]',
			preserveWhitespace: 'full',
			getAttrs: (dom) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				if ((dom as HTMLElement).querySelector('td[class*="blob-code"]')) {
					return {};
				}
				return false;
			},
		},
		{
			tag: 'div.code-block',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				// TODO: ED-5604 - Fix it inside `react-syntax-highlighter`
				// Remove line numbers
				const lineNumber = dom.querySelectorAll('.react-syntax-highlighter-line-number');

				if (lineNumber.length > 0) {
					// It's possible to copy without the line numbers too hence this
					// `react-syntax-highlighter-line-number` check, so that we don't remove real code
					lineNumber.forEach((line) => line.remove());
				}
				return {};
			},
		},
	],
	toDOM(node) {
		return ['pre', ['code', { 'data-language': node.attrs.language }, 0]];
	},
});

export const toJSON = (
	node: PMNode,
): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Record<string, any>;
} => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: Object.keys(node.attrs).reduce<Record<string, any>>((memo, key) => {
		if (key === 'uniqueId') {
			return memo;
		}

		if (key === 'language' && node.attrs.language === null) {
			return memo;
		}

		memo[key] = node.attrs[key];
		return memo;
	}, {}),
});

export const codeBlockWithLocalId: NodeSpec = codeBlockFactory({
	parseDOM: [
		{
			tag: 'pre',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				let dom = domNode as HTMLElement;
				const language =
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					getLanguageFromBitbucketStyle(dom.parentElement!) ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					getLanguageFromEditorStyle(dom.parentElement!) ||
					getLanguageFromCode(dom) ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					dom.getAttribute('data-language')!;
				dom = removeLastNewLine(dom);
				return { language, localId: uuid.generate() };
			},
		},
		// Handle VSCode, Android Studio paste
		// Checking `white-space: pre-wrap` is too aggressive @see ED-2627
		{
			tag: 'div[style]',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				if (
					dom.style.whiteSpace === 'pre' ||
					(dom.style.fontFamily && dom.style.fontFamily.toLowerCase().indexOf('monospace') > -1)
				) {
					return {};
				}
				return false;
			},
			getContent: (domNode, schema) => {
				const code = parseCodeFromHtml(domNode);
				return code ? Fragment.from(schema.text(code)) : Fragment.empty;
			},
		},
		// Handle GitHub/Gist paste
		{
			tag: 'table[style]',
			preserveWhitespace: 'full',
			getAttrs: (dom) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				if ((dom as HTMLElement).querySelector('td[class*="blob-code"]')) {
					return {};
				}
				return false;
			},
		},
		{
			tag: 'div.code-block',
			preserveWhitespace: 'full',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				// TODO: ED-5604 - Fix it inside `react-syntax-highlighter`
				// Remove line numbers
				const lineNumber = dom.querySelectorAll('.react-syntax-highlighter-line-number');

				if (lineNumber.length > 0) {
					// It's possible to copy without the line numbers too hence this
					// `react-syntax-highlighter-line-number` check, so that we don't remove real code
					lineNumber.forEach((line) => line.remove());
				}
				return {};
			},
		},
	],
	toDOM(node) {
		const attrs: Record<string, string> = {};
		if (node?.attrs?.localId !== undefined) {
			attrs['data-local-id'] = node.attrs.localId;
		}
		return ['pre', attrs, ['code', { 'data-language': node.attrs.language }, 0]];
	},
});
