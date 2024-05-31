import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';
import { keyName } from 'w3c-keyname';

import { expandedState, isExpandCollapsed } from '@atlaskit/editor-common/expand';
import { GapCursorSelection, RelativeSelectionPos, Side } from '@atlaskit/editor-common/selection';
import type {
	SelectionSharedState,
	SetSelectionRelativeToNode,
} from '@atlaskit/editor-common/selection';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { closestElement, isEmptyNode } from '@atlaskit/editor-common/utils';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { ExpandPlugin } from '../../types';
import {
	deleteExpand,
	setSelectionInsideExpand,
	toggleExpandExpanded,
	updateExpandTitle,
} from '../commands';
import { buildExpandClassName, renderIcon, toDOM } from '../ui/NodeView';

export class ExpandNodeView implements NodeView {
	node: PmNode;
	view: EditorView;
	dom: HTMLElement;
	contentDOM?: HTMLElement;
	icon?: HTMLElement | null;
	input?: HTMLInputElement | null;
	titleContainer?: HTMLElement | null;
	content?: HTMLElement | null;
	getPos: getPosHandlerNode;
	intl: IntlShape;
	allowInteractiveExpand: boolean = true;
	isMobile: boolean = false;
	api: ExtractInjectionAPI<ExpandPlugin> | undefined;
	decorationCleanup?: () => boolean | undefined;

	constructor(
		node: PmNode,
		view: EditorView,
		getPos: getPosHandlerNode,
		getIntl: () => IntlShape,
		isMobile: boolean,
		private selectNearNode: SetSelectionRelativeToNode | undefined,
		api: ExtractInjectionAPI<ExpandPlugin> | undefined,
		allowInteractiveExpand: boolean = true,
		private __livePage = false,
		private cleanUpEditorDisabledOnChange?: () => void,
	) {
		this.intl = getIntl();

		this.allowInteractiveExpand = allowInteractiveExpand;
		this.getPos = getPos;
		this.view = view;
		this.node = node;
		const { dom, contentDOM } = DOMSerializer.renderSpec(
			document,
			toDOM(
				node,
				this.__livePage,
				this.intl,
				api?.editorDisabled?.sharedState.currentState()?.editorDisabled,
			),
		);
		this.dom = dom as HTMLElement;
		this.contentDOM = contentDOM as HTMLElement;
		this.isMobile = isMobile;
		this.api = api;
		this.icon = this.dom.querySelector<HTMLElement>(`.${expandClassNames.icon}`);
		this.input = this.dom.querySelector<HTMLInputElement>(`.${expandClassNames.titleInput}`);
		this.titleContainer = this.dom.querySelector<HTMLElement>(
			`.${expandClassNames.titleContainer}`,
		);

		this.content = this.dom.querySelector<HTMLElement>(`.${expandClassNames.content}`);

		if (!expandedState.has(this.node)) {
			expandedState.set(this.node, false);
		}

		renderIcon(this.icon, this.allowInteractiveExpand, !isExpandCollapsed(this.node), this.intl);

		if (!this.input || !this.titleContainer || !this.icon) {
			return;
		}

		// Add event listeners
		/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners*/
		this.dom.addEventListener('click', this.handleClick);
		this.dom.addEventListener('input', this.handleInput);
		this.input.addEventListener('keydown', this.handleTitleKeydown);
		this.input.addEventListener('blur', this.handleBlur);
		this.input.addEventListener('focus', this.handleInputFocus);
		// If the user interacts in our title bar (either toggle or input)
		// Prevent ProseMirror from getting a focus event (causes weird selection issues).
		this.titleContainer.addEventListener('focus', this.handleFocus);
		this.icon.addEventListener('keydown', this.handleIconKeyDown);

		if (
			this.api?.editorDisabled &&
			getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx')
		) {
			this.cleanUpEditorDisabledOnChange = this.api.editorDisabled.sharedState.onChange(
				(sharedState) => {
					const editorDisabled = sharedState.nextSharedState.editorDisabled;

					if (this.input) {
						if (editorDisabled) {
							this.input.setAttribute('readonly', 'true');
						} else {
							this.input.removeAttribute('readonly');
						}
					}

					if (this.content) {
						this.content.setAttribute(
							'contenteditable',
							this.getContentEditable(this.node) ? 'true' : 'false',
						);
					}
				},
			);
		}
	}

