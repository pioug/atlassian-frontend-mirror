import React from 'react';
import { RendererContext } from '../react';
import { Serializer } from '../index';
import { ExtensionLayout } from '@atlaskit/adf-schema';

import {
  ADNode,
  ExtensionHandlers,
  getExtensionRenderer,
  WithProviders,
  ExtensionProvider,
  ProviderFactory,
  getNodeRenderer,
} from '@atlaskit/editor-common';

export interface Props {
  type: 'extension' | 'inlineExtension' | 'bodiedExtension';
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  providers?: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  content?: any;
  layout?: ExtensionLayout;
  children: ({
    result,
  }: {
    result?: JSX.Element | ADNode[] | null;
  }) => JSX.Element;
}

export interface State {
  extensionProvider?: ExtensionProvider | null;
}

export default class ExtensionRenderer extends React.Component<Props, State> {
  state = {
    extensionProvider: null,
  };

  mounted = false;

  UNSAFE_componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleProvider = (name: keyof State, providerPromise?: Promise<any>) => {
    providerPromise &&
      providerPromise.then(provider => {
        if (this.mounted) {
          this.setState({ [name]: provider });
        }
      });
  };

  renderExtensionNode = (extensionProvider?: ExtensionProvider | null) => {
    const {
      extensionHandlers,
      rendererContext,
      extensionType,
      extensionKey,
      parameters,
      content,
      text,
      type,
    } = this.props;

    const extensionParams = {
      type,
      extensionKey,
      extensionType,
      parameters,
      content: content || text,
    };

    let result = null;

    try {
      if (extensionHandlers && extensionHandlers[extensionType]) {
        const render = getExtensionRenderer(extensionHandlers[extensionType]);
        result = render(extensionParams, rendererContext.adDoc);
      }

      if (!result && extensionProvider) {
        const NodeRenderer = getNodeRenderer(
          extensionProvider,
          extensionType,
          extensionKey,
        );

        result = <NodeRenderer extensionParams={extensionParams} />;
      }
    } catch (e) {
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }

    return this.props.children({ result });
  };

  setupAndRenderExtensionNode = (providers: {
    extensionProvider?: Promise<ExtensionProvider>;
  }) => {
    const { extensionProvider } = this.state;

    if (!extensionProvider && providers.extensionProvider) {
      this.handleProvider('extensionProvider', providers.extensionProvider);
    }

    return this.renderExtensionNode(extensionProvider);
  };

  render() {
    const { providers } = this.props;

    if (!providers) {
      return this.setupAndRenderExtensionNode({});
    }

    return (
      <WithProviders
        providers={['extensionProvider']}
        providerFactory={providers}
        renderNode={this.setupAndRenderExtensionNode}
      />
    );
  }
}
