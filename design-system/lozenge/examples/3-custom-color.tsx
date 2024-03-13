import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';
import { token } from '@atlaskit/tokens';

import Lozenge from '../src';

export default function Example() {
  return (
    <Stack space="space.100" testId="test-container">
      <Text>
        default: <Lozenge>default</Lozenge>
      </Text>
      <Text>
        appearance: new <Lozenge appearance="new">New</Lozenge>
      </Text>
      <Text>
        style: {`{ backgroundColor: 'green' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color1"
          style={{
            backgroundColor: 'green',
            color: token('color.text.inverse'),
          }}
        >
          Success
        </Lozenge>
      </Text>
      <Text>
        style: {`{ backgroundColor: 'yellow', color: 'blue' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color2"
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          style={{ backgroundColor: 'yellow', color: 'blue' }}
        >
          Custom
        </Lozenge>
      </Text>
    </Stack>
  );
}
