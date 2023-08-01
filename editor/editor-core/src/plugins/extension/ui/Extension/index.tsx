import React from 'react';
import { Component } from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
  ExtensionHandlers,
  ReferenceEntity,
} from '@atlaskit/editor-common/extensions';
import {
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { ProsemirrorGetPosHandler } from '../../../../nodeviews/types';
import type { EditorAppearance } from '../../../../types/editor-appearance';
import ExtensionComponent from './ExtensionComponent';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginInjectionAPIWithDependency } from '@atlaskit/editor-common/types';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  providerFactory?: ProviderFactory;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
  references?: ReferenceEntity[];
  editorAppearance?: EditorAppearance;
  pluginInjectionApi:
    | PluginInjectionAPIWithDependency<typeof widthPlugin>
    | undefined;
}

export default class Extension extends Component<Props, any> {
  static displayName = 'Extension';

  private providerFactory: ProviderFactory;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.providerFactory || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providerFactory) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = ({ extensionProvider }: Providers) => {
    const {
      node,
      getPos,
      editorView,
      handleContentDOMRef,
      extensionHandlers,
      references,
      editorAppearance,
      pluginInjectionApi,
    } = this.props;

    return (
      <ExtensionComponent
        editorView={editorView}
        node={node}
        getPos={getPos}
        references={references}
        extensionProvider={extensionProvider}
        handleContentDOMRef={handleContentDOMRef}
        extensionHandlers={extensionHandlers}
        editorAppearance={editorAppearance}
        pluginInjectionApi={pluginInjectionApi}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['extensionProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
