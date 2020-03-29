import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React from 'react';
import Lozenge from '../src';

export default function Example() {
  return (
    <div>
      <AtlaskitThemeProvider mode="light">
        <p>
          default: <Lozenge>default</Lozenge>
        </p>
        <p>
          appearance: new <Lozenge appearance="new">New</Lozenge>
        </p>
        <p>
          appearance: {`{ backgroundColor: 'green' }`}{' '}
          <Lozenge appearance={{ backgroundColor: 'green' }}>Success</Lozenge>
        </p>
        <p>
          appearance: {`{ backgroundColor: 'yellow', textColor: 'blue' }`}{' '}
          <Lozenge
            appearance={{ backgroundColor: 'yellow', textColor: 'blue' }}
          >
            Custom
          </Lozenge>
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
