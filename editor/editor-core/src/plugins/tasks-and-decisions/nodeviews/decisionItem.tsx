import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { NodeView, Decoration } from 'prosemirror-view';
import DecisionItem from '../ui/Decision';
import { ReactNodeView, ForwardRef, getPosHandler } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher } from '../../../event-dispatcher';
import { selectNode } from '../../../utils/commands';

class Decision extends ReactNodeView {
  init() {
    super.init();
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
    }
    return this;
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    // only set node selection if click was on item boundary or on
    // decision icon (the icon is included as it extends into the
    // node's leniency margin)
    if (
      target.hasAttribute('data-decision-wrapper') ||
      target.getAttribute('aria-label') === 'Decision'
    ) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      // getPos can also be a boolean
      if (typeof this.getPos === 'function') {
        selectNode(this.getPos())(state, dispatch);
      }
    }
  };

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
        showPlaceholder={this.isContentEmpty(this.node)}
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

  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
    }
    super.destroy();
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
