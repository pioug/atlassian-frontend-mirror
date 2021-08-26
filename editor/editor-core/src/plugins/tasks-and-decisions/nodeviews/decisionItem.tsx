import React from 'react';

import { Node as PMNode } from 'prosemirror-model';
import { Decoration, NodeView } from 'prosemirror-view';

import { EventDispatcher } from '../../../event-dispatcher';
import { ForwardRef, getPosHandler, ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import DecisionItem from '../ui/Decision';
import { isTypeAheadOpen } from '../../type-ahead/utils';

class Decision extends ReactNodeView {
  private isContentEmpty(node: PMNode) {
    return node.content.childCount === 0;
  }

  createDomRef() {
    const domRef = document.createElement('li');
    domRef.style['list-style-type' as any] = 'none';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    // setting a className prevents PM/Chrome mutation observer from
    // incorrectly deleting nodes
    dom.className = 'decision-item';
    return { dom };
  }

  render(_props: never, forwardRef: ForwardRef) {
    return (
      <DecisionItem
        contentRef={forwardRef}
        showPlaceholder={
          this.isContentEmpty(this.node) && !isTypeAheadOpen(this.view.state)
        }
      />
    );
  }

  viewShouldUpdate(nextNode: PMNode) {
    /**
     * To ensure the placeholder is correctly toggled we need to allow react to re-render
     * on first character insertion.
     * Note: last character deletion is handled externally and automatically re-renders.
     */
    return this.isContentEmpty(this.node) && !!nextNode.content.childCount;
  }

  update(node: PMNode, decorations: Decoration[]) {
    return super.update(
      node,
      decorations,
      // Toggle the placeholder based on whether user input exists.
      (_currentNode, _newNode) => !this.isContentEmpty(_newNode),
    );
  }
}

export const decisionItemNodeView = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
) => (node: any, view: any, getPos: getPosHandler): NodeView => {
  return new Decision(
    node,
    view,
    getPos,
    portalProviderAPI,
    eventDispatcher,
    {},
  ).init();
};
