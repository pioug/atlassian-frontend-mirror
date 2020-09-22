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

  constructor(node: Node, view: EditorView, getPos: getPosHandlerNode) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.getPos = getPos;
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector(
      `.${PanelSharedCssClassName.icon}`,
    ) as HTMLElement;
    this.renderIcon(
      node.attrs.panelType as Exclude<PanelType, PanelType.CUSTOM>,
    );
  }

  private renderIcon(panelType: Exclude<PanelType, PanelType.CUSTOM>) {
    const Icon = panelIcons[panelType] || InfoIcon;
    ReactDOM.render(<Icon label={`Panel ${panelType}`} />, this.icon);
  }
}

export const panelNodeView = (
  node: any,
  view: EditorView,
  getPos: getPosHandler,
): NodeView => {
  return new PanelNodeView(node, view, getPos as getPosHandlerNode);
};
