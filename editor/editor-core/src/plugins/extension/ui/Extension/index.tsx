import React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  ProviderFactory,
  WithProviders,
  ExtensionHandlers,
  Providers,
  ReferenceEntity,
} from '@atlaskit/editor-common';
import { EditorAppearance } from '../../../../types/editor-appearance';
import ExtensionComponent from './ExtensionComponent';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
  references?: ReferenceEntity[];
  editorAppearance?: EditorAppearance;
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
      editorView,
      handleContentDOMRef,
      extensionHandlers,
      references,
      editorAppearance,
    } = this.props;

    return (
      <ExtensionComponent
        editorView={editorView}
        node={node}
        references={references}
        extensionProvider={extensionProvider}
        handleContentDOMRef={handleContentDOMRef}
        extensionHandlers={extensionHandlers}
        editorAppearance={editorAppearance}
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