	private focusTitle = () => {
		if (this.input) {
			const { state, dispatch } = this.view;
			if (this.selectNearNode) {
				const tr = this.selectNearNode({
					selectionRelativeToNode: RelativeSelectionPos.Start,
				})(state);
				if (dispatch) {
					dispatch(tr);
				}
			}
			const pos = this.getPos();
			if (typeof pos === 'number') {
				setSelectionInsideExpand(pos)(state, dispatch, this.view);
			}
			this.input.focus();
		}
	};

	private handleIconKeyDown = (event: KeyboardEvent) => {
		switch (keyName(event)) {
			case 'Tab':
				event.preventDefault();
				this.focusTitle();
				break;
			case 'Enter':
				event.preventDefault();
				this.handleClick(event);
				break;
		}
	};

	private handleClick = (event: Event) => {
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}

		const target = event.target as HTMLElement;

		if (closestElement(target, `.${expandClassNames.icon}`)) {
			if (!this.allowInteractiveExpand) {
				return;
			}
			event.stopPropagation();

			// We blur the editorView, to prevent any keyboard showing on mobile
			// When we're interacting with the expand toggle
			if (this.view.dom instanceof HTMLElement) {
				this.view.dom.blur();
			}

			toggleExpandExpanded({
				editorAnalyticsAPI: this.api?.analytics?.actions,
				pos,
				node: this.node,
			})(this.view.state, this.view.dispatch);
			this.updateExpandToggleIcon(this.node);

			return;
		}

