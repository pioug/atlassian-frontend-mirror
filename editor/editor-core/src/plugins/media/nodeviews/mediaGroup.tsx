import {
  ContextIdentifierProvider,
  MediaProvider,
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { Identifier } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { Filmstrip, FilmstripItem } from '@atlaskit/media-filmstrip';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import {
  ForwardRef,
  getPosHandler,
  getPosHandlerNode,
} from '../../../nodeviews/';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import WithPluginState from '../../../ui/WithPluginState';
import { setNodeSelection } from '../../../utils';
import { isNodeSelectedOrInRange, SelectedState } from '../../../utils/nodes';
import {
  EditorDisabledPluginState,
  pluginKey as editorDisabledPluginKey,
} from '../../editor-disabled';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { MediaPluginState } from '../pm-plugins/types';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { MediaOptions } from '../types';

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  disabled?: boolean;
  allowLazyLoading?: boolean;
  mediaProvider: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  isCopyPasteEnabled?: boolean;
  // These two numbers have to be passed separately. They can technically be derived from the view, but
  // because the view is *reference* then `shouldComponentUpdate` can't identify changes from incoming props
  anchorPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
  headPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
  mediaOptions: MediaOptions;
};

export interface MediaGroupState {
  viewMediaClientConfig?: MediaClientConfig;
}

const isMediaGroupSelectedFromProps = (props: MediaGroupProps) => {
  return isNodeSelectedOrInRange(
    props.anchorPos,
    props.headPos,
    props.getPos(),
    props.node.nodeSize,
  );
};

const hasSelectionChanged = (
  oldProps: MediaGroupProps,
  newProps: MediaGroupProps,
): boolean => {
  if (
    isMediaGroupSelectedFromProps(oldProps) !==
    isMediaGroupSelectedFromProps(newProps)
  ) {
    return true;
  }
  if (
    isMediaGroupSelectedFromProps(newProps) === SelectedState.selectedInside
  ) {
    return oldProps.anchorPos !== newProps.anchorPos;
  }
  return false;
};

export default class MediaGroup extends React.Component<
  MediaGroupProps,
  MediaGroupState
