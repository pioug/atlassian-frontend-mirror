import React from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';
import { keyName } from 'w3c-keyname';

import {
  GapCursorSelection,
  RelativeSelectionPos,
  Side,
} from '@atlaskit/editor-common/selection';
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
import { expandMessages } from '@atlaskit/editor-common/ui';
import { closestElement, isEmptyNode } from '@atlaskit/editor-common/utils';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type {
  DOMOutputSpec,
  Node as PmNode,
} from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import type {
  Decoration,
  EditorView,
  NodeView,
} from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { ExpandPlugin } from '../../types';
import {
  deleteExpandAtPos,
  setSelectionInsideExpand,
  toggleExpandExpanded,
  updateExpandTitle,
} from '../commands';
import { ExpandIconButton } from '../ui/ExpandIconButton';

function buildExpandClassName(type: string, expanded: boolean) {
  return `${expandClassNames.prefix} ${expandClassNames.type(type)} ${
    expanded ? expandClassNames.expanded : ''
  }`;
}

const toDOM = (
  node: PmNode,
  __livePage: boolean,
  intl?: IntlShape,
  titleReadOnly?: boolean,
  contentEditable?: boolean,
): DOMOutputSpec => [
  'div',
  {
    // prettier-ignore
    'class': buildExpandClassName(
      node.type.name,
      getBooleanFF('platform.editor.live-pages-expand-divergence') &&
        __livePage
        ? !node.attrs.__expanded
        : node.attrs.__expanded,
    ),
    'data-node-type': node.type.name,
    'data-title': node.attrs.title,
  },
  [
    'div',
    {
      // prettier-ignore
      'class': expandClassNames.titleContainer,
      contenteditable: 'false',
      // Element gains access to focus events.
      // This is needed to prevent PM gaining access
      // on interacting with our controls.
      tabindex: '-1',
    },
    // prettier-ignore
    ['div', { 'class': expandClassNames.icon }],
    [
      'div',
      {
        // prettier-ignore
        'class': expandClassNames.inputContainer,
      },
      [
        'input',
        {
          // prettier-ignore
          'class': expandClassNames.titleInput,
          value: node.attrs.title,
          placeholder:
            (intl &&
              intl.formatMessage(expandMessages.expandPlaceholderText)) ||
            expandMessages.expandPlaceholderText.defaultMessage,
          type: 'text',
          readonly:
            getBooleanFF(
              'platform.editor.live-view.disable-editing-in-view-mode_fi1rx',
            ) && titleReadOnly
              ? 'true'
              : undefined,
        },
      ],
    ],
  ],
  [
    'div',
    {
      // prettier-ignore
      class: expandClassNames.content,
      contenteditable:
        getBooleanFF(
          'platform.editor.live-view.disable-editing-in-view-mode_fi1rx',
        ) && contentEditable
          ? contentEditable
            ? 'true'
            : 'false'
          : undefined,
    },
    0,
  ],
];

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
    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      toDOM(
        node,
        this.__livePage,
        this.intl,
        api?.editorDisabled?.sharedState.currentState()?.editorDisabled,
      ),
    );
    this.allowInteractiveExpand = allowInteractiveExpand;
    this.getPos = getPos;
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.isMobile = isMobile;
    this.api = api;
    this.icon = this.dom.querySelector<HTMLElement>(
      `.${expandClassNames.icon}`,
    );
    this.input = this.dom.querySelector<HTMLInputElement>(
      `.${expandClassNames.titleInput}`,
    );
    this.titleContainer = this.dom.querySelector<HTMLElement>(
      `.${expandClassNames.titleContainer}`,
    );
    this.content = this.dom.querySelector<HTMLElement>(
      `.${expandClassNames.content}`,
    );
    this.renderIcon(this.intl);

    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.dom.addEventListener('click', this.handleClick);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.dom.addEventListener('input', this.handleInput);
    }

    if (this.input) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.addEventListener('keydown', this.handleTitleKeydown);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.addEventListener('blur', this.handleBlur);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.addEventListener('focus', this.handleInputFocus);
    }
    if (this.titleContainer) {
      // If the user interacts in our title bar (either toggle or input)
      // Prevent ProseMirror from getting a focus event (causes weird selection issues).
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.titleContainer.addEventListener('focus', this.handleFocus);
    }

    if (this.icon) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.icon.addEventListener('keydown', this.handleIconKeyDown);
    }

    if (
      this.api?.editorDisabled &&
      getBooleanFF(
        'platform.editor.live-view.disable-editing-in-view-mode_fi1rx',
      )
    ) {
      this.cleanUpEditorDisabledOnChange =
        this.api.editorDisabled.sharedState.onChange(sharedState => {
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
        });
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

  private renderIcon(intl?: IntlShape, node?: PmNode) {
    if (!this.icon) {
      return;
    }

    let { __expanded } = (node && node.attrs) || this.node.attrs;

    ReactDOM.render(
      <ExpandIconButton
        intl={intl}
        allowInteractiveExpand={this.allowInteractiveExpand}
        expanded={
          getBooleanFF('platform.editor.live-pages-expand-divergence') &&
          this.__livePage
            ? !__expanded
            : __expanded
        }
      ></ExpandIconButton>,
      this.icon,
    );
  }

  private handleClick = (event: Event) => {
    const pos = this.getPos();
    if (typeof pos !== 'number') {
      return;
    }

    const target = event.target as HTMLElement;
    const { state, dispatch } = this.view;

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
        nodeType: this.node.type,
        __livePage: this.__livePage,
      })(state, dispatch);
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
        __livePage: this.__livePage,
      })(state, dispatch);
    }
  };

  private handleFocus = (event: FocusEvent) => {
    event.stopImmediatePropagation();
  };

  private handleInputFocus = () => {
    this.decorationCleanup =
      this.api?.selectionMarker?.actions?.hideDecoration();
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
        this.deleteExpand(event);
        break;
    }
    // 'Ctrl-y', 'Mod-Shift-z');
    if ((event.ctrlKey && event.key === 'y') || ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')) {
      this.handleRedoFromTitle(event);
      return;
    }
    // 'Mod-z'
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      this.handleUndoFromTitle(event);
      return;
    }
  };

  private deleteExpand = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const pos = this.getPos();
    if (typeof pos !== 'number') {
      return;
    }
    const { selectionStart, selectionEnd } = this.input;

    if (selectionStart !== selectionEnd || selectionStart !== 0) {
      return;
    }

    const { state } = this.view;
    const expandNode = this.node;
    if (expandNode && isEmptyNode(state.schema)(expandNode)) {
      deleteExpandAtPos(this.api?.analytics?.actions)(pos, expandNode)(
        state,
        this.view.dispatch,
      );
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
        nodeType: this.node.type,
        __livePage: this.__livePage,
      })(state, dispatch);
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
    if (
      getBooleanFF('platform.editor.live-pages-expand-divergence') &&
      this.__livePage
    ) {
      return this.node.attrs.__expanded;
    }
    return !this.node.attrs.__expanded;
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
    if (selectionStart === selectionEnd && selectionStart === value.length) {
      const { state, dispatch } = this.view;
      event.preventDefault();
      this.view.focus();
      dispatch(
        state.tr.setSelection(
          new GapCursorSelection(
            state.doc.resolve(this.node.nodeSize + pos),
            Side.RIGHT,
          ),
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
      dispatch(
        state.tr.setSelection(
          new GapCursorSelection(state.doc.resolve(pos), Side.LEFT),
        ),
      );
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
    const contentEditable =
      getBooleanFF('platform.editor.live-pages-expand-divergence') &&
      this.__livePage
        ? !node.attrs.__expanded
        : node.attrs.__expanded;
    if (
      getBooleanFF(
        'platform.editor.live-view.disable-editing-in-view-mode_fi1rx',
      ) &&
      this.api &&
      this.api.editorDisabled
    ) {
      return (
        !this.api.editorDisabled.sharedState.currentState()?.editorDisabled &&
        contentEditable
      );
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

  ignoreMutation(
    mutationRecord: MutationRecord | { type: 'selection'; target: Element },
  ) {
    // ME-1931: Mobile relies on composition which creates dom mutations. If we ignore them, prosemirror
    // does not recognise the changes and reverts them.
    if (
      this.isMobile &&
      (mutationRecord.type === 'characterData' ||
        mutationRecord.type === 'childList')
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
      if (this.node.attrs.__expanded !== node.attrs.__expanded) {
        // Instead of re-rendering the view on an expand toggle
        // we toggle a class name to hide the content and animate the chevron.
        if (this.dom) {
          this.dom.classList.toggle(expandClassNames.expanded);
          this.renderIcon(this && this.intl, node);
        }

        if (this.content) {
          // Disallow interaction/selection inside when collapsed.
          this.content.setAttribute(
            'contenteditable',
            this.getContentEditable(node) ? 'true' : 'false',
          );
        }
      }

      // During a collab session the title doesn't sync with other users
      // since we're intentionally being less aggressive about re-rendering.
      // We also apply a rAF to avoid abrupt continuous replacement of the title.
      window.requestAnimationFrame(() => {
        if (this.input && this.node.attrs.title !== this.input.value) {
          this.input.value = this.node.attrs.title;
        }
      });

      this.node = node;
      return true;
    }
    return false;
  }

  destroy() {
    if (this.dom) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.dom.removeEventListener('click', this.handleClick);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.dom.removeEventListener('input', this.handleInput);
    }
    if (this.input) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.removeEventListener('keydown', this.handleTitleKeydown);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.removeEventListener('blur', this.handleBlur);
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.input.removeEventListener('focus', this.handleInputFocus);
    }

    if (this.titleContainer) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.titleContainer.removeEventListener('focus', this.handleFocus);
    }

    if (this.icon) {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      this.icon.removeEventListener('keydown', this.handleIconKeyDown);
      ReactDOM.unmountComponentAtNode(this.icon);
    }

    this.decorationCleanup?.();

    if (this.cleanUpEditorDisabledOnChange) {
      this.cleanUpEditorDisabledOnChange();
    }

    // @ts-ignore - [unblock prosemirror bump] reset non optional prop to undefined to clear reference
    this.dom = undefined;
    this.contentDOM = undefined;
    this.icon = undefined;
    this.input = undefined;
    this.titleContainer = undefined;
    this.content = undefined;
    this.cleanUpEditorDisabledOnChange = undefined;
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
