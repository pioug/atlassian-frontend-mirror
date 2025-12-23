import { closeBrackets } from '@codemirror/autocomplete';
import { syntaxHighlighting, bracketMatching } from '@codemirror/language';
import {
	Compartment,
	type Extension,
	Facet,
	EditorState as CodeMirrorState,
	type StateEffect,
} from '@codemirror/state';
import { EditorView as CodeMirror, lineNumbers, type ViewUpdate, gutters } from '@codemirror/view';
import type { IntlShape } from 'react-intl-next';

import { isCodeBlockWordWrapEnabled } from '@atlaskit/editor-common/code-block';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
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
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';
import { highlightStyle } from '../ui/syntaxHighlightingTheme';
import { cmTheme, codeFoldingTheme } from '../ui/theme';

// Store last observed heights of code blocks
const codeBlockHeights = new WeakMap<HTMLElement, number>();

import { syncCMWithPM } from './codemirrorSync/syncCMWithPM';
import { getCMSelectionChanges } from './codemirrorSync/updateCMSelection';
import { firstCodeBlockInDocument } from './extensions/firstCodeBlockInDocument';
import { foldGutterExtension, getCodeBlockFoldStateEffects } from './extensions/foldGutter';
import { keymapExtension } from './extensions/keymap';
import { manageSelectionMarker } from './extensions/manageSelectionMarker';
import { prosemirrorDecorationPlugin } from './extensions/prosemirrorDecorations';
import { tripleClickSelectAllExtension } from './extensions/tripleClickExtension';
import { LanguageLoader } from './languages/loader';

export interface ConfigProps {
	allowCodeFolding: boolean;
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
	extensions: Extension[];
	getIntl: () => IntlShape;
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
	private ro?: ResizeObserver;

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
		const { formatMessage } = config.getIntl();
		const formattedAriaLabel = formatMessage(blockTypeMessages.codeblock);

		const selectNode = () => {
			this.selectCodeBlockNode(undefined);
			this.view.focus();
		};

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
				// Goes before cmTheme to override styles
				config.allowCodeFolding ? [codeFoldingTheme] : [],
				cmTheme,
				syntaxHighlighting(highlightStyle),
				bracketMatching(),
				lineNumbers({
					domEventHandlers: {
						click: () => {
							selectNode();
							return true;
						},
					},
				}),
				// Explicitly disable "sticky" positioning on line numbers to match
				// Renderer behaviour
				gutters({ fixed: false }),
				CodeMirror.updateListener.of((update) => this.forwardUpdate(update)),
				this.readOnlyCompartment.of([
					CodeMirrorState.readOnly.of(!this.view.editable),
					CodeMirror.contentAttributes.of({ contentEditable: `${this.view.editable}` }),
				]),
				closeBrackets(),
				CodeMirror.editorAttributes.of({
					class: 'code-block',
					...(fg('platform_editor_adf_with_localid') && {
						'data-local-id': this.node.attrs.localId,
					}),
				}),
				manageSelectionMarker(config.api),
				prosemirrorDecorationPlugin(this.pmFacet, view, getPos),
				tripleClickSelectAllExtension(),
				firstCodeBlockInDocument(getPos),
				CodeMirror.contentAttributes.of({ 'aria-label': formattedAriaLabel }),
				config.allowCodeFolding
					? [foldGutterExtension({ selectNode, getNode: () => this.node })]
					: [],
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

		// Observe size changes of the CodeMirror DOM and request a measurement pass
		if (
			expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
			(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
				fg('platform_editor_content_mode_button_mvp'))
		) {
			this.ro = new ResizeObserver((entries) => {
				// Skip measurements when:
				// 1. Currently updating (prevents feedback loops)
				// 2. CodeMirror has focus (user is actively typing/editing)
				if (this.updating || this.cm.hasFocus) {
					return;
				}

				// Only trigger on height changes, not width or other dimension changes
				for (const entry of entries) {
					const currentHeight = entry.contentRect.height;
					const lastHeight = codeBlockHeights.get(this.cm.contentDOM);
					if (lastHeight !== undefined && lastHeight === currentHeight) {
						return;
					}
					codeBlockHeights.set(this.cm.contentDOM, currentHeight);
				}
				// CodeMirror to re-measure when its content size changes
				this.cm.requestMeasure();
			});
			this.ro.observe(this.cm.contentDOM);
		}

		// This flag is used to avoid an update loop between the outer and
		// inner editor
		this.updating = false;
		this.updateLanguage();
		this.updateLocalIdAttribute();
		this.wordWrappingEnabled = isCodeBlockWordWrapEnabled(node);

		// Restore fold state after initialization
		if (config.allowCodeFolding) {
			this.restoreFoldState();
		}
	}

	destroy(): void {
		// ED-27428: CodeMirror gets into an infinite loop as it detects mutations on removed
		// decorations. When we change the breakout we destroy the node and cleanup these decorations from
		// codemirror
		this.clearProseMirrorDecorations();
		this.cleanupDisabledState?.();
		if (
			expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
			(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
				fg('platform_editor_content_mode_button_mvp'))
		) {
			this.ro?.disconnect();
		}
	}

	forwardUpdate(update: ViewUpdate): void {
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

	setSelection(anchor: number, head: number): void {
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

	private updateLocalIdAttribute() {
		if (fg('platform_editor_adf_with_localid')) {
			const localId = this.node.attrs.localId;
			if (localId) {
				this.cm.dom.setAttribute('data-local-id', localId);
			} else {
				this.cm.dom.removeAttribute('data-local-id');
			}
		}
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

	private restoreFoldState() {
		this.updating = true;
		const effects = getCodeBlockFoldStateEffects({ node: this.node, cm: this.cm });
		if (effects) {
			this.cm.dispatch({ effects });
		}
		this.updating = false;
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
		this.updateLocalIdAttribute();
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
