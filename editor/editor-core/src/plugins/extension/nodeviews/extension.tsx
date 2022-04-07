import React from 'react';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorAppearance } from '../../../types/editor-appearance';
import { ReactNodeView } from '../../../nodeviews';
import Extension from '../ui/Extension';
import ExtensionNodeWrapper from '../ui/Extension/ExtensionNodeWrapper';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ForwardRef, getPosHandler } from '../../../nodeviews/';
import { EventDispatcher } from '../../../event-dispatcher';

interface ExtensionNodeViewOptions {
  appearance?: EditorAppearance;
}

export interface Props {
  node: PmNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
export class ExtensionNode extends ReactNodeView {
  ignoreMutation(
    mutation: MutationRecord | { type: 'selection'; target: Element },
  ) {
    // Extensions can perform async operations that will change the DOM.
    // To avoid having their tree rebuilt, we need to ignore the mutation
    // for atom based extensions if its not a layout, we need to give
    // children a chance to recalc
    return (
      this.node.type.isAtom ||
      (mutation.type !== 'selection' &&
        mutation.attributeName !== 'data-layout')
    );
  }

  getContentDOM() {
    if (this.node.isInline) {
      return;
    }

    const dom = document.createElement('div');
    dom.className = `${this.node.type.name}-content-dom-wrapper`;
    return { dom };
  }

  render(
    props: {
      providerFactory: ProviderFactory;
      extensionHandlers: ExtensionHandlers;
      // referentiality plugin won't utilise appearance just yet
      extensionNodeViewOptions?: ExtensionNodeViewOptions;
    },
    forwardRef: ForwardRef,
  ) {
    return (
      <ExtensionNodeWrapper nodeType={this.node.type.name}>
        <Extension
          editorView={this.view}
          node={this.node}
          providerFactory={props.providerFactory}
          handleContentDOMRef={forwardRef}
          extensionHandlers={props.extensionHandlers}
          editorAppearance={props.extensionNodeViewOptions?.appearance}
        />
      </ExtensionNodeWrapper>
    );
  }
}

export default function ExtensionNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  extensionNodeViewOptions: ExtensionNodeViewOptions,
) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView => {
    const hasIntlContext = true;
    return new ExtensionNode(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
        extensionHandlers,
        extensionNodeViewOptions,
      },
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).init();
  };
}
