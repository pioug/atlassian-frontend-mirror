/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
import rafSchedule from 'raf-schd';

import { browser } from '@atlaskit/editor-common/browser';
import {
	codeBlockWrappedStates,
	defaultWordWrapState,
	transferCodeBlockWrappedValue,
} from '@atlaskit/editor-common/code-block';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import type { DOMOutputSpec, Node } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CodeBlockPlugin } from '../codeBlockPluginType';
import { resetShouldIgnoreFollowingMutations } from '../editor-commands';
import { getPluginState } from '../pm-plugins/main-state';
import { codeBlockClassNames } from '../ui/class-names';

const MATCH_NEWLINES = new RegExp('\n', 'g');

const toDOM = (node: Node, contentEditable: boolean, formattedAriaLabel: string) =>
	[
		'div',
		{ class: 'code-block' },
		['div', { class: codeBlockClassNames.start, contenteditable: 'false' }],
		[
			'div',
			{
				class: `${codeBlockClassNames.contentWrapper} ${fg('editor_support_code_block_wrapping') && codeBlockClassNames.contentWrapperFg}`,
			},
			[
				'div',
				{
					class: fg('editor_support_code_block_wrapping')
						? codeBlockClassNames.gutterFg
						: codeBlockClassNames.gutter,
					contenteditable: 'false',
				},
			],
			[
				'div',
				{
					class: fg('editor_support_code_block_wrapping')
						? `${codeBlockClassNames.contentFg}`
						: codeBlockClassNames.content,
				},
				[
					'code',
					{
						'data-language': node.attrs.language || '',
						spellcheck: 'false',
						contenteditable: contentEditable ? 'true' : 'false',
						'data-testid': 'code-block--code',
						'aria-label': formattedAriaLabel,
					},
					0,
				],
			],
		],
		['div', { class: codeBlockClassNames.end, contenteditable: 'false' }],
	] as DOMOutputSpec;

export class CodeBlockView {
	node: Node;
	dom: HTMLElement;
	contentDOM: HTMLElement;
	lineNumberGutter: HTMLElement;
	getPos: getPosHandlerNode;
	view: EditorView;
	formattedAriaLabel: string = '';
	api?: ExtractInjectionAPI<CodeBlockPlugin>;

	constructor(
		node: Node,
		view: EditorView,
		getPos: getPosHandlerNode,
		formattedAriaLabel: string,
		api?: ExtractInjectionAPI<CodeBlockPlugin>,
		private cleanupEditorDisabledListener?: () => void,
	) {
		const { dom, contentDOM } = DOMSerializer.renderSpec(
			document,
			toDOM(
				node,
				!api?.editorDisabled?.sharedState.currentState()?.editorDisabled,
				formattedAriaLabel,
			),
		);
		this.getPos = getPos;
		this.view = view;
		this.node = node;
		this.dom = dom as HTMLElement;
		this.contentDOM = contentDOM as HTMLElement;
		this.lineNumberGutter = this.dom.querySelector(
			`.${fg('editor_support_code_block_wrapping') ? codeBlockClassNames.gutterFg : codeBlockClassNames.gutter}`,
		) as HTMLElement;
		this.api = api;

		if (fg('editor_support_code_block_wrapping')) {
			this.maintainDynamicGutterSize();

			// Ensure the code block node has a wrapped state.
			// Wrapped state may already exist from breakout's recreating the node.
			if (!codeBlockWrappedStates.has(node)) {
				codeBlockWrappedStates.set(node, defaultWordWrapState);
			}
		} else {
			this.ensureLineNumbers();
		}
		this.handleEditorDisabledChanged();
	}

	handleEditorDisabledChanged() {
		if (this.api?.editorDisabled) {
			this.cleanupEditorDisabledListener = this.api.editorDisabled.sharedState.onChange(
				(sharedState) => {
					if (this.contentDOM) {
						this.contentDOM.setAttribute(
							'contenteditable',
							sharedState.nextSharedState.editorDisabled ? 'false' : 'true',
						);
					}
				},
			);
		}
	}

