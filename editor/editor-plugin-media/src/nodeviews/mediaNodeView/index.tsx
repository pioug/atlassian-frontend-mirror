import React from 'react';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  MediaProvider,
  ProviderFactory,
  Providers,
} from '@atlaskit/editor-common/provider-factory';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView } from '@atlaskit/editor-prosemirror/view';
import { getAttrsFromUrl } from '@atlaskit/media-client';

import { updateCurrentMediaNodeAttrs } from '../../commands/helpers';
import type { MediaNextEditorPluginType } from '../../next-plugin-type';
import type {
  getPosHandler,
  getPosHandlerNode,
  MediaOptions,
} from '../../types';
import { isMediaBlobUrlFromAttrs } from '../../utils/media-common';
import type { MediaNodeViewProps } from '../types';

import MediaNode from './media';

interface MediaNodeWithProvidersProps {
  pluginInjectionApi:
    | ExtractInjectionAPI<MediaNextEditorPluginType>
    | undefined;
  innerComponent: (props: { width?: WidthPluginState }) => React.ReactElement;
}

const MediaNodeWithProviders = ({
  pluginInjectionApi,
  innerComponent,
}: MediaNodeWithProvidersProps) => {
  const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);
  return innerComponent({ width: widthState });
};

function isMediaDecorationSpec(
  decoration: Decoration,
): decoration is Decoration {
  return (
    decoration.spec.type !== undefined && decoration.spec.selected !== undefined
  );
}

class MediaNodeView extends SelectionBasedNodeView<MediaNodeViewProps> {
  private isSelected = false;

  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');
    if (
      this.reactComponentProps.mediaOptions &&
      this.reactComponentProps.mediaOptions.allowMediaSingleEditable
    ) {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
    }
    return domRef;
  }

  viewShouldUpdate(nextNode: PMNode, decorations: Decoration[]) {
    const hasMediaNodeSelectedDecoration = decorations.some(
      decoration =>
        isMediaDecorationSpec(decoration) &&
        decoration.spec.type === 'media' &&
        decoration.spec.selected,
    );

    if (this.isSelected !== hasMediaNodeSelectedDecoration) {
      this.isSelected = hasMediaNodeSelectedDecoration;
      return true;
    }

    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode, decorations);
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

  onExternalImageLoaded = (dimensions: { width: number; height: number }) => {
    const getPos = this.getPos as getPosHandlerNode;
    const { width, height, ...rest } = this.getAttrs();
    if (!width || !height) {
      updateCurrentMediaNodeAttrs(
        {
          ...rest,
          width: width || dimensions.width,
          height: height || dimensions.height,
        },
        {
          node: this.node,
          getPos,
        },
      )(this.view.state, this.view.dispatch);
    }
  };

  renderMediaNodeWithState = (
    mediaProvider?: Promise<MediaProvider>,
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>,
  ) => {
    return ({ width: editorWidth }: { width?: WidthPluginState }) => {
      const getPos = this.getPos as getPosHandlerNode;
      const { mediaOptions } = this.reactComponentProps;

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

      // mediaSingle defines the max dimensions, so we don't need to constrain twice.
      const maxDimensions = {
        width: `100%`,
        height: `100%`,
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
          selected={this.nodeInsideSelection()}
          originalDimensions={originalDimensions}
          maxDimensions={maxDimensions}
          url={url}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          mediaOptions={mediaOptions}
          onExternalImageLoaded={this.onExternalImageLoaded}
        />
      );
    };
  };

  renderMediaNodeWithProviders = ({
    mediaProvider,
    contextIdentifierProvider,
  }: Providers) => {
    const { pluginInjectionApi } = this.reactComponentProps;

    return (
      <MediaNodeWithProviders
        pluginInjectionApi={pluginInjectionApi}
        innerComponent={this.renderMediaNodeWithState(
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

export const ReactMediaNode =
  (
    portalProviderAPI: PortalProviderAPI,
    eventDispatcher: EventDispatcher,
    providerFactory: ProviderFactory,
    mediaOptions: MediaOptions = {},
    pluginInjectionApi:
      | ExtractInjectionAPI<MediaNextEditorPluginType>
      | undefined,
  ) =>
  (node: PMNode, view: EditorView, getPos: getPosHandler) => {
    const hasIntlContext = true;
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
        pluginInjectionApi,
      },
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).init();
  };
