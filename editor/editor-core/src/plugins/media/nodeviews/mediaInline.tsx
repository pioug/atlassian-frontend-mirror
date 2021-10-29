import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React, { useEffect, useState } from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import { getPosHandler, ReactNodeView } from '../../../nodeviews/';
import { MediaInlineCard } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core/auth';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  MediaProvider,
  WithProviders,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { PortalProviderAPI } from '../../../../src/ui/PortalProvider';

export interface MediaInlineProps {
  mediaProvider: Promise<MediaProvider>;
  identifier: FileIdentifier;
  node: PMNode;
}

export const MediaInline: React.FC<MediaInlineProps> = (props) => {
  const [viewMediaClientConfig, setViewMediaClientConfig] = useState(
    {} as MediaClientConfig,
  );

  useEffect(() => {
    updateViewMediaClientConfig(props);
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

  return (
    <MediaInlineCard
      identifier={identifier}
      mediaClientConfig={viewMediaClientConfig}
    />
  );
};

export interface MediaInlineNodeViewProps {
  providerFactory: ProviderFactory;
}

export class MediaInlineNodeView extends ReactNodeView<
  MediaInlineNodeViewProps
> {
  createDomRef() {
    const domRef = document.createElement('span');
    domRef.contentEditable = 'false';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('span');
    return { dom };
  }

  ignoreMutation() {
    return true;
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return false;
  }

  render(props: MediaInlineNodeViewProps) {
    const { providerFactory } = props;
    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider }) => {
          if (!mediaProvider) {
            return null;
          }
          return (
            <MediaInline
              identifier={this.node.attrs.id}
              mediaProvider={mediaProvider}
              node={this.node}
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
) => (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
  return new MediaInlineNodeView(
    node,
    view,
    getPos,
    portalProviderAPI,
    eventDispatcher,
    {
      providerFactory,
    },
  ).init();
};
