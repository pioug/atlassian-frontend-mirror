import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/sticky-headers.adf.json';

import Sidebar from './helper/NavigationNext';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
  const [height, setHeight] = React.useState(30);
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          height: `${height}px`,
          width: '100%',
          background: 'green',
          color: 'white',
          textAlign: 'center',
          lineHeight: '30px',
          zIndex: 99,
        }}
      >
        Hello world{' '}
        <button onClick={() => setHeight(height * 1.5)}>bigger</button>{' '}
        <button onClick={() => setHeight(height * 0.8)}>smaller</button>
      </div>
      <Sidebar showSidebar={true}>
        {(additionalProps: object) => (
          <Renderer
            dataProviders={providerFactory}
            document={document}
            allowColumnSorting
            stickyHeaders={{
              offsetTop: height,
              show: true,
            }}
            {...additionalProps}
          />
        )}
      </Sidebar>
    </>
  );
}
