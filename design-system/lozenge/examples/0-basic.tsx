import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Lozenge, { ThemeAppearance } from '../src';

const APPEARANCES: { label: string; value: ThemeAppearance }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Success', value: 'success' },
  { label: 'Removed', value: 'removed' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'New', value: 'new' },
  { label: 'Moved', value: 'moved' },
];

export default () => (
  <Stack testId="test-container" gap="sp-400">
    <Inline gap="sp-400">
      <Stack gap="sp-100">
        <Text fontWeight="500">Subtle</Text>
        <>
          {APPEARANCES.map((a) => (
            <Box key={a.value}>
              <Lozenge appearance={a.value} testId="lozenge-subtle">
                {a.label}
              </Lozenge>
            </Box>
          ))}
        </>
      </Stack>
      <Stack gap="sp-100">
        <Text fontWeight="500">Bold</Text>
        <>
          {APPEARANCES.map((a) => (
            <Box key={a.value}>
              <Lozenge appearance={a.value} isBold testId="lozenge-bold">
                {a.label}
              </Lozenge>
            </Box>
          ))}
        </>
      </Stack>
    </Inline>

    <Stack gap="sp-100">
      <Text fontWeight="500">Overflowed Lozenge</Text>
      <Box>
        <Lozenge testId="lozenge-truncated">
          Long text will be truncated after a point.
        </Lozenge>
      </Box>
      <Box>
        <Lozenge
          appearance="new"
          maxWidth={250}
          testId="lozenge-truncated-custom-width"
        >
          Long text will be truncated after a point.
        </Lozenge>
      </Box>
    </Stack>

    <Stack gap="sp-100">
      <Text fontWeight="500">Defaults</Text>
      <Box>
        <Lozenge maxWidth="none" testId="lozenge-defaults">
          Default appearance and boldness
        </Lozenge>
      </Box>
    </Stack>
  </Stack>
);
