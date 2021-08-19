import React from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Lozenge from '../src';

export default function Example() {
  return (
    <div>
      <AtlaskitThemeProvider mode="light">
        <p>
          default: <Lozenge testId="default-lozenge">default</Lozenge>
        </p>
        <p>
          appearance: new{' '}
          <Lozenge appearance="new" testId="new-lozenge">
            New
          </Lozenge>
        </p>
        <p>
          style: {`{ backgroundColor: 'green' }`}{' '}
          {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
          <Lozenge style={{ backgroundColor: 'green' }} testId="themed-lozenge">
            Success
          </Lozenge>
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
