/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Lozenge from '../src';

export default () => (
  <Stack gap="scale.100" testId="test-container">
    <Text as="p">
      <Text fontWeight="500" as="p">
        Constrained by maxWidth:{' '}
      </Text>
      <Lozenge
        appearance="success"
        maxWidth={150}
        testId="lozenge-truncated-by-maxWidth"
      >
        very very very wide text which truncates
      </Lozenge>
    </Text>

    <Text fontWeight="500">Constrained by container size: </Text>
    <Box
      borderColor="danger"
      borderStyle="solid"
      borderWidth="1px"
      UNSAFE_style={{ width: 125, overflow: 'hidden' }}
    >
      <Lozenge
        appearance="success"
        maxWidth={150}
        testId="lozenge-truncated-by-container-size"
      >
        very very very wide text which truncates
      </Lozenge>
    </Box>
  </Stack>
);
