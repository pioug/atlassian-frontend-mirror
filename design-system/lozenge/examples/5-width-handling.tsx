import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Lozenge from '../src';

export default () => (
  <Stack gap="space.100" testId="test-container">
    <Text>
      <Lozenge appearance="success" testId="lozenge-truncated-default-short">
        short text
      </Lozenge>
    </Text>
    <Text>
      <Lozenge appearance="success" testId="lozenge-truncated-default-long">
        very very wide text which truncates by default
      </Lozenge>
    </Text>
    <Text>
      <Lozenge
        appearance="success"
        maxWidth={100}
        testId="lozenge-truncated-override-100"
      >
        100px maxwidth truncates
      </Lozenge>
    </Text>
    <Stack
      gap="space.100"
      testId="test-container"
      UNSAFE_style={{
        width: '400px',
        border: `solid 1px ${token('color.border', N30A)}`,
      }}
    >
      <Text>
        <Text fontWeight="medium" as="p">
          In a 400px wide container
        </Text>
        <Lozenge
          appearance="new"
          maxWidth={'none'}
          testId="lozenge-truncated-override-none"
        >
          "none" max-width does not truncate text
        </Lozenge>
      </Text>
      <Text>
        <Lozenge
          appearance="new"
          maxWidth={'100%'}
          testId="lozenge-truncated-override-100%"
        >
          "100%" max-width does not truncate text
        </Lozenge>
      </Text>
      <Text>
        <Lozenge
          appearance="new"
          maxWidth={'90%'}
          testId="lozenge-truncated-override-90%"
        >
          "90%" max-width does not truncate text
        </Lozenge>
      </Text>
      <Text>
        <Lozenge
          appearance="new"
          maxWidth={'50%'}
          testId="lozenge-truncated-override-50%"
        >
          "50%" max-width does truncate text
        </Lozenge>
      </Text>
    </Stack>

    <Text as="p">
      <Text fontWeight="medium" as="p">
        Constrained by maxWidth
      </Text>
      <Lozenge
        appearance="success"
        maxWidth={150}
        testId="lozenge-truncated-by-maxWidth"
      >
        very very very wide text which truncates
      </Lozenge>
    </Text>

    <Text fontWeight="medium">Constrained by container size</Text>
    <Box UNSAFE_style={{ width: 125, overflow: 'hidden' }}>
      <Lozenge
        appearance="success"
        testId="lozenge-truncated-by-container-size"
      >
        very very very wide text which truncates
      </Lozenge>
    </Box>

    <Text fontWeight="medium">
      In a % width context truncates at lowest of % and maxWidth
    </Text>
    <Box UNSAFE_style={{ width: '20%', overflow: 'hidden' }}>
      <Lozenge appearance="success" testId="lozenge-truncated-by-container-pc">
        very very very wide text which truncates
      </Lozenge>
    </Box>
  </Stack>
);
