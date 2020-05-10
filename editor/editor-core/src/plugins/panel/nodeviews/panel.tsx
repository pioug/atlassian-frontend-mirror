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
import { selectPanel } from '../actions';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';

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
      this.dom.addEventListener('mousedown', this.handleMouseDown);
      this.dom.addEventListener('click', this.handleClick);
    }
  }

  private renderIcon(panelType: PanelType) {
    const Icon = panelIcons[panelType];
    ReactDOM.render(<Icon label={`Panel ${panelType}`} />, this.icon);
  }

  private handleMouseDown = () => {
    // need to prevent selecting panel if user clicks and drags from inside and releases
    // mouse on padding
    this.dom.addEventListener('mousemove', this.handleMouseMove);
    this.dom.addEventListener('mouseup', this.handleMouseUp);
  };

  private handleMouseMove = () => {
    this.dom.removeEventListener('click', this.handleClick);
  };

  private handleMouseUp = () => {
    // wait a frame, otherwise click will still fire immediately after this
    requestAnimationFrame(() => {
      this.dom.addEventListener('click', this.handleClick);
    });
    this.dom.removeEventListener('mousemove', this.handleMouseMove);
    this.dom.removeEventListener('mouseup', this.handleMouseUp);
  };

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    // If clicking on the border of the panel
    const targetIsBorder = target === this.dom;

    // If clicking in the left margin or icon of panel
    const targetIsGutter = target.closest(`.${PanelSharedCssClassName.icon}`);

    // This gives us click leniency
    const targetIsContent = target.classList.contains(
      PanelSharedCssClassName.content,
    );

    if (targetIsBorder || targetIsGutter || targetIsContent) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      selectPanel(this.getPos())(state, dispatch);
      return;
    }
  };
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
