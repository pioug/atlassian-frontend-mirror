import React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  selectParentNodeOfType,
  findSelectedNodeOfType,
} from 'prosemirror-utils';
import {
  ExtensionHandlers,
  getExtensionRenderer,
  getNodeRenderer,
  ExtensionProvider,
} from '@atlaskit/editor-common';
import { setNodeSelection } from '../../../../utils';
import Extension from './Extension';
import InlineExtension from './InlineExtension';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
  extensionProvider?: Promise<ExtensionProvider>;
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

  render() {
    const { node, handleContentDOMRef, editorView } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            extensionProvider={this.state.extensionProvider}
            handleContentDOMRef={handleContentDOMRef}
            onSelectExtension={this.handleSelectExtension}
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
      promise.then(p => {
        if (!this.mounted) {
          return;
        }

        this.setState({
          [stateKey]: p,
        });
      });
  };

  private handleSelectExtension = (hasBody: boolean) => {
    const {
      state,
      state: { selection, schema },
      dispatch,
    } = this.props.editorView;
    let { tr } = state;

    if (hasBody) {
      tr = selectParentNodeOfType([schema.nodes.bodiedExtension])(state.tr);
      dispatch(tr);
    } else if (
      !findSelectedNodeOfType([
        schema.nodes.inlineExtension,
        schema.nodes.extension,
        schema.nodes.bodiedExtension,
      ])(selection)
    ) {
      setNodeSelection(this.props.editorView, selection.$from.pos - 1);
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

  private handleExtension = (node: PMNode) => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType, extensionKey, parameters, text } = node.attrs;
    const isBodiedExtension = node.type.name === 'bodiedExtension';

    if (isBodiedExtension) {
      return;
    }

    const extensionParams = {
      type: node.type.name as
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
      result = render(extensionParams, editorView.state.doc);
    }

    if (!result) {
      const extensionHandlerFromProvider =
        this.state.extensionProvider &&
        getNodeRenderer(
          this.state.extensionProvider,
          extensionType,
          extensionKey,
        );

      if (extensionHandlerFromProvider) {
        const NodeRenderer = extensionHandlerFromProvider;
        return <NodeRenderer extensionParams={extensionParams} />;
      }
    }

    return result;
  };
}
