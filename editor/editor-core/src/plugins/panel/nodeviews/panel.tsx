import React from 'react';
import ReactDOM from 'react-dom';
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType } from '@atlaskit/adf-schema';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';
import { selectNode } from '../../../utils/commands';
import { createSelectionAwareClickHandler } from '../../../nodeviews/utils';

const panelIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  tip: TipIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const toDOM = (node: Node) =>
  [
    'div',
    {
      class: PanelSharedCssClassName.prefix,
      'data-panel-type': node.attrs.panelType || 'info',
    },
    ['span', { class: PanelSharedCssClassName.icon }],
    ['div', { class: PanelSharedCssClassName.content }, 0],
  ] as DOMOutputSpec;

class PanelNodeView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  icon: HTMLElement;
  getPos: getPosHandlerNode;
  view: EditorView;
  allowSelection?: boolean;
  clickHandler?: (event: Event) => false | void;
  clickCleanup?: () => void;

  constructor(
    node: Node,
    view: EditorView,
    getPos: getPosHandlerNode,
    allowSelection?: boolean,
  ) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.getPos = getPos;
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector(
      `.${PanelSharedCssClassName.icon}`,
    ) as HTMLElement;
    this.renderIcon(node.attrs.panelType as PanelType);
    this.allowSelection = allowSelection;

    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom && this.allowSelection) {
      const { handler, cleanup } = createSelectionAwareClickHandler(
        this.dom,
        this.handleClick,
      );
      this.clickHandler = handler;
      this.clickCleanup = cleanup;
      this.dom.addEventListener('click', this.clickHandler);
    }
  }

  private renderIcon(panelType: PanelType) {
    const Icon = panelIcons[panelType];
    ReactDOM.render(<Icon label={`Panel ${panelType}`} />, this.icon);
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    // If clicking on the border of the panel
    const targetIsBorder = target === this.dom;

    // If clicking in the left margin or icon of panel
    const targetIsGutter = target.closest(`.${PanelSharedCssClassName.icon}`);

    if (targetIsBorder || targetIsGutter) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      selectNode(this.getPos())(state, dispatch);
      return;
    }
  };

  destroy() {
    if (this.dom) {
      this.clickHandler &&
        this.dom.removeEventListener('click', this.clickHandler);
      this.clickCleanup && this.clickCleanup();
    }
  }
}

export const panelNodeView = (allowSelection?: boolean) => (
  node: any,
  view: EditorView,
  getPos: getPosHandler,
): NodeView => {
  return new PanelNodeView(
    node,
    view,
    getPos as getPosHandlerNode,
    allowSelection,
  );
};
