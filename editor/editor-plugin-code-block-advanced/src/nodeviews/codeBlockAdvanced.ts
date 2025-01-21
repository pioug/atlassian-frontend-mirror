import { closeBrackets } from '@codemirror/autocomplete';
import { syntaxHighlighting } from '@codemirror/language';
import { Compartment, Extension, EditorSelection } from '@codemirror/state';
import { EditorView as CodeMirror, lineNumbers, ViewUpdate, gutters } from '@codemirror/view';

import { isCodeBlockWordWrapEnabled } from '@atlaskit/editor-common/code-block';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type {
	getPosHandler,
	getPosHandlerNode,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { EditorSelectionAPI } from '@atlaskit/editor-plugin-selection';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';
import { highlightStyle } from '../ui/syntaxHighlightingTheme';
import { cmTheme } from '../ui/theme';

import { syncCMWithPM } from './codemirrorSync/syncCMWithPM';
import { updateCMSelection } from './codemirrorSync/updateCMSelection';
import { bidiCharWarningExtension } from './extensions/bidiCharWarning';
import { keymapExtension } from './extensions/keymap';
import { LanguageLoader } from './languages/loader';

interface ConfigProps {
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
	extensions: Extension[];
}

// Based on: https://prosemirror.net/examples/codemirror/
class CodeBlockAdvancedNodeView implements NodeView {
	dom: Node;
	private updating: boolean;
	private view: EditorView;
	private lineWrappingCompartment = new Compartment();
	private languageCompartment = new Compartment();
	private readOnlyCompartment = new Compartment();
	private node: PMNode;
	private getPos: getPosHandlerNode;
	private cm: CodeMirror;
	private selectionAPI: EditorSelectionAPI | undefined;
	private maybeTryingToReachNodeSelection = false;
	private cleanupDisabledState: (() => void) | undefined;
	private languageLoader: LanguageLoader;

	// eslint-disable-next-line @typescript-eslint/max-params
	constructor(node: PMNode, view: EditorView, getPos: getPosHandlerNode, config: ConfigProps) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;
		this.selectionAPI = config.api?.selection?.actions;
		const getNode = () => this.node;
		const onMaybeNodeSelection = () => (this.maybeTryingToReachNodeSelection = true);
		this.cleanupDisabledState = config.api?.editorDisabled?.sharedState.onChange(() => {
			this.updateReadonlyState();
		});
		this.languageLoader = new LanguageLoader((lang) => {
			this.updating = true;
			this.cm.dispatch({
				effects: this.languageCompartment.reconfigure(lang),
			});
			this.updating = false;
		});

		this.cm = new CodeMirror({
			doc: this.node.textContent,
			extensions: [
				...config.extensions,
				this.lineWrappingCompartment.of([]),
				this.languageCompartment.of([]),
				keymapExtension({
					view,
					getPos,
					getNode,
					selectCodeBlockNode: this.selectCodeBlockNode.bind(this),
					onMaybeNodeSelection,
				}),
				cmTheme,
				syntaxHighlighting(highlightStyle),
				lineNumbers(),
				// Explicitly disable "sticky" positioning on line numbers to match
				// Renderer behaviour
				gutters({ fixed: false }),
				CodeMirror.updateListener.of((update) => this.forwardUpdate(update)),
				this.readOnlyCompartment.of(CodeMirror.editable.of(this.view.editable)),
				closeBrackets(),
				CodeMirror.editorAttributes.of({ class: 'code-block' }),
				bidiCharWarningExtension,
			],
		});

		// The editor's outer node is our DOM representation
		this.dom = this.cm.dom;

		// This flag is used to avoid an update loop between the outer and
		// inner editor
		this.updating = false;
		this.updateLanguage();
	}

	destroy() {
		this.cleanupDisabledState?.();
	}

	forwardUpdate(update: ViewUpdate) {
		if (this.updating || !this.cm.hasFocus) {
			return;
		}
		const offset = (this.getPos?.() ?? 0) + 1;

		syncCMWithPM({
			view: this.view,
			update,
			offset,
		});
	}

	setSelection(anchor: number, head: number) {
		if (!this.maybeTryingToReachNodeSelection) {
			this.cm.focus();
		}
		this.updating = true;
		this.cm.dispatch({ selection: { anchor, head } });
		this.updating = false;
	}

	private updateReadonlyState() {
		this.updating = true;
		this.cm.dispatch({
			effects: this.readOnlyCompartment.reconfigure(CodeMirror.editable.of(this.view.editable)),
		});
		this.updating = false;
	}

	private updateLanguage() {
		this.languageLoader.updateLanguage(this.node.attrs.language);
	}

	private selectCodeBlockNode(relativeSelectionPos: RelativeSelectionPos | undefined) {
		const tr = this.selectionAPI?.selectNearNode({
			selectionRelativeToNode: relativeSelectionPos,
			selection: NodeSelection.create(this.view.state.doc, this.getPos?.() ?? 0),
		})(this.view.state);
		if (tr) {
			this.view.dispatch(tr);
		}
	}

	private wordWrappingEnabled = false;

	private updateWordWrap(node: PMNode) {
		if (this.wordWrappingEnabled !== isCodeBlockWordWrapEnabled(node)) {
			this.updating = true;
			this.cm.dispatch({
				effects: [
					this.lineWrappingCompartment.reconfigure(
						isCodeBlockWordWrapEnabled(node) ? CodeMirror.lineWrapping : [],
					),
				],
			});
			this.updating = false;
			this.wordWrappingEnabled = !this.wordWrappingEnabled;
		}
	}

	update(node: PMNode) {
		this.maybeTryingToReachNodeSelection = false;

		if (node.type !== this.node.type) {
			return false;
		}
		this.updateWordWrap(node);
		this.node = node;
		if (this.updating) {
			return true;
		}
		this.updateLanguage();
		const newText = node.textContent,
			curText = this.cm.state.doc.toString();
		updateCMSelection(curText, newText, (tr) => {
			this.updating = true;
			this.cm.dispatch(tr);
			this.updating = false;
		});
		return true;
	}

	stopEvent(e: Event) {
		if (e instanceof MouseEvent && e.type === 'mousedown') {
			// !Warning: Side effect!
			// CodeMirror on blur updates the dom observer with a `setTimeout(..., 10);`
			// We need to select the nodeview after this has taken place to ensure
			// ProseMirror takes over
			// https://github.com/codemirror/view/commit/70a9a253df04a57004247b9463198c17832f92f4#diff-cb8cbffa623ff0975389e7e8c315e69d5e10345239ffe2c9b4b7986a56ad95efR720
			setTimeout(() => {
				// Ensure the CM selection is reset - if we have a ranged selection when we do node selection can
				// cause funky behaviour
				this.updating = true;
				this.cm.dispatch({
					selection: EditorSelection.create([EditorSelection.cursor(0)], 0),
				});
				this.updating = false;
				this.selectCodeBlockNode(undefined);
				this.view.focus();
			}, 20);
		}
		// If we have selected the node we should not stop these events
		if (
			e instanceof KeyboardEvent &&
			this.view.state.selection instanceof NodeSelection &&
			this.view.state.selection.from === this.getPos?.()
		) {
			return false;
		}
		return true;
	}
}

export const getCodeBlockAdvancedNodeView =
	(props: ConfigProps) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler): CodeBlockAdvancedNodeView => {
		return new CodeBlockAdvancedNodeView(node, view, getPos as getPosHandlerNode, props);
	};
