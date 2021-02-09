import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { Caption } from '@atlaskit/editor-common';

import {
  getPosHandler,
  getPosHandlerNode,
  ForwardRef,
  SelectionBasedNodeView,
} from '../../../nodeviews/';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher } from '../../../event-dispatcher';

export class CaptionNodeView extends SelectionBasedNodeView {
  private selected = this.insideSelection();

  createDomRef() {
    const domRef = document.createElement('figcaption');
    domRef.setAttribute('data-caption', 'true');
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    return { dom };
  }

  render(_props: never, forwardRef: ForwardRef) {
    return (
      <Caption
        selected={this.insideSelection()}
        hasContent={this.node.content.childCount > 0}
      >
        <div ref={forwardRef} />
      </Caption>
    );
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (this.node.childCount !== nextNode.childCount) {
      return true;
    }

    const newSelected = this.insideSelection();
    const selectedStateChange = this.selected !== newSelected;
    this.selected = newSelected;

    return selectedStateChange;
  }
}

export default function captionNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler) =>
    new CaptionNodeView(
      node,
      view,
      getPos as getPosHandlerNode,
      portalProviderAPI,
      eventDispatcher,
      {},
    ).init();
}
