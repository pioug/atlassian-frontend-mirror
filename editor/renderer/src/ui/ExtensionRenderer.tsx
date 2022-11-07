import React from 'react';
import memoizeOne from 'memoize-one';

import { RendererContext } from '../react/types';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import { getNodeRenderer } from '@atlaskit/editor-common/extensions';
import type {
  ExtensionHandlers,
  ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import {
  WithProviders,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { getExtensionRenderer } from '@atlaskit/editor-common/utils';
import { Mark as PMMark } from 'prosemirror-model';

export interface Props {
  type: 'extension' | 'inlineExtension' | 'bodiedExtension';
  extensionHandlers?: ExtensionHandlers;
  providers?: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  content?: any;
  layout?: ExtensionLayout;
  localId?: string;
  marks?: PMMark[];
  children: ({ result }: { result?: JSX.Element | null }) => JSX.Element;
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
      providerPromise.then((provider) => {
        if (this.mounted) {
          this.setState({ [name]: provider });
        }
      });
  };

  getNodeRenderer = memoizeOne(getNodeRenderer);

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
      localId,
      marks,
    } = this.props;

    const fragmentLocalId = marks?.find((m) => m.type.name === 'fragment')
      ?.attrs?.localId;

    const node = {
      type,
      extensionKey,
      extensionType,
      parameters,
      content: content || text,
      localId,
      fragmentLocalId,
    };

    let result = null;

    try {
      if (extensionHandlers && extensionHandlers[extensionType]) {
        const render = getExtensionRenderer(extensionHandlers[extensionType]);
        result = render(node, rendererContext.adDoc);
      }

      if (!result && extensionProvider) {
        const NodeRenderer = this.getNodeRenderer(
          extensionProvider,
          extensionType,
          extensionKey,
        );

        result = <NodeRenderer node={node} />;
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
