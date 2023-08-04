import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  MediaProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import type { Identifier } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { FilmstripItem } from '@atlaskit/media-filmstrip';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import React from 'react';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
  ForwardRef,
  getPosHandler,
  getPosHandlerNode,
  ProsemirrorGetPosHandler,
} from '../../../nodeviews/';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';

import { setNodeSelection } from '../../../utils';
import { isNodeSelectedOrInRange, SelectedState } from '../../../utils/nodes';
import type { EditorDisabledPluginState } from '@atlaskit/editor-plugin-editor-disabled';

import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import type { MediaPluginState } from '../pm-plugins/types';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import type { MediaOptions } from '../types';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type mediaPlugin from '../index';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number | undefined;
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
} & WrappedComponentProps;

export interface MediaGroupState {
  viewMediaClientConfig?: MediaClientConfig;
}

const isMediaGroupSelectedFromProps = (props: MediaGroupProps) => {
  const pos = props.getPos();

  if (typeof pos !== 'number') {
    return false;
  }

  return isNodeSelectedOrInRange(
    props.anchorPos,
    props.headPos,
    pos,
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

class MediaGroup extends React.Component<MediaGroupProps, MediaGroupState> {
  static displayName = 'MediaGroup';

  private mediaPluginState: MediaPluginState | undefined;
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

      const getPos = () => {
        const pos = this.props.getPos();

        if (typeof pos !== 'number') {
          // That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
          // Because the original code would return NaN on runtime
          // We are just make it explict now.
          // We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
          // TODO: ED-13910 prosemirror-bump leftovers
          return NaN;
        }

        return pos + 1;
      };

      const contextId = mediaNodeUpdater.getNodeContextId();
      if (!contextId) {
        await mediaNodeUpdater.updateNodeContextId(getPos);
      }

      const hasDifferentContextId =
        await mediaNodeUpdater.hasDifferentContextId();

      if (hasDifferentContextId) {
        await mediaNodeUpdater.copyNodeFromPos(getPos, {
          traceId: node.attrs.__mediaTraceId,
        });
      }
    });
  }

  private updateNodeAttrs = (
    props: MediaGroupProps,
    node: PMNode,
    getPos: ProsemirrorGetPosHandler,
  ) => {
    const { view, mediaProvider, contextIdentifierProvider } = props;
    const mediaNodeUpdater = new MediaNodeUpdater({
      view,
      mediaProvider,
      contextIdentifierProvider,
      node,
      isMediaSingle: false,
    });

    mediaNodeUpdater.updateNodeAttrs(getPos);
  };

  componentWillUnmount() {
    this.mediaPluginState?.handleMediaGroupUpdate(this.mediaNodes, []);
  }

  UNSAFE_componentWillReceiveProps(props: MediaGroupProps) {
    this.updateMediaClientConfig();
    this.setMediaItems(
      props,
      props.isCopyPasteEnabled || props.isCopyPasteEnabled === undefined,
    );
  }

  shouldComponentUpdate(nextProps: MediaGroupProps) {
    if (
      hasSelectionChanged(this.props, nextProps) ||
      this.props.node !== nextProps.node ||
      this.state.viewMediaClientConfig !==
        this.mediaPluginState?.mediaClientConfig
    ) {
      return true;
    }

    return false;
  }

  updateMediaClientConfig() {
    const { viewMediaClientConfig } = this.state;
    const { mediaClientConfig } = this.mediaPluginState || {};
    if (!viewMediaClientConfig && mediaClientConfig) {
      this.setState({
        viewMediaClientConfig: mediaClientConfig,
      });
    }
  }

  setMediaItems = (props: MediaGroupProps, updatedAttrs = false) => {
    const { node } = props;
    const oldMediaNodes = this.mediaNodes;
    this.mediaNodes = [] as Array<PMNode>;
    node.forEach((item, childOffset) => {
      const getPos = () => {
        const pos = props.getPos();

        if (typeof pos !== 'number') {
          // That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
          // Because the original code would return NaN on runtime
          // We are just make it explict now.
          // We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
          // TODO: ED-13910 prosemirror-bump leftovers
          return NaN;
        }

        return pos + childOffset + 1;
      };
      this.mediaNodes.push(item);
      if (updatedAttrs) {
        this.updateNodeAttrs(props, item, getPos);
      }
    });

    this.mediaPluginState?.handleMediaGroupUpdate(
      oldMediaNodes,
      this.mediaNodes,
    );
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
        const pos = getPos();

        if (typeof pos !== 'number') {
          // That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
          // Because the original code would return NaN on runtime
          // We are just make it explict now.
          // We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
          // TODO: ED-13910 prosemirror-bump leftovers
          return NaN;
        }

        return pos + idx + 1;
      };

      // Media Inline creates a floating toolbar with the same options, excludes these options if enabled
      const mediaInlineOptions = (allowMediaInline: boolean = false) => {
        if (!allowMediaInline) {
          return {
            shouldEnableDownloadButton: mediaOptions.enableDownloadButton,
            actions: [
              {
                handler:
                  disabled || !this.mediaPluginState
                    ? () => {}
                    : this.mediaPluginState.handleMediaNodeRemoval.bind(
                        null,
                        undefined,
                        getNodePos,
                      ),
                icon: (
                  <EditorCloseIcon
                    label={this.props.intl.formatMessage(
                      messages.mediaGroupDeleteLabel,
                    )}
                  />
                ),
              },
            ],
          };
        }
      };

      return {
        identifier: this.getIdentifier(item),
        isLazy: allowLazyLoading,
        selected: this.isNodeSelected(getNodePos()),
        onClick: () => {
          setNodeSelection(this.props.view, getNodePos());
        },
        ...mediaInlineOptions(
          getMediaFeatureFlag('mediaInline', mediaOptions.featureFlags),
        ),
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

const IntlMediaGroup = injectIntl(MediaGroup);
export default IntlMediaGroup;

interface MediaGroupNodeViewProps {
  allowLazyLoading?: boolean;
  isCopyPasteEnabled?: boolean;
  providerFactory: ProviderFactory;
  mediaOptions: MediaOptions;
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
}

interface RenderFn {
  editorDisabledPlugin?: EditorDisabledPluginState;
}

interface MediaGroupNodeViewInternalProps {
  renderFn: (props: RenderFn) => JSX.Element | null;
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
}

function MediaGroupNodeViewInternal({
  renderFn,
  pluginInjectionApi,
}: MediaGroupNodeViewInternalProps) {
  const { editorDisabledState: editorDisabledPlugin } = useSharedPluginState(
    pluginInjectionApi,
    ['editorDisabled'],
  );
  return renderFn({ editorDisabledPlugin });
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
  render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
    const { providerFactory, mediaOptions, pluginInjectionApi } = props;
    const getPos = this.getPos as getPosHandlerNode;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          const renderFn = ({ editorDisabledPlugin }: RenderFn) => {
            if (!mediaProvider) {
              return null;
            }
            return (
              <IntlMediaGroup
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
            <MediaGroupNodeViewInternal
              renderFn={renderFn}
              pluginInjectionApi={pluginInjectionApi}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaGroupNode =
  (
    portalProviderAPI: PortalProviderAPI,
    eventDispatcher: EventDispatcher,
    providerFactory: ProviderFactory,
    mediaOptions: MediaOptions = {},
    pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined,
  ) =>
  (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
    const hasIntlContext = true;
    return new MediaGroupNodeView(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
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
