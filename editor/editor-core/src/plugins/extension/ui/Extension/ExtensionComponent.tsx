import React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import memoizeOne from 'memoize-one';

import {
  ExtensionHandlers,
  getExtensionRenderer,
  getNodeRenderer,
  ExtensionProvider,
} from '@atlaskit/editor-common';
import { ADFEntity } from '@atlaskit/adf-utils';

import Extension from './Extension';
import InlineExtension from './InlineExtension';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
  extensionProvider?: Promise<ExtensionProvider>;
  refNode?: ADFEntity;
}

export interface State {
  extensionProvider?: ExtensionProvider;
  extensionHandlersFromProvider?: ExtensionHandlers;
}

export default class ExtensionComponent extends Component<Props, State> {
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

  render() {
    const { node, handleContentDOMRef, editorView, refNode } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            refNode={refNode}
            extensionProvider={this.state.extensionProvider}
            handleContentDOMRef={handleContentDOMRef}
            view={editorView}
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

    const node = {
      type: pmNode.type.name as
        | 'extension'
        | 'inlineExtension'
        | 'bodiedExtension',
      extensionType,
      extensionKey,
      parameters,
      content: text,
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
        return <NodeRenderer node={node} refNode={this.props.refNode} />;
      }
    }

    return result;
  };
}
