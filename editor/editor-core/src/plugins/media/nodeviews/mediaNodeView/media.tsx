import {
  ContextIdentifierProvider,
  ImageLoaderProps,
  MediaProvider,
  withImageLoader,
} from '@atlaskit/editor-common';
import {
  Card,
  CardDimensions,
  CardEvent,
  CardLoading,
  CardOnClickCallback,
  NumericalCardDimensions,
} from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { Node as PMNode } from 'prosemirror-model';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { EditorView } from 'prosemirror-view';
import React, { Component } from 'react';
import {
  ProsemirrorGetPosHandler,
  ReactNodeProps,
} from '../../../../nodeviews';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import { stateKey as mediaStateKey } from '../../pm-plugins/plugin-key';
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaCardWrapper } from '../styles';
import { MediaOptions } from '../../types';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export interface MediaNodeProps extends ReactNodeProps, ImageLoaderProps {
  view: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  originalDimensions: NumericalCardDimensions;
  maxDimensions: CardDimensions;
  isMediaSingle?: boolean;
  onClick?: CardOnClickCallback;
  mediaProvider?: Promise<MediaProvider>;
  uploadComplete?: boolean;
  isLoading?: boolean;
  mediaOptions?: MediaOptions;
}

interface MediaNodeState {
  viewMediaClientConfig?: MediaClientConfig;
  contextIdentifierProvider?: ContextIdentifierProvider;
}

export class MediaNode extends Component<MediaNodeProps, MediaNodeState> {
  private mediaPluginState: MediaPluginState;

  state: MediaNodeState = {};

  constructor(props: MediaNodeProps) {
    super(props);
    const { view } = this.props;
    this.mediaPluginState = mediaStateKey.getState(view.state);
  }

  shouldComponentUpdate(nextProps: MediaNodeProps, nextState: MediaNodeState) {
    const hasNewViewMediaClientConfig =
      !this.state.viewMediaClientConfig && nextState.viewMediaClientConfig;
    if (
      this.props.selected !== nextProps.selected ||
      this.props.uploadComplete !== nextProps.uploadComplete ||
      this.props.node.attrs.id !== nextProps.node.attrs.id ||
      this.props.node.attrs.collection !== nextProps.node.attrs.collection ||
      this.props.maxDimensions.height !== nextProps.maxDimensions.height ||
      this.props.maxDimensions.width !== nextProps.maxDimensions.width ||
      this.props.contextIdentifierProvider !==
        nextProps.contextIdentifierProvider ||
      this.props.isLoading !== nextProps.isLoading ||
      this.props.mediaProvider !== nextProps.mediaProvider ||
      hasNewViewMediaClientConfig
    ) {
      return true;
    }
    return false;
  }

  async componentDidMount() {
    this.handleNewNode(this.props);

    const { contextIdentifierProvider } = this.props;
    this.setState({
      contextIdentifierProvider: await contextIdentifierProvider,
    });

    await this.setViewMediaClientConfig();
  }

  componentWillUnmount() {
    const { node } = this.props;
    this.mediaPluginState.handleMediaNodeUnmount(node);
  }

  componentDidUpdate(prevProps: Readonly<MediaNodeProps>) {
    if (prevProps.node.attrs.id !== this.props.node.attrs.id) {
      this.mediaPluginState.handleMediaNodeUnmount(prevProps.node);
      this.handleNewNode(this.props);
    }
    this.mediaPluginState.updateElement();
    this.setViewMediaClientConfig();
  }

  private setViewMediaClientConfig = async () => {
    const mediaProvider = await this.props.mediaProvider;
    if (mediaProvider) {
      const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;

      this.setState({
        viewMediaClientConfig,
      });
    }
  };

  private selectMediaSingleFromCard = ({ event }: CardEvent) => {
    this.selectMediaSingle(event);
  };

  private selectMediaSingle = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    // We need to call "stopPropagation" here in order to prevent the browser from navigating to
    // another URL if the media node is wrapped in a link mark.
    event.stopPropagation();

    const propPos = this.props.getPos();
    const { state } = this.props.view;

    if (event.shiftKey) {
      // don't select text if there is current selection in a table (as this would override selected cells)
      if (state.selection instanceof CellSelection) {
        return;
      }

      setTextSelection(
        this.props.view,
        state.selection.from < propPos ? state.selection.from : propPos - 1,
        // + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
        state.selection.to > propPos ? state.selection.to : propPos + 2,
      );
    } else {
      setNodeSelection(this.props.view, propPos - 1);
    }
  };

  render() {
    const {
      node,
      selected,
      uploadComplete,
      originalDimensions,
      isLoading,
      maxDimensions,
      mediaOptions,
    } = this.props;

    const { viewMediaClientConfig, contextIdentifierProvider } = this.state;

    const { id, type, collection, url, alt } = node.attrs;

    if (
      isLoading ||
      (type !== 'external' &&
        (!viewMediaClientConfig ||
          (typeof uploadComplete === 'boolean' && !uploadComplete)))
    ) {
      return (
        <MediaCardWrapper dimensions={originalDimensions}>
          <CardLoading />
        </MediaCardWrapper>
      );
    }

    const contextId =
      contextIdentifierProvider && contextIdentifierProvider.objectId;
    const identifier: Identifier =
      type === 'external'
        ? {
            dataURI: url!,
            name: url,
            mediaItemType: 'external-image',
          }
        : {
            id,
            mediaItemType: 'file',
            collectionName: collection!,
          };

    // mediaClientConfig is not needed for "external" case. So we have to cheat here.
    // there is a possibility mediaClientConfig will be part of a identifier,
    // so this might be not an issue
    const mediaClientConfig: MediaClientConfig = viewMediaClientConfig || {
      authProvider: () => ({} as any),
    };

    return (
      <MediaCardWrapper
        dimensions={originalDimensions}
        onContextMenu={this.selectMediaSingle}
      >
        <Card
          mediaClientConfig={mediaClientConfig}
          resizeMode="stretchy-fit"
          dimensions={maxDimensions}
          originalDimensions={originalDimensions}
          identifier={identifier}
          selectable={true}
          selected={selected}
          disableOverlay={true}
          onClick={this.selectMediaSingleFromCard}
          useInlinePlayer={mediaOptions && mediaOptions.allowLazyLoading}
          isLazy={mediaOptions && mediaOptions.allowLazyLoading}
          featureFlags={mediaOptions && mediaOptions.featureFlags}
          contextId={contextId}
          alt={alt}
        />
      </MediaCardWrapper>
    );
  }

  private handleNewNode = (props: MediaNodeProps) => {
    const { node } = props;

    this.mediaPluginState.handleMediaNodeMount(node, () => this.props.getPos());
  };
}

export default withImageLoader<MediaNodeProps>(MediaNode);
