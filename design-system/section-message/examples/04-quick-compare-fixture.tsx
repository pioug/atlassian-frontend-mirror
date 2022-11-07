import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import SectionMessage, { SectionMessageAction } from '../src';

const SomeParts = ({
  body,
  title,
  actions,
}: {
  body?: boolean;
  title?: boolean;
  actions?: boolean;
}) => (
  <SectionMessage
    title={title ? 'The Modern Prometheus' : undefined}
    actions={
      actions
        ? [
            <SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
              Mary
            </SectionMessageAction>,
            <SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
              Villa Diodatti
            </SectionMessageAction>,
            <SectionMessageAction>M. J. Godwin</SectionMessageAction>,
          ]
        : []
    }
  >
    {body && (
      <Text>
        You will rejoice to hear that no disaster has accompanied the
        commencement of an enterprise which you have regarded with such evil
        forebodings. I arrived here yesterday, and my first task is to assure my
        dear sister of my welfare and increasing confidence in the success of my
        undertaking.
      </Text>
    )}
  </SectionMessage>
);

const Example = () => (
  <>
    <Text>
      This example has been constructed for ease-of-reference and comparison in
      developing section message. It is not a suggested implementation.
    </Text>
    <Box display="block" padding="scale.100">
      <Stack gap="scale.200">
        <SomeParts body title actions />
        <SomeParts body title />
        <SomeParts body actions />
        <SomeParts title actions />
        <SomeParts body />
        <SomeParts title />
        <SomeParts actions />
      </Stack>
    </Box>
  </>
);

export default Example;
