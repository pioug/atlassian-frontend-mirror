import { MediaADFAttrs } from '@atlaskit/adf-schema';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  browser,
  ProviderFactory,
  WithProviders,
  Providers,
  MediaProvider,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { Node as PMNode } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { EventDispatcher } from '../../../../event-dispatcher';
import {
  getPosHandler,
  getPosHandlerNode,
  SelectionBasedNodeView,
} from '../../../../nodeviews';
import { PortalProviderAPI } from '../../../../ui/PortalProvider';
import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey as widthPluginKey, WidthPluginState } from '../../../width';
import { isMobileUploadCompleted } from '../../commands/helpers';
import { stateKey as mediaStateKey } from '../../pm-plugins/plugin-key';
import { MediaOptions } from '../../types';
import { MediaNodeViewProps } from '../types';
import MediaNode from './media';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import { isMediaBlobUrlFromAttrs } from '../../utils/media-common';

class MediaNodeView extends SelectionBasedNodeView<MediaNodeViewProps> {
  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');
    if (
      browser.chrome &&
      this.reactComponentProps.mediaOptions &&
      this.reactComponentProps.mediaOptions.allowMediaSingleEditable
    ) {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
    }
    return domRef;
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  stopEvent(event: Event) {
    // Don't trap right click events on media node
    if (['mousedown', 'contextmenu'].indexOf(event.type) !== -1) {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button === 2) {
        return true;
      }
    }
    return false;
  }

  getAttrs(): MediaADFAttrs {
    const { attrs } = this.node;
    return attrs as MediaADFAttrs;
  }

  isMediaBlobUrl(): boolean {
    const attrs = this.getAttrs();
    return isMediaBlobUrlFromAttrs(attrs);
  }

  uploadComplete() {
    return isMobileUploadCompleted(
      mediaStateKey.getState(this.view.state),
      this.node.attrs.id,
    );
  }

  renderMediaNodeWithState = (
    mediaProvider?: Promise<MediaProvider>,
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>,
  ) => {
    return ({ width: editorWidth }: { width?: WidthPluginState }) => {
      const getPos = this.getPos as getPosHandlerNode;
      const { mediaOptions } = this.reactComponentProps;

      const { selection } = this.view.state;
      const isSelected = () =>
        this.isNodeInsideSelection(selection.from, selection.to) ||
        (selection instanceof NodeSelection && selection.from === getPos());

      const attrs = this.getAttrs();
      const url = attrs.type === 'external' ? attrs.url : '';

      let { width, height } = attrs;
      if (this.isMediaBlobUrl()) {
        const urlAttrs = getAttrsFromUrl(url);
        if (urlAttrs) {
          const { width: urlWidth, height: urlHeight } = urlAttrs;
          width = width || urlWidth;
          height = height || urlHeight;
        }
      }
      width = width || DEFAULT_IMAGE_WIDTH;
      height = height || DEFAULT_IMAGE_HEIGHT;

      const maxDimensions = {
        width: `${editorWidth!.width}px`,
        height: `${(height / width) * editorWidth!.width}px`,
      };

      const originalDimensions = {
        width,
        height,
      };

      return (
        <MediaNode
          view={this.view}
          node={this.node}
          getPos={getPos}
          selected={isSelected()}
          originalDimensions={originalDimensions}
          maxDimensions={maxDimensions}
          url={url}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          uploadComplete={this.uploadComplete()}
          mediaOptions={mediaOptions}
        />
      );
    };
  };

  renderMediaNodeWithProviders = ({
    mediaProvider,
    contextIdentifierProvider,
  }: Providers) => {
    return (
      <WithPluginState
        editorView={this.view}
        plugins={{
          width: widthPluginKey,
        }}
        render={this.renderMediaNodeWithState(
          mediaProvider,
          contextIdentifierProvider,
        )}
      />
    );
  };

  render() {
    const { providerFactory } = this.reactComponentProps;

    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={this.renderMediaNodeWithProviders}
      />
    );
  }
}

export const ReactMediaNode = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  mediaOptions: MediaOptions = {},
) => (node: PMNode, view: EditorView, getPos: getPosHandler) => {
  return new MediaNodeView(
    node,
    view,
    getPos,
    portalProviderAPI,
    eventDispatcher,
    {
      eventDispatcher,
      providerFactory,
      mediaOptions,
    },
  ).init();
};
