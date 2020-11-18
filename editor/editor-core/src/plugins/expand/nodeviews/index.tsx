import React from 'react';
import ReactDOM from 'react-dom';
import { InjectedIntl } from 'react-intl';
import { EditorView, NodeView, Decoration } from 'prosemirror-view';
import { Selection, NodeSelection } from 'prosemirror-state';
import { ExpandIconButton } from '../ui/ExpandIconButton';
import { keyName } from 'w3c-keyname';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';
import { expandMessages } from '@atlaskit/editor-common';

import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { isEmptyNode } from '../../../utils';
import {
  updateExpandTitle,
  toggleExpandExpanded,
  deleteExpandAtPos,
  setSelectionInsideExpand,
} from '../commands';
import { expandClassNames } from '../ui/class-names';
import {
  GapCursorSelection,
  Side,
} from '../../../plugins/selection/gap-cursor-selection';
import { getFeatureFlags } from '../../feature-flags-context';
import { closestElement } from '../../../utils/dom';
import { RelativeSelectionPos } from '../../selection/types';
import { setSelectionRelativeToNode } from '../../selection/commands';
import { getPluginState as getSelectionPluginState } from '../../selection/plugin-factory';

function buildExpandClassName(type: string, expanded: boolean) {
  return `${expandClassNames.prefix} ${expandClassNames.type(type)} ${
    expanded ? expandClassNames.expanded : ''
  }`;
}

const toDOM = (node: PmNode, intl?: InjectedIntl): DOMOutputSpec => [
  'div',
  {
    // prettier-ignore
    'class': buildExpandClassName(node.type.name, node.attrs.__expanded),
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
        },
      ],
    ],
  ],
  // prettier-ignore
  ['div', { 'class': expandClassNames.content }, 0],
];

type ReactContext = { [key: string]: any } | undefined;
type ReactContextFn = () => ReactContext;

