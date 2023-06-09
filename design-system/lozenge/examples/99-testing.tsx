import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Lozenge from '../src';

export default function Example() {
  return (
    <AtlaskitThemeProvider mode="light">
      <Stack space="space.100">
        <Box>
          <Text>
            default: <Lozenge testId="default-lozenge">default</Lozenge>
          </Text>
        </Box>

        <Box>
          <Text>
            appearance: new{' '}
            <Lozenge appearance="new" testId="new-lozenge">
              New
            </Lozenge>
          </Text>
        </Box>

        <Box>
          <Text>
            style: {`{ backgroundColor: 'green' }`}{' '}
            <Lozenge
              style={{ backgroundColor: 'green' }}
              testId="themed-lozenge"
            >
              Success
            </Lozenge>
          </Text>
        </Box>
      </Stack>
    </AtlaskitThemeProvider>
  );
}
