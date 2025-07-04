import { closeBrackets } from '@codemirror/autocomplete';
import { syntaxHighlighting, bracketMatching } from '@codemirror/language';
import {
	Compartment,
	type Extension,
	EditorSelection,
	Facet,
	EditorState as CodeMirrorState,
	type StateEffect,
} from '@codemirror/state';
import { EditorView as CodeMirror, lineNumbers, type ViewUpdate, gutters } from '@codemirror/view';

import { isCodeBlockWordWrapEnabled } from '@atlaskit/editor-common/code-block';
import { type RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type {
	getPosHandler,
	getPosHandlerNode,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { type EditorSelectionAPI } from '@atlaskit/editor-plugin-selection';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';
import { highlightStyle } from '../ui/syntaxHighlightingTheme';
import { cmTheme } from '../ui/theme';

import { syncCMWithPM } from './codemirrorSync/syncCMWithPM';
import { getCMSelectionChanges } from './codemirrorSync/updateCMSelection';
import { firstCodeBlockInDocument } from './extensions/firstCodeBlockInDocument';
import { keymapExtension } from './extensions/keymap';
import { manageSelectionMarker } from './extensions/manageSelectionMarker';
import { prosemirrorDecorationPlugin } from './extensions/prosemirrorDecorations';
import { tripleClickSelectAllExtension } from './extensions/tripleClickExtension';
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
	private pmDecorationsCompartment = new Compartment();
	private node: PMNode;
	private getPos: getPosHandlerNode;
	private cm: CodeMirror;
	private selectionAPI: EditorSelectionAPI | undefined;
	private maybeTryingToReachNodeSelection = false;
	private cleanupDisabledState: (() => void) | undefined;
	private languageLoader: LanguageLoader;
	private pmFacet = Facet.define<DecorationSource>();

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandlerNode,
		innerDecorations: DecorationSource,
		config: ConfigProps,
	) {
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
				this.lineWrappingCompartment.of(
					isCodeBlockWordWrapEnabled(node) ? CodeMirror.lineWrapping : [],
				),
				this.languageCompartment.of([]),
				this.pmDecorationsCompartment.of(this.pmFacet.compute([], () => innerDecorations)),
				keymapExtension({
					view,
					getPos,
					getNode,
					selectCodeBlockNode: this.selectCodeBlockNode.bind(this),
					onMaybeNodeSelection,
					customFindReplace: Boolean(config.api?.findReplace),
				}),
				cmTheme,
				syntaxHighlighting(highlightStyle),
				bracketMatching(),
				lineNumbers(),
				// Explicitly disable "sticky" positioning on line numbers to match
				// Renderer behaviour
				gutters({ fixed: false }),
				CodeMirror.updateListener.of((update) => this.forwardUpdate(update)),
				this.readOnlyCompartment.of([
					CodeMirrorState.readOnly.of(!this.view.editable),
					CodeMirror.contentAttributes.of({ contentEditable: `${this.view.editable}` }),
				]),
				closeBrackets(),
				CodeMirror.editorAttributes.of({ class: 'code-block' }),
				manageSelectionMarker(config.api),
				prosemirrorDecorationPlugin(this.pmFacet, view, getPos),
				tripleClickSelectAllExtension(),
				firstCodeBlockInDocument(getPos),
			],
		});

		// We append an additional element that fixes a selection bug on chrome if the code block
		// is the first element followed by subsequent code blocks
		const spaceContainer = document.createElement('span');
		spaceContainer.innerText = ZERO_WIDTH_SPACE;
		spaceContainer.style.height = '0';
		// The editor's outer node is our DOM representation
		this.dom = this.cm.dom;
		this.dom.appendChild(spaceContainer);

		// This flag is used to avoid an update loop between the outer and
		// inner editor
		this.updating = false;
		this.updateLanguage();
		this.wordWrappingEnabled = isCodeBlockWordWrapEnabled(node);
	}

	destroy() {
		// ED-27428: CodeMirror gets into an infinite loop as it detects mutations on removed
		// decorations. When we change the breakout we destroy the node and cleanup these decorations from
		// codemirror
		this.clearProseMirrorDecorations();
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
			effects: this.readOnlyCompartment.reconfigure([
				CodeMirrorState.readOnly.of(!this.view.editable),
				CodeMirror.contentAttributes.of({ contentEditable: `${this.view.editable}` }),
			]),
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

	private getWordWrapEffects(node: PMNode) {
		if (this.wordWrappingEnabled !== isCodeBlockWordWrapEnabled(node)) {
			this.wordWrappingEnabled = !this.wordWrappingEnabled;
			return this.lineWrappingCompartment.reconfigure(
				isCodeBlockWordWrapEnabled(node) ? CodeMirror.lineWrapping : [],
			);
		}
		return undefined;
	}

	update(node: PMNode, _: readonly Decoration[], innerDecorations: DecorationSource) {
		this.maybeTryingToReachNodeSelection = false;

		if (node.type !== this.node.type) {
			return false;
		}
		this.node = node;
		if (this.updating) {
			return true;
		}
		this.updateLanguage();
		const newText = node.textContent,
			curText = this.cm.state.doc.toString();

		// Updates bundled for performance (to avoid multiple-dispatches)
		const changes = getCMSelectionChanges(curText, newText);
		const wordWrapEffect = this.getWordWrapEffects(node);
		const prosemirrorDecorationsEffect = this.getProseMirrorDecorationEffects(innerDecorations);
		if (changes || wordWrapEffect || prosemirrorDecorationsEffect) {
			this.updating = true;
			this.cm.dispatch({
				effects: [wordWrapEffect, prosemirrorDecorationsEffect].filter(
					(effect): effect is StateEffect<unknown> => !!effect,
				),
				changes,
			});
			this.updating = false;
		}
		return true;
	}

	/**
	 * Updates a facet which stores information on the prosemirror decorations
	 *
	 * This then gets translated to codemirror decorations in `prosemirrorDecorationPlugin`
	 * @param decorationSource
	 * @example
	 */
	private getProseMirrorDecorationEffects(decorationSource: DecorationSource) {
		const computedFacet = this.pmFacet.compute([], () => decorationSource);
		return this.pmDecorationsCompartment.reconfigure(computedFacet);
	}

	private clearProseMirrorDecorations() {
		this.updating = true;
		const computedFacet = this.pmFacet.compute([], () => DecorationSet.empty);
		this.cm.dispatch({
			effects: this.pmDecorationsCompartment.reconfigure(computedFacet),
		});
		this.updating = false;
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
			(e instanceof KeyboardEvent || e instanceof ClipboardEvent) &&
			this.view.state.selection instanceof NodeSelection &&
			this.view.state.selection.from === this.getPos?.()
		) {
			return false;
		}

		if (
			e instanceof DragEvent &&
			e.type === 'dragenter' &&
			expValEqualsNoExposure('platform_editor_block_controls_perf_optimization', 'isEnabled', true)
		) {
			return false; // Allow dragenter to propagate so that the editor can handle it
		}

		return true;
	}
}

export const getCodeBlockAdvancedNodeView =
	(props: ConfigProps) =>
	(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		innerDecorations: DecorationSource,
	): CodeBlockAdvancedNodeView => {
		return new CodeBlockAdvancedNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			innerDecorations,
			props,
		);
	};
