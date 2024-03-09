import React from 'react';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { EventDispatcher } from '../event-dispatcher';
import type { ExtensionHandlers } from '../extensions';
import type { ProviderFactory } from '../provider-factory';
import type {
  ForwardRef,
  getPosHandler,
  ProsemirrorGetPosHandler,
} from '../react-node-view';
import ReactNodeView from '../react-node-view';
import type { EditorAppearance } from '../types';
import type { PortalProviderAPI } from '../ui/PortalProvider';

import { Extension } from './Extension';
import { ExtensionNodeWrapper } from './ExtensionNodeWrapper';
import type { ExtensionsPluginInjectionAPI } from './types';

interface ExtensionNodeViewOptions {
  appearance?: EditorAppearance;
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
      pluginInjectionApi: ExtensionsPluginInjectionAPI;
      showMacroInteractionDesignUpdates: boolean;
    },
    forwardRef: ForwardRef,
  ) {
    return (
      <ExtensionNodeWrapper nodeType={this.node.type.name}>
        <Extension
          editorView={this.view}
          node={this.node}
          eventDispatcher={this.eventDispatcher}
          // The getPos arg is always a function when used with nodes
          // the version of the types we use has a union with the type
          // for marks.
          // This has been fixed in later versions of the definitly typed
          // types (and also in prosmirror-views inbuilt types).
          // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57384
          getPos={this.getPos as ProsemirrorGetPosHandler}
          providerFactory={props.providerFactory}
          handleContentDOMRef={forwardRef}
          extensionHandlers={props.extensionHandlers}
          editorAppearance={props.extensionNodeViewOptions?.appearance}
          pluginInjectionApi={props.pluginInjectionApi}
          showMacroInteractionDesignUpdates={
            props.showMacroInteractionDesignUpdates
          }
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
  pluginInjectionApi: ExtensionsPluginInjectionAPI,
  showMacroInteractionDesignUpdates?: boolean,
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
        pluginInjectionApi,
        showMacroInteractionDesignUpdates,
      },
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).init();
  };
}
