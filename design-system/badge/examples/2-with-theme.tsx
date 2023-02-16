/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Badge from '../src';

export default function Example() {
  return (
    <div>
      <AtlaskitThemeProvider mode="dark">
        <p>
          Default: <Badge>{1}</Badge>
        </p>
        <p>
          appearance: important <Badge appearance="important">{2}</Badge>
        </p>
        <p>
          style:{' '}
          {`{ backgroundColor: 'green', color: <default dark mode text color>  }`}{' '}
          <Badge
            style={{
              backgroundColor: 'green',
            }}
          >
            {3}
          </Badge>
        </p>
        <p>
          style: {`{ backgroundColor: 'green', color: 'lightgreen' }`}{' '}
          <Badge style={{ backgroundColor: 'green', color: 'lightgreen' }}>
            {4}
          </Badge>
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
