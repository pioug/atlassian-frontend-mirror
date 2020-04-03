import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React from 'react';
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
          appearance: {`{ backgroundColor: 'green' }`}{' '}
          <Badge appearance={{ backgroundColor: 'green' }}>{3}</Badge>
        </p>
        <p>
          appearance: {`{ backgroundColor: 'green', textColor: 'light green' }`}{' '}
          <Badge
            appearance={{ backgroundColor: 'green', textColor: 'light green' }}
          >
            {4}
          </Badge>
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
