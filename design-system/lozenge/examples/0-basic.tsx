import React, { ReactNode } from 'react';

import {
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Lozenge, { ThemeAppearance } from '../src';

const Col: React.FunctionComponent<ReactNode> = ({ children }) => (
  <Stack gap="sp-100">{children}</Stack>
);

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
      <Col>
        <Text fontWeight="500">Subtle</Text>
        {APPEARANCES.map((a) => (
          <Text key={a.value as string}>
            <Lozenge appearance={a.value} testId="lozenge-subtle">
              {a.label}
            </Lozenge>
          </Text>
        ))}
      </Col>
      <Col>
        <Text fontWeight="500">Bold</Text>
        {APPEARANCES.map((a) => (
          <Text key={a.value as string}>
            <Lozenge appearance={a.value} isBold testId="lozenge-bold">
              {a.label}
            </Lozenge>
          </Text>
        ))}
      </Col>
    </Inline>

    <Col>
      <Text fontWeight="500">Overflowed Lozenge</Text>
      <Text>
        <Lozenge testId="lozenge-truncated">
          Long text will be truncated after a point.
        </Lozenge>
      </Text>
      <Text>
        <Lozenge
          appearance="new"
          maxWidth={250}
          testId="lozenge-truncated-custom-width"
        >
          Long text will be truncated after a point.
        </Lozenge>
      </Text>
    </Col>

    <Col>
      <Text fontWeight="500">Defaults</Text>
      <Text>
        <Lozenge maxWidth="none" testId="lozenge-defaults">
          Default appearance and boldness
        </Lozenge>
      </Text>
    </Col>
  </Stack>
);