> {
  static displayName = 'MediaGroup';

  private mediaPluginState: MediaPluginState;
  private mediaNodes: PMNode[];

  state: MediaGroupState = {
    viewMediaClientConfig: undefined,
  };

  constructor(props: MediaGroupProps) {
    super(props);
    this.mediaNodes = [];
    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    this.setMediaItems(props);
    this.state = {
      viewMediaClientConfig: undefined,
    };
  }

  componentDidMount() {
    this.updateMediaClientConfig();

    this.mediaNodes.forEach(async (node: PMNode) => {
      if (node.attrs.type === 'external') {
        return;
      }

      const { view, mediaProvider, contextIdentifierProvider } = this.props;
      const mediaNodeUpdater = new MediaNodeUpdater({
        view,
        mediaProvider,
        contextIdentifierProvider,
        node,
        isMediaSingle: false,
      });

      const contextId = mediaNodeUpdater.getNodeContextId();
      if (!contextId) {
        await mediaNodeUpdater.updateContextId();
      }

      const hasDifferentContextId = await mediaNodeUpdater.hasDifferentContextId();

      if (hasDifferentContextId) {
        await mediaNodeUpdater.copyNode();
      }
    });
  }

  private updateNodeAttrs = (props: MediaGroupProps) => {
    const { view, mediaProvider, contextIdentifierProvider } = props;

    this.mediaNodes.forEach((node: PMNode) => {
      const mediaNodeUpdater = new MediaNodeUpdater({
        view,
        mediaProvider,
        contextIdentifierProvider,
        node,
        isMediaSingle: false,
      });

      mediaNodeUpdater.updateFileAttrs(false);
    });
  };

  UNSAFE_componentWillReceiveProps(props: MediaGroupProps) {
    this.updateMediaClientConfig();
    this.setMediaItems(props);

    if (props.isCopyPasteEnabled !== false) {
      this.updateNodeAttrs(props);
    }
  }

  shouldComponentUpdate(nextProps: MediaGroupProps) {
    if (
      hasSelectionChanged(this.props, nextProps) ||
      this.props.node !== nextProps.node ||
      this.state.viewMediaClientConfig !==
        this.mediaPluginState.mediaClientConfig
    ) {
      return true;
    }

    return false;
  }

  updateMediaClientConfig() {
    const { viewMediaClientConfig } = this.state;
    const { mediaClientConfig } = this.mediaPluginState;
    if (!viewMediaClientConfig && mediaClientConfig) {
      this.setState({
        viewMediaClientConfig: mediaClientConfig,
      });
    }
  }

  setMediaItems = (props: MediaGroupProps) => {
    const { node } = props;
    this.mediaNodes = [] as Array<PMNode>;
    node.forEach((item, childOffset) => {
      this.mediaPluginState.mediaGroupNodes[item.attrs.id] = {
        node: item,
        getPos: () => props.getPos() + childOffset + 1,
      };
      this.mediaNodes.push(item);
    });
  };

  getIdentifier = (item: PMNode): Identifier => {
    if (item.attrs.type === 'external') {
      return {
        mediaItemType: 'external-image',
        dataURI: item.attrs.url,
      };
    }
    return {
      id: item.attrs.id,
      mediaItemType: 'file',
      collectionName: item.attrs.collection,
    };
  };

  isNodeSelected = (nodePos: number): boolean => {
    const selected = isMediaGroupSelectedFromProps(this.props);
    if (selected === SelectedState.selectedInRange) {
      return true;
    }
    if (
      selected === SelectedState.selectedInside &&
      this.props.anchorPos === nodePos
    ) {
      return true;
    }
    return false;
  };

  renderChildNodes = () => {
    const { viewMediaClientConfig } = this.state;
    const { getPos, allowLazyLoading, disabled, mediaOptions } = this.props;
    const items: FilmstripItem[] = this.mediaNodes.map((item, idx) => {
      // We declared this to get a fresh position every time
      const getNodePos = () => {
        return getPos() + idx + 1;
      };

      return {
        identifier: this.getIdentifier(item),
        isLazy: allowLazyLoading,
        selected: this.isNodeSelected(getNodePos()),
        onClick: () => {
          setNodeSelection(this.props.view, getNodePos());
        },
        shouldEnableDownloadButton: mediaOptions.enableDownloadButton,
        actions: [
          {
            handler: disabled
              ? () => {}
              : this.mediaPluginState.handleMediaNodeRemoval.bind(
                  null,
                  undefined,
                  getNodePos,
                ),
            icon: <EditorCloseIcon label="delete" />,
          },
        ],
      };
    });

    return (
      <Filmstrip
        items={items}
        mediaClientConfig={viewMediaClientConfig}
        featureFlags={mediaOptions.featureFlags}
      />
    );
  };

  render() {
    return this.renderChildNodes();
  }
}

interface MediaGroupNodeViewProps {
  allowLazyLoading?: boolean;
  isCopyPasteEnabled?: boolean;
  providerFactory: ProviderFactory;
  mediaOptions: MediaOptions;
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
  render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
    const { providerFactory, mediaOptions } = props;
    const getPos = this.getPos as getPosHandlerNode;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          const renderFn = ({
            editorDisabledPlugin,
          }: {
            editorDisabledPlugin?: EditorDisabledPluginState;
          }) => {
            if (!mediaProvider) {
              return null;
            }
            return (
              <MediaGroup
                node={this.node}
                getPos={getPos}
                view={this.view}
                forwardRef={forwardRef}
                disabled={(editorDisabledPlugin || {}).editorDisabled}
                allowLazyLoading={mediaOptions.allowLazyLoading}
                mediaProvider={mediaProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                isCopyPasteEnabled={mediaOptions.isCopyPasteEnabled}
                anchorPos={this.view.state.selection.$anchor.pos}
                headPos={this.view.state.selection.$head.pos}
                mediaOptions={mediaOptions}
              />
            );
          };
          return (
            <WithPluginState
              editorView={this.view}
              plugins={{
                reactNodeViewState: reactNodeViewStateKey,
                editorDisabledPlugin: editorDisabledPluginKey,
              }}
              render={renderFn}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaGroupNode = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  mediaOptions: MediaOptions = {},
) => (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
  return new MediaGroupNodeView(
    node,
    view,
    getPos,
    portalProviderAPI,
    eventDispatcher,
    {
      providerFactory,
      mediaOptions,
    },
  ).init();
};
