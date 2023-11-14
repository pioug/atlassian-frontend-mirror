import React from 'react';
import { Component } from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import memoizeOne from 'memoize-one';

import {
  getNodeRenderer,
  getExtensionModuleNodePrivateProps,
} from '@atlaskit/editor-common/extensions';

import type {
  ExtensionHandlers,
  ExtensionProvider,
  ReferenceEntity,
  ExtensionParams,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import { getExtensionRenderer } from '@atlaskit/editor-common/utils';

import Extension from './Extension';
import InlineExtension from './InlineExtension';
import type { ProsemirrorGetPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type {
  PluginInjectionAPIWithDependency,
  EditorAppearance,
} from '@atlaskit/editor-common/types';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
  extensionProvider?: Promise<ExtensionProvider>;
  references?: ReferenceEntity[];
  editorAppearance?: EditorAppearance;
  pluginInjectionApi: PluginInjectionAPIWithDependency<WidthPlugin> | undefined;
}

export interface State {
  extensionProvider?: ExtensionProvider;
  extensionHandlersFromProvider?: ExtensionHandlers;
  _privateProps?: {
    __hideFrame?: boolean;
  };
}

export default class ExtensionComponent extends Component<Props, State> {
  private privatePropsParsed = false;

  state: State = {};
  mounted = false;

  UNSAFE_componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const { extensionProvider } = this.props;

    if (extensionProvider) {
      this.setStateFromPromise('extensionProvider', extensionProvider);
    }
  }

  componentDidUpdate() {
    this.parsePrivateNodePropsIfNeeded();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { extensionProvider } = nextProps;
    if (
      extensionProvider &&
      this.props.extensionProvider !== extensionProvider
    ) {
      this.setStateFromPromise('extensionProvider', extensionProvider);
    }
  }

  // memoized to avoid rerender on extension state changes
  getNodeRenderer = memoizeOne(getNodeRenderer);
  getExtensionModuleNodePrivateProps = memoizeOne(
    getExtensionModuleNodePrivateProps,
  );

  render() {
    const {
      node,
      handleContentDOMRef,
      editorView,
      references,
      editorAppearance,
      pluginInjectionApi,
    } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            getPos={this.props.getPos}
            references={references}
            extensionProvider={this.state.extensionProvider}
            handleContentDOMRef={handleContentDOMRef}
            view={editorView}
            editorAppearance={editorAppearance}
            hideFrame={this.state._privateProps?.__hideFrame}
            pluginInjectionApi={pluginInjectionApi}
          >
            {extensionHandlerResult}
          </Extension>
        );
      case 'inlineExtension':
        return (
          <InlineExtension node={node}>
            {extensionHandlerResult}
          </InlineExtension>
        );
      default:
        return null;
    }
  }

  private setStateFromPromise = (
    stateKey: keyof State,
    promise?: Promise<any>,
  ) => {
    promise &&
      promise.then((p) => {
        if (!this.mounted) {
          return;
        }

        this.setState({
          [stateKey]: p,
        });
      });
  };

  /**
   * Parses any private nodes once an extension provider is available.
   *
   * We do this separately from resolving a node renderer component since the
   * private props come from extension provider, rather than an extension
   * handler which only handles `render`/component concerns.
   */
  private parsePrivateNodePropsIfNeeded = async () => {
    if (this.privatePropsParsed || !this.state.extensionProvider) {
      return;
    }
    this.privatePropsParsed = true;

    const { extensionType, extensionKey } = this.props.node.attrs;

    /**
     * getExtensionModuleNodePrivateProps can throw if there are issues in the
     * manifest
     */
    try {
      const privateProps = await this.getExtensionModuleNodePrivateProps(
        this.state.extensionProvider,
        extensionType,
        extensionKey,
      );

      this.setState({
        _privateProps: privateProps,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Provided extension handler has thrown an error\n', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }
  };

  private tryExtensionHandler() {
    const { node } = this.props;
    try {
      const extensionContent = this.handleExtension(node);
      if (extensionContent && React.isValidElement(extensionContent)) {
        return extensionContent;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Provided extension handler has thrown an error\n', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }
    return null;
  }

  private handleExtension = (pmNode: PMNode) => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType, extensionKey, parameters, text } = pmNode.attrs;
    const isBodiedExtension = pmNode.type.name === 'bodiedExtension';

    if (isBodiedExtension) {
      return;
    }

    const fragmentLocalId = pmNode?.marks?.find(
      (m) => m.type.name === 'fragment',
    )?.attrs?.localId;

    const node: ExtensionParams<Parameters> = {
      type: pmNode.type.name as
        | 'extension'
        | 'inlineExtension'
        | 'bodiedExtension',
      extensionType,
      extensionKey,
      parameters,
      content: text,
      localId: pmNode.attrs.localId,
      fragmentLocalId,
    };

    let result;

    if (extensionHandlers && extensionHandlers[extensionType]) {
      const render = getExtensionRenderer(extensionHandlers[extensionType]);
      result = render(node, editorView.state.doc);
    }

    if (!result) {
      const extensionHandlerFromProvider =
        this.state.extensionProvider &&
        this.getNodeRenderer(
          this.state.extensionProvider,
          extensionType,
          extensionKey,
        );

      if (extensionHandlerFromProvider) {
        const NodeRenderer = extensionHandlerFromProvider;
        return <NodeRenderer node={node} references={this.props.references} />;
      }
    }

    return result;
  };
}