	updateDOMAndSelection(savedInnerHTML: string, newCursorPosition: number) {
		if (this.dom?.childNodes && this.dom.childNodes.length > 1) {
			const contentWrapper = this.dom.childNodes[1];
			const contentView = contentWrapper?.childNodes[1];

			if (contentView?.childNodes?.length > 0) {
				const codeElement = contentView.firstChild as HTMLElement;
				codeElement.innerHTML = savedInnerHTML;

				// We need to set cursor for the DOM update
				const textElement = Array.from(codeElement.childNodes).find(
					(child) => child.nodeName === '#text',
				) as Text;

				const sel = window.getSelection();
				const range = document.createRange();
				range.setStart(textElement, newCursorPosition);
				range.collapse(true);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
		}
	}

	coalesceDOMElements() {
		if (this.dom?.childNodes && this.dom.childNodes.length > 1) {
			const contentWrapper = this.dom.childNodes[1];
			const contentView = contentWrapper?.childNodes[1];

			if (contentView?.childNodes && contentView.childNodes.length > 1) {
				let savedInnerHTML = '';
				while (contentView.childNodes.length > 1) {
					const lastChild = contentView.lastChild as HTMLElement;
					savedInnerHTML = lastChild.innerHTML + savedInnerHTML;

					contentView.removeChild(lastChild);
				}

				const firstChild = contentView.firstChild as HTMLElement;
				savedInnerHTML = firstChild.innerHTML + '\n' + savedInnerHTML;
				const newCursorPosition = firstChild.innerHTML.length + 1;

				setTimeout(this.updateDOMAndSelection.bind(this, savedInnerHTML, newCursorPosition), 20);
			}
		}
	}

	private ensureLineNumbers = rafSchedule(() => {
		let lines = 1;
		this.node.forEach((node) => {
			const text = node.text;
			if (text) {
				lines += (node.text!.match(MATCH_NEWLINES) || []).length;
			}
		});

		while (this.lineNumberGutter.childElementCount < lines) {
			this.lineNumberGutter.appendChild(document.createElement('span'));
		}
		while (this.lineNumberGutter.childElementCount > lines) {
			this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!);
		}
	});

	/**
	 * As the code block updates we get the maximum amount of digits in a line number and expand the number gutter to reflect this.
	 */
	private maintainDynamicGutterSize = () => {
		let totalLineCount = 1;
		this.node.forEach((node) => {
			const text = node.text;
			if (text) {
				totalLineCount += (node.text!.match(MATCH_NEWLINES) || []).length;
			}
		});

		const maxDigits = totalLineCount.toString().length;

		this.dom.style.setProperty('--lineNumberGutterWidth', `${maxDigits}ch`);
	};

	update(node: Node) {
		if (node.type !== this.node.type) {
			return false;
		}
		if (node !== this.node) {
			if (fg('editor_support_code_block_wrapping')) {
				if (!fg('editor_code_block_wrapping_language_change_bug')) {
					transferCodeBlockWrappedValue(this.node, node);
				}
			}

			if (node.attrs.language !== this.node.attrs.language) {
				this.contentDOM.setAttribute('data-language', node.attrs.language || '');
			}
			this.node = node;

			if (fg('editor_support_code_block_wrapping')) {
				this.maintainDynamicGutterSize();
			} else {
				this.ensureLineNumbers();
			}

			if (browser.android) {
				this.coalesceDOMElements();
				resetShouldIgnoreFollowingMutations(this.view.state, this.view.dispatch);
			}
		}
		return true;
	}

	ignoreMutation(record: MutationRecord | { type: 'selection'; target: Element }) {
		const pluginState = getPluginState(this.view.state);
		if (pluginState?.shouldIgnoreFollowingMutations) {
			return true;
		}

		// Ensure updating the line-number gutter doesn't trigger reparsing the codeblock
		return (
			record.target === this.lineNumberGutter || record.target.parentNode === this.lineNumberGutter
		);
	}

	destroy() {
		if (this.cleanupEditorDisabledListener) {
			this.cleanupEditorDisabledListener();
		}
		this.cleanupEditorDisabledListener = undefined;
	}
}

export const codeBlockNodeView = (
	node: Node,
	view: EditorView,
	getPos: getPosHandler,
	formattedAriaLabel: string,
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined,
) => new CodeBlockView(node, view, getPos as getPosHandlerNode, formattedAriaLabel, api);
