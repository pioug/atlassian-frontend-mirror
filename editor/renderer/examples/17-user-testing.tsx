import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import Button from '@atlaskit/button/standard-button';

import {
  LOCALSTORAGE_defaultDocKey,
  LOCALSTORAGE_defaultTitleKey,
} from '@atlaskit/editor-core/examples/5-full-page';

import { default as Renderer } from '../src/ui/Renderer';
import Sidebar from './helper/NavigationNext';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default class ExampleRenderer extends React.Component {
  constructor(props: object) {
    super(props);

    // opens an iframe
    if (window.top !== window.self) {
      window.top.location.replace(location.href);
    }
  }

  render() {
    return (
      <Sidebar showSidebar={true}>
        {(additionalProps: object) => (
          <React.Fragment>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button tabIndex={-1} onClick={this.handleRedirect}>
                Edit
              </Button>
            </div>
            <h1 style={{ margin: '20px 0' }}>
              {localStorage
                ? localStorage.getItem(LOCALSTORAGE_defaultTitleKey)
                : null}
            </h1>
            <Renderer
              dataProviders={providerFactory}
              {...additionalProps}
              extensionHandlers={extensionHandlers}
              document={
                localStorage
                  ? JSON.parse(
                      localStorage.getItem(LOCALSTORAGE_defaultDocKey) || '{}',
                    )
                  : undefined
              }
            />
          </React.Fragment>
        )}
      </Sidebar>
    );
  }

  private handleRedirect = () => {
    location.href = location.href.replace('renderer', 'editor-core');
  };
}