export class ExpandNodeView implements NodeView {
  node: PmNode;
  view: EditorView;
  dom?: HTMLElement;
  contentDOM?: HTMLElement;
  icon?: HTMLElement | null;
  input?: HTMLInputElement | null;
  titleContainer?: HTMLElement | null;
  content?: HTMLElement | null;
  getPos: getPosHandlerNode;
  pos: number;
  reactContext: ReactContext;
  allowInteractiveExpand: boolean = true;

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: getPosHandlerNode,
    reactContext: ReactContextFn,
  ) {
    this.reactContext = reactContext() || {};
    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      toDOM(node, this.reactContext.intl),
    );
    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
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
    this.renderIcon(this.reactContext.intl);

    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
      this.dom.addEventListener('input', this.handleInput);
    }

    if (this.input) {
      this.input.addEventListener('keydown', this.handleTitleKeydown);
    }
    if (this.titleContainer) {
      // If the user interacts in our title bar (either toggle or input)
      // Prevent ProseMirror from getting a focus event (causes weird selection issues).
      this.titleContainer.addEventListener('focus', this.handleFocus);
    }

    if (this.icon) {
      this.icon.addEventListener('keydown', this.handleIconKeyDown);
    }
  }

  private focusTitle = () => {
    if (this.input) {
      const { state, dispatch } = this.view;
      setSelectionRelativeToNode(RelativeSelectionPos.Start)(state, dispatch);
      setSelectionInsideExpand(state, dispatch, this.view);
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

  private renderIcon(intl?: InjectedIntl, node?: PmNode) {
    if (!this.icon) {
      return;
    }

    const { __expanded } = (node && node.attrs) || this.node.attrs;
    ReactDOM.render(
      <ExpandIconButton
        allowInteractiveExpand={this.isAllowInteractiveExpandEnabled()}
        expanded={__expanded}
      ></ExpandIconButton>,
      this.icon,
    );
  }

  private isAllowInteractiveExpandEnabled = () => {
    const { state } = this.view;
    const featureFlags = getFeatureFlags(state);
    return featureFlags && !!featureFlags.interactiveExpand;
  };

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const { state, dispatch } = this.view;

    if (closestElement(target, `.${expandClassNames.icon}`)) {
      if (!this.isAllowInteractiveExpandEnabled()) {
        return;
      }
      event.stopPropagation();

      // We blur the editorView, to prevent any keyboard showing on mobile
      // When we're interacting with the expand toggle
      if (this.view.dom instanceof HTMLElement) {
        this.view.dom.blur();
      }

      toggleExpandExpanded(this.getPos(), this.node.type)(state, dispatch);
      return;
    }

    if (target === this.input) {
      event.stopPropagation();
      this.focusTitle();
      return;
    }
  };

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target === this.input) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      updateExpandTitle(
        target.value,
        this.getPos(),
        this.node.type,
      )(state, dispatch);
    }
  };

  private handleFocus = (event: FocusEvent) => {
    event.stopImmediatePropagation();
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
  };

  private deleteExpand = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { selectionStart, selectionEnd } = this.input;

    if (selectionStart !== selectionEnd || selectionStart !== 0) {
      return;
    }

    const { state } = this.view;
    const expandNode = this.node;
    if (expandNode && isEmptyNode(state.schema)(expandNode)) {
      deleteExpandAtPos(this.getPos(), expandNode)(state, this.view.dispatch);
    }
  };

  private toggleExpand = () => {
    if (this.isAllowInteractiveExpandEnabled()) {
      const { state, dispatch } = this.view;
      toggleExpandExpanded(this.getPos(), this.node.type)(state, dispatch);
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
    return !this.node.attrs.__expanded;
  };

  private setRightGapCursor = (event: KeyboardEvent) => {
    if (!this.input) {
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
            state.doc.resolve(this.node.nodeSize + this.getPos()),
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
    const { selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === 0) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      this.view.focus();
      dispatch(
        state.tr.setSelection(
          new GapCursorSelection(state.doc.resolve(this.getPos()), Side.LEFT),
        ),
      );
    }
  };

  private handleArrowRightFromTitle = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { value, selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === value.length) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      this.view.focus();

      setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, this.getPos()),
      )(state, dispatch);
    }
  };

  private handleArrowLeftFromTitle = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === 0) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      this.view.focus();

      // selectionRelativeToNode is undefined when user clicked to select node, then hit left to get focus in title
      // This is a special case where we want to bypass node selection and jump straight to gap cursor
      if (
        getSelectionPluginState(state).selectionRelativeToNode === undefined
      ) {
        setSelectionRelativeToNode(
          undefined,
          new GapCursorSelection(state.doc.resolve(this.getPos()), Side.LEFT),
        )(state, dispatch);
      } else {
        setSelectionRelativeToNode(
          RelativeSelectionPos.Start,
          NodeSelection.create(state.doc, this.getPos()),
        )(state, dispatch);
      }
    }
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
    if (mutationRecord.type === 'selection') {
      return false;
    }
    return true;
  }

  update(node: PmNode, _decorations: Array<Decoration>) {
    if (this.node.type === node.type) {
      if (this.node.attrs.__expanded !== node.attrs.__expanded) {
        // Instead of re-rendering the view on an expand toggle
        // we toggle a class name to hide the content and animate the chevron.
        if (this.dom) {
          this.dom.classList.toggle(expandClassNames.expanded);
          this.renderIcon(this.reactContext && this.reactContext.intl, node);
        }

        if (this.content) {
          // Disallow interaction/selection inside when collapsed.
          this.content.setAttribute('contenteditable', node.attrs.__expanded);
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
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.removeEventListener('input', this.handleInput);
    }
    if (this.input) {
      this.input.removeEventListener('keydown', this.handleTitleKeydown);
    }

    if (this.titleContainer) {
      this.titleContainer.removeEventListener('focus', this.handleFocus);
    }

    if (this.icon) {
      this.icon.removeEventListener('keydown', this.handleIconKeyDown);
      ReactDOM.unmountComponentAtNode(this.icon);
    }

    this.dom = undefined;
    this.contentDOM = undefined;
    this.icon = undefined;
    this.input = undefined;
    this.titleContainer = undefined;
    this.content = undefined;
  }
}

export default function (reactContext: ReactContextFn) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new ExpandNodeView(node, view, getPos as getPosHandlerNode, reactContext);
}
