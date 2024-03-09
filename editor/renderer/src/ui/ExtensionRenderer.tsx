/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { FC } from 'react';
import React, { Fragment } from 'react';
import memoizeOne from 'memoize-one';

import type { RendererContext } from '../react/types';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import { getNodeRenderer } from '@atlaskit/editor-common/extensions';
import type {
  ExtensionHandlers,
  ExtensionProvider,
  MultiBodiedExtensionActions,
} from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { getExtensionRenderer } from '@atlaskit/editor-common/utils';
import type { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export interface Props {
  type:
    | 'extension'
    | 'inlineExtension'
    | 'bodiedExtension'
    | 'multiBodiedExtension';
  extensionHandlers?: ExtensionHandlers;
  providers?: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  actions?: MultiBodiedExtensionActions;
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

const inlineExtensionStyle = css({
  display: 'inline-block',
  maxWidth: '100%',
  verticalAlign: 'middle',
  // es-lint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  margin: `1px 1px ${token('space.050', '4px')}`,
  '& .rich-media-item': {
    maxWidth: '100%',
  },
});

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
      actions,
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
        if (node.type === 'multiBodiedExtension') {
          result = <NodeRenderer node={node} actions={actions} />;
        } else if (node.type === 'inlineExtension') {
          result = (
            <InlineNodeRendererWrapper>
              <NodeRenderer node={node} />
            </InlineNodeRendererWrapper>
          );
        } else {
          result = <NodeRenderer node={node} />;
        }
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

const InlineNodeRendererWrapper: FC = ({ children }) => {
  if (getBooleanFF('platform.editor.inline_extension.extended_lcqdn')) {
    return (
      <div className="inline-extension-renderer" css={inlineExtensionStyle}>
        {children}
      </div>
    );
  }
  return <Fragment>{children}</Fragment>;
};
