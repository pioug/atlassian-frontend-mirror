import React from 'react';
import { disableZooming } from './utils/viewport';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  cardProvider,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import Editor from './../src/labs/mobile-editor-element';

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  providerFactory: ProviderFactory;

  constructor(props: any) {
    super(props);

    this.providerFactory = new ProviderFactory();
    this.providerFactory.setProvider('card', Promise.resolve(cardProvider));
    this.providerFactory.setProvider(
      'media',
      storyMediaProviderFactory({
        collectionName: 'InitialCollectionForTesting',
        includeUserAuthProvider: true,
      }),
    );
  }

  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually is set by native)
    (window as any).bridge.setPadding(32, 16, 0, 16);
  }

  render() {
    return (
      <div id="editor">
        <Editor
          providerFactory={this.providerFactory}
          placeholder="Type something here"
          shouldFocus={true}
        />
      </div>
    );
  }
}
