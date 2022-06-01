import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React, { useEffect, useState } from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import {
  getPosHandler,
  getPosHandlerNode,
  ProsemirrorGetPosHandler,
  SelectionBasedNodeView,
} from '../../../nodeviews/';
import WithPluginState from '../../../ui/WithPluginState';
import { MediaInlineCard } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core/auth';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  WithProviders,
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { PortalProviderAPI } from '../../../../src/ui/PortalProvider';
import { MediaInlineNodeSelector } from './styles';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { MediaPluginState } from '../pm-plugins/types';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { DispatchAnalyticsEvent } from '../../analytics';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';

export interface MediaInlineProps {
  mediaProvider: Promise<MediaProvider>;
  identifier: FileIdentifier;
  node: PMNode;
  isSelected: boolean;
  view: EditorView;
  getPos: ProsemirrorGetPosHandler;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  mediaPluginState: MediaPluginState;
}

export const createMediaNodeUpdater = (
  props: MediaInlineProps,
): MediaNodeUpdater => {
  const node = props.node;
  return new MediaNodeUpdater({
    ...props,
    isMediaSingle: true,
    node: node ? (node as PMNode) : props.node,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    contextIdentifierProvider: props.contextIdentifierProvider,
  });
};

/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */
export const updateMediaNodeAttributes = async (props: MediaInlineProps) => {
  const mediaNodeUpdater = createMediaNodeUpdater(props);
  const { addPendingTask } = props.mediaPluginState;

  const node = props.node;
  if (!node) {
    return;
  }

  const contextId = mediaNodeUpdater.getNodeContextId();
  if (!contextId) {
    await mediaNodeUpdater.updateContextId();
  }

  const hasDifferentContextId = await mediaNodeUpdater.hasDifferentContextId();

  if (hasDifferentContextId) {
    try {
      const copyNode = mediaNodeUpdater.copyNode();
      addPendingTask(copyNode);
      await copyNode;
    } catch (e) {
      return;
    }
  }
  await mediaNodeUpdater.updateFileAttrs();
};

export const handleNewNode = (props: MediaInlineProps) => {
  const { node, mediaPluginState, getPos } = props;
  mediaPluginState.handleMediaNodeMount(node, () => getPos());
};

export const MediaInline: React.FC<MediaInlineProps> = (props) => {
  const [viewMediaClientConfig, setViewMediaClientConfig] = useState<
    MediaClientConfig | undefined
  >();

  useEffect(() => {
    handleNewNode(props);
    updateMediaNodeAttributes(props);
    updateViewMediaClientConfig(props);

    return () => {
      const { mediaPluginState } = props;
      mediaPluginState.handleMediaNodeUnmount(props.node);
    };
  }, [props]);

  const updateViewMediaClientConfig = async (props: MediaInlineProps) => {
    const mediaProvider = await props.mediaProvider;
    if (mediaProvider) {
      const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
      setViewMediaClientConfig(viewMediaClientConfig);
    }
  };

  const { id, collection } = props.node.attrs;
  const identifier: FileIdentifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection!,
  };

  /*
   * Only show the loading view if the media provider is not ready
   * prevents calling the media API before the provider is ready
   */
  if (!viewMediaClientConfig) {
    return <MediaInlineCardLoadingView message="" isSelected={false} />;
  }

  return (
    <MediaInlineCard
      isSelected={props.isSelected}
      identifier={identifier}
      mediaClientConfig={viewMediaClientConfig}
    />
  );
};

export interface MediaInlineNodeViewProps {
  providerFactory: ProviderFactory;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}
export class MediaInlineNodeView extends SelectionBasedNodeView<
  MediaInlineNodeViewProps
> {
  createDomRef() {
    const domRef = document.createElement('span');
    domRef.contentEditable = 'false';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.classList.add(MediaInlineNodeSelector);
    return { dom };
  }

  ignoreMutation() {
    return true;
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  render(props: MediaInlineNodeViewProps) {
    const { providerFactory } = props;
    const getPos = this.getPos as getPosHandlerNode;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          if (!mediaProvider) {
            return null;
          }
          return (
            <WithPluginState
              editorView={this.view}
              plugins={{
                mediaPluginState: mediaStateKey,
              }}
              render={({ mediaPluginState }) => {
                if (!mediaPluginState) {
                  return null;
                }
                return (
                  <MediaInline
                    identifier={this.node.attrs.id}
                    mediaProvider={mediaProvider}
                    mediaPluginState={mediaPluginState}
                    node={this.node}
                    isSelected={this.nodeInsideSelection()}
                    view={this.view}
                    getPos={getPos}
                    contextIdentifierProvider={contextIdentifierProvider}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaInlineNode = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
  return new MediaInlineNodeView(
    node,
    view,
    getPos,
    portalProviderAPI,
    eventDispatcher,
    {
      providerFactory,
      dispatchAnalyticsEvent,
    },
  ).init();
};
