import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { Caption } from '@atlaskit/editor-common/ui';

import {
  getPosHandler,
  getPosHandlerNode,
  ForwardRef,
} from '../../../nodeviews/';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type captionPlugin from '../index';

export class CaptionNodeView extends SelectionBasedNodeView {
  private selected = this.insideSelection();

  createDomRef() {
    const domRef = document.createElement('figcaption');
    domRef.setAttribute('data-caption', 'true');
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    // setting a className prevents PM/Chrome mutation observer from
    // incorrectly deleting nodes
    dom.className = 'caption-wrapper';

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
  pluginInjectionApi: ExtractInjectionAPI<typeof captionPlugin> | undefined,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler) => {
    const hasIntlContext = true;
    return new CaptionNodeView(
      node,
      view,
      getPos as getPosHandlerNode,
      portalProviderAPI,
      eventDispatcher,
      {},
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).init();
  };
}
