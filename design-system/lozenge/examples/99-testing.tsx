import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React from 'react';
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
          appearance: {`{ backgroundColor: 'green' }`}{' '}
          <Lozenge
            appearance={{ backgroundColor: 'green' }}
            testId="themed-lozenge"
          >
            Success
          </Lozenge>
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
