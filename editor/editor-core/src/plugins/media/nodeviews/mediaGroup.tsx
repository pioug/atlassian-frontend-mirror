import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { Filmstrip, FilmstripItem } from '@atlaskit/media-filmstrip';
import { MediaClientConfig } from '@atlaskit/media-core';
import {
  WithProviders,
  ProviderFactory,
  ContextIdentifierProvider,
  MediaProvider,
} from '@atlaskit/editor-common';
import ReactNodeView, {
  ForwardRef,
  getPosHandler,
  getPosHandlerNode,
} from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { setNodeSelection } from '../../../utils';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../../editor-disabled';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { Identifier } from '@atlaskit/media-client';
import { MediaPluginState } from '../pm-plugins/types';

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
  disabled?: boolean;
  allowLazyLoading?: boolean;
  mediaProvider: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  isCopyPasteEnabled?: boolean;
};

export interface MediaGroupState {
  viewMediaClientConfig?: MediaClientConfig;
}

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
      this.props.selected !== nextProps.selected ||
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

  renderChildNodes = () => {
    const { viewMediaClientConfig } = this.state;
    const { getPos, allowLazyLoading, selected, disabled } = this.props;
    const items: FilmstripItem[] = this.mediaNodes.map((item, idx) => {
      // We declared this to get a fresh position every time
      const getNodePos = () => {
        return getPos() + idx + 1;
      };
      return {
        identifier: this.getIdentifier(item),
        selectable: true,
        isLazy: allowLazyLoading,
        selected: selected === getNodePos(),
        onClick: () => {
          setNodeSelection(this.props.view, getNodePos());
        },
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
      <Filmstrip items={items} mediaClientConfig={viewMediaClientConfig} />
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
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
  render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
    const { allowLazyLoading, providerFactory, isCopyPasteEnabled } = props;
    const getPos = this.getPos as getPosHandlerNode;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          const renderFn = ({
            editorDisabledPlugin,
          }: {
            editorDisabledPlugin: EditorDisabledPluginState;
          }) => {
            const nodePos = getPos();
            const { $anchor, $head } = this.view.state.selection;
            const isSelected =
              nodePos < $anchor.pos && $head.pos < nodePos + this.node.nodeSize;

            if (!mediaProvider) {
              return null;
            }
            return (
              <MediaGroup
                node={this.node}
                getPos={getPos}
                view={this.view}
                forwardRef={forwardRef}
                selected={isSelected ? $anchor.pos : null}
                disabled={(editorDisabledPlugin || {}).editorDisabled}
                allowLazyLoading={allowLazyLoading}
                mediaProvider={mediaProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                isCopyPasteEnabled={isCopyPasteEnabled}
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
  providerFactory: ProviderFactory,
  allowLazyLoading?: boolean,
  isCopyPasteEnabled?: boolean,
) => (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, {
    allowLazyLoading,
    providerFactory,
    isCopyPasteEnabled,
  }).init();
};