		if (target === this.input) {
			event.stopPropagation();
			this.focusTitle();
			return;
		}
	};

	private handleInput = (event: Event) => {
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}

		const target = event.target as HTMLInputElement;
		if (target === this.input) {
			event.stopPropagation();
			const { state, dispatch } = this.view;
			updateExpandTitle({
				title: target.value,
				pos,
				nodeType: this.node.type,
			})(state, dispatch);
		}
	};

	private handleFocus = (event: FocusEvent) => {
		event.stopImmediatePropagation();
	};

	private handleInputFocus = () => {
		this.decorationCleanup = this.api?.selectionMarker?.actions?.hideDecoration();
	};

	private handleBlur = () => {
		this.decorationCleanup?.();
	};

	private handleTitleKeydown = (event: KeyboardEvent) => {
		switch (keyName(event)) {
			case 'Enter':
				this.toggleExpand();
				break;
			case 'Tab':
			case 'ArrowDown':
				this.moveToOutsideOfTitle(event);
				break;
			case 'ArrowRight':
				this.handleArrowRightFromTitle(event);
				break;
			case 'ArrowLeft':
				this.handleArrowLeftFromTitle(event);
				break;
			case 'ArrowUp':
				this.setLeftGapCursor(event);
				break;
			case 'Backspace':
				this.deleteEmptyExpand();
				break;
		}
		// 'Ctrl-y', 'Mod-Shift-z');
		if (
			(event.ctrlKey && event.key === 'y') ||
			((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
		) {
			this.handleRedoFromTitle(event);
			return;
		}
		// 'Mod-z'
		if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
			this.handleUndoFromTitle(event);
			return;
		}
	};

	private deleteEmptyExpand = () => {
		const { state } = this.view;
		const expandNode = this.node;

		if (!this.input) {
			return;
		}
		const { selectionStart, selectionEnd } = this.input;
		if (selectionStart !== selectionEnd || selectionStart !== 0) {
			return;
		}

		if (expandNode && isEmptyNode(state.schema)(expandNode)) {
			deleteExpand(this.api?.analytics?.actions)(state, this.view.dispatch);
		}
	};

	private toggleExpand = () => {
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}

		if (this.allowInteractiveExpand) {
			const { state, dispatch } = this.view;
			toggleExpandExpanded({
				editorAnalyticsAPI: this.api?.analytics?.actions,
				pos,
				node: this.node,
			})(state, dispatch);
			this.updateExpandToggleIcon(this.node);
		}
	};

	private moveToOutsideOfTitle = (event: KeyboardEvent) => {
		event.preventDefault();
		const { state, dispatch } = this.view;
		const expandPos = this.getPos();
		if (typeof expandPos !== 'number') {
			return;
		}

		let pos = expandPos;
		if (this.isCollapsed()) {
			pos = expandPos + this.node.nodeSize;
		}
		const resolvedPos = state.doc.resolve(pos);
		if (!resolvedPos) {
			return;
		}

		if (
			this.isCollapsed() &&
			resolvedPos.nodeAfter &&
			['expand', 'nestedExpand'].indexOf(resolvedPos.nodeAfter.type.name) > -1
		) {
			return this.setRightGapCursor(event);
		}

		const sel = Selection.findFrom(resolvedPos, 1, true);
		if (sel) {
			// If the input has focus, ProseMirror doesn't
			// Give PM focus back before changing our selection
			this.view.focus();
			dispatch(state.tr.setSelection(sel));
		}
	};

	private isCollapsed = () => {
		return !expandedState.get(this.node);
	};

	private setRightGapCursor = (event: KeyboardEvent) => {
		if (!this.input) {
			return;
		}
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}
		const { value, selectionStart, selectionEnd } = this.input;

		const selectionStartExists = selectionStart !== null && selectionStart !== undefined;
		const selectionEndExists = selectionEnd !== null && selectionEnd !== undefined;
		const selectionStartInsideTitle =
			selectionStartExists && selectionStart >= 0 && selectionStart <= value.length;
		const selectionEndInsideTitle =
			selectionEndExists && selectionEnd >= 0 && selectionEnd <= value.length;

		if (selectionStartInsideTitle && selectionEndInsideTitle) {
			const { state, dispatch } = this.view;
			event.preventDefault();
			this.view.focus();
			dispatch(
				state.tr.setSelection(
					new GapCursorSelection(state.doc.resolve(this.node.nodeSize + pos), Side.RIGHT),
				),
			);
		}
	};

	private setLeftGapCursor = (event: KeyboardEvent) => {
		if (!this.input) {
			return;
		}
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}
		const { selectionStart, selectionEnd } = this.input;
		if (selectionStart === selectionEnd && selectionStart === 0) {
			event.preventDefault();
			const { state, dispatch } = this.view;
			this.view.focus();
			dispatch(state.tr.setSelection(new GapCursorSelection(state.doc.resolve(pos), Side.LEFT)));
		}
	};

	private handleArrowRightFromTitle = (event: KeyboardEvent) => {
		if (!this.input || !this.selectNearNode) {
			return;
		}
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}
		const { value, selectionStart, selectionEnd } = this.input;
		if (selectionStart === selectionEnd && selectionStart === value.length) {
			event.preventDefault();
			const { state, dispatch } = this.view;
			this.view.focus();
			const tr = this.selectNearNode({
				selectionRelativeToNode: RelativeSelectionPos.End,
				selection: NodeSelection.create(state.doc, pos),
			})(state);
			if (dispatch) {
				dispatch(tr);
			}
		}
	};

	private handleArrowLeftFromTitle = (event: KeyboardEvent) => {
		if (!this.input || !this.selectNearNode) {
			return;
		}
		const pos = this.getPos();
		if (typeof pos !== 'number') {
			return;
		}
		const { selectionStart, selectionEnd } = this.input;
		if (selectionStart === selectionEnd && selectionStart === 0) {
			event.preventDefault();
			const { state, dispatch } = this.view;
			this.view.focus();
			const selectionSharedState: SelectionSharedState =
				this.api?.selection?.sharedState.currentState() || {};
			// selectionRelativeToNode is undefined when user clicked to select node, then hit left to get focus in title
			// This is a special case where we want to bypass node selection and jump straight to gap cursor
			if (selectionSharedState?.selectionRelativeToNode === undefined) {
				const tr = this.selectNearNode({
					selectionRelativeToNode: undefined,
					selection: new GapCursorSelection(state.doc.resolve(pos), Side.LEFT),
				})(state);
				if (dispatch) {
					dispatch(tr);
				}
			} else {
				const tr = this.selectNearNode({
					selectionRelativeToNode: RelativeSelectionPos.Start,
					selection: NodeSelection.create(state.doc, pos),
				})(state);
				if (dispatch) {
					dispatch(tr);
				}
			}
		}
	};

	private handleUndoFromTitle = (event: KeyboardEvent) => {
		const { state, dispatch } = this.view;
		undo(state, dispatch);
		event.preventDefault();
		return;
	};

	private handleRedoFromTitle = (event: KeyboardEvent) => {
		const { state, dispatch } = this.view;
		redo(state, dispatch);
		event.preventDefault();
		return;
	};

	private getContentEditable = (node: PmNode): boolean => {
		const contentEditable = !isExpandCollapsed(node);
		if (
			getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx') &&
			this.api &&
			this.api.editorDisabled
		) {
			return !this.api.editorDisabled.sharedState.currentState()?.editorDisabled && contentEditable;
		}
		return contentEditable;
	};

	stopEvent(event: Event) {
		const target = event.target as HTMLElement;
		return (
			target === this.input ||
			target === this.icon ||
			!!closestElement(target, `.${expandClassNames.icon}`)
		);
	}

	ignoreMutation(mutationRecord: MutationRecord | { type: 'selection'; target: Element }) {
		// ME-1931: Mobile relies on composition which creates dom mutations. If we ignore them, prosemirror
		// does not recognise the changes and reverts them.
		if (
			this.isMobile &&
			(mutationRecord.type === 'characterData' || mutationRecord.type === 'childList')
		) {
			return false;
		}

		if (mutationRecord.type === 'selection') {
			return false;
		}
		return true;
	}

	update(node: PmNode, _decorations: readonly Decoration[]) {
		if (this.node.type === node.type) {
			// During a collab session the title doesn't sync with other users
			// since we're intentionally being less aggressive about re-rendering.
			// We also apply a rAF to avoid abrupt continuous replacement of the title.
			window.requestAnimationFrame(() => {
				if (this.input && this.node.attrs.title !== this.input.value) {
					this.input.value = this.node.attrs.title;
				}
			});

			// This checks if the node has been replaced with a different version
			// and updates the state of the new node to match the old one
			// Eg. typing in a node changes it to a new node so it must be updated
			// in the expandedState weak map
			if (this.node !== node) {
				const wasExpanded = expandedState.get(this.node);
				if (wasExpanded) {
					expandedState.set(node, wasExpanded);
				}
			}

			if (this.content) {
				// Disallow interaction/selection inside when collapsed.
				this.content.setAttribute(
					'contenteditable',
					this.getContentEditable(node) ? 'true' : 'false',
				);
			}

			this.node = node;
			this.updateExpandToggleIcon(this.node);
			return true;
		}
		return false;
	}

	updateExpandToggleIcon(node: PmNode) {
		const expanded = expandedState.get(node) ? expandedState.get(node) : false;
		if (this.dom && expanded !== undefined) {
			this.dom.className = buildExpandClassName(node.type.name, expanded);
			// Re-render the icon to update the aria-expanded attribute
			renderIcon(
				this.icon ? this.icon : null,
				this.allowInteractiveExpand,
				expandedState.get(node) ?? false,
				this.intl,
			);
		}
		this.updateExpandBodyContentEditable();
	}

	updateExpandBodyContentEditable() {
		// Disallow interaction/selection inside expand body when collapsed.
		if (this.content) {
			this.content.setAttribute('contenteditable', expandedState.get(this.node) ? 'true' : 'false');
		}
	}

	destroy() {
		if (!this.dom || !this.input || !this.titleContainer || !this.icon) {
			return;
		}

		this.dom.removeEventListener('click', this.handleClick);
		this.dom.removeEventListener('input', this.handleInput);
		this.input.removeEventListener('keydown', this.handleTitleKeydown);
		this.input.removeEventListener('blur', this.handleBlur);
		this.input.removeEventListener('focus', this.handleInputFocus);
		this.titleContainer.removeEventListener('focus', this.handleFocus);
		this.icon.removeEventListener('keydown', this.handleIconKeyDown);
		this.decorationCleanup?.();
		if (this.cleanUpEditorDisabledOnChange) {
			this.cleanUpEditorDisabledOnChange();
		}
		ReactDOM.unmountComponentAtNode(this.icon);
	}
}

export default function ({
	getIntl,
	isMobile,
	api,
	allowInteractiveExpand = true,
	__livePage,
}: {
	getIntl: () => IntlShape;
	isMobile: boolean;
	api: ExtractInjectionAPI<ExpandPlugin> | undefined;
	allowInteractiveExpand: boolean;
	__livePage: boolean;
}) {
	return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
		new ExpandNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			getIntl,
			isMobile,
			api?.selection?.actions?.selectNearNode,
			api,
			allowInteractiveExpand,
			__livePage,
		);
}
