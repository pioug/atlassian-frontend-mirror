import React from 'react';

import { Provider } from '@atlaskit/smart-card';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';

export default function Example() {
  return (
    <Provider>
      <Renderer
        document={document}
        appearance="full-page"
        eventHandlers={{
          smartCard: {
            onClick: (e, url) => {
              window.open(url, '_blank');
            },
          },
        }}
      />
    </Provider>
  );
}
