import rafSchedule from 'raf-schd';

import { transferCodeBlockWrappedValue } from '@atlaskit/editor-common/code-block';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { browser } from '@atlaskit/editor-common/utils';
import type { DOMOutputSpec, Node } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { resetShouldIgnoreFollowingMutations } from '../actions';
import type { CodeBlockPlugin } from '../plugin';
import { getPluginState } from '../pm-plugins/main-state';
import { codeBlockClassNames } from '../ui/class-names';

const MATCH_NEWLINES = new RegExp('\n', 'g');

const toDOM = (node: Node, contentEditable: boolean) =>
	[
		'div',
		{ class: 'code-block' },
		['div', { class: codeBlockClassNames.start, contenteditable: 'false' }],
		[
			'div',
			{ class: codeBlockClassNames.contentWrapper },
			[
				'div',
				{
					class: fg('editor_support_code_block_wrapping')
						? codeBlockClassNames.gutterFgWrap
						: codeBlockClassNames.gutter,
					contenteditable: 'false',
				},
			],
			[
				'div',
				{ class: codeBlockClassNames.content },
				[
					'code',
					{
						'data-language': node.attrs.language || '',
						spellcheck: 'false',
						contenteditable: fg('platform.editor.live-view.disable-editing-in-view-mode_fi1rx')
							? contentEditable
								? 'true'
								: 'false'
							: 'true',
						'data-testid': 'code-block--code',
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
	api?: ExtractInjectionAPI<CodeBlockPlugin>;

	constructor(
		node: Node,
		view: EditorView,
		getPos: getPosHandlerNode,
		api?: ExtractInjectionAPI<CodeBlockPlugin>,
		private cleanupEditorDisabledListener?: () => void,
	) {
		const { dom, contentDOM } = DOMSerializer.renderSpec(
			document,
			toDOM(node, !api?.editorDisabled?.sharedState.currentState()?.editorDisabled),
		);
		this.getPos = getPos;
		this.view = view;
		this.node = node;
		this.dom = dom as HTMLElement;
		this.contentDOM = contentDOM as HTMLElement;
		this.lineNumberGutter = this.dom.querySelector(
			`.${fg('editor_support_code_block_wrapping') ? codeBlockClassNames.gutterFgWrap : codeBlockClassNames.gutter}`,
		) as HTMLElement;
		this.api = api;

		if (!fg('editor_support_code_block_wrapping')) {
			this.ensureLineNumbers();
		}
		this.handleEditorDisabledChanged();
	}

	handleEditorDisabledChanged() {
		if (
			this.api?.editorDisabled &&
			fg('platform.editor.live-view.disable-editing-in-view-mode_fi1rx')
		) {
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

	update(node: Node) {
		if (node.type !== this.node.type) {
			return false;
		}
		if (node !== this.node) {
			if (fg('editor_support_code_block_wrapping')) {
				transferCodeBlockWrappedValue(this.node, node);
			}

			if (node.attrs.language !== this.node.attrs.language) {
				this.contentDOM.setAttribute('data-language', node.attrs.language || '');
			}
			this.node = node;

			if (!fg('editor_support_code_block_wrapping')) {
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
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined,
) => new CodeBlockView(node, view, getPos as getPosHandlerNode, api);
