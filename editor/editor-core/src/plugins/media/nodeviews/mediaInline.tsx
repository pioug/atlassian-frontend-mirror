import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React, { useEffect, useState } from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import { getPosHandler, SelectionBasedNodeView } from '../../../nodeviews/';
import { MediaInlineCard } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core/auth';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  MediaProvider,
  WithProviders,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { PortalProviderAPI } from '../../../../src/ui/PortalProvider';
import { MediaInlineNodeSelector } from './styles';

export interface MediaInlineProps {
  mediaProvider: Promise<MediaProvider>;
  identifier: FileIdentifier;
  node: PMNode;
  isSelected: boolean;
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
      isSelected={props.isSelected}
      identifier={identifier}
      mediaClientConfig={viewMediaClientConfig}
    />
  );
};

export interface MediaInlineNodeViewProps {
  providerFactory: ProviderFactory;
}
export class MediaInlineNodeView extends SelectionBasedNodeView<
  MediaInlineNodeViewProps
> {
  createDomRef() {
    const domRef = document.createElement('span');
    domRef.contentEditable = 'false';
    domRef.classList.add(MediaInlineNodeSelector);
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

    return super.viewShouldUpdate(nextNode);
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
              isSelected={this.nodeInsideSelection()}
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
