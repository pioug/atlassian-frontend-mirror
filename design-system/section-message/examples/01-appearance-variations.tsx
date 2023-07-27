import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import { Box, Stack } from '@atlaskit/primitives';

import SectionMessage, { SectionMessageAction } from '../src';

const Example = () => (
  <Box testId="appearance-example" padding="space.100">
    <Stack space="space.200">
      <SectionMessage appearance="information" title="More">
        <Stack space="space.100">
          <Text as="p">
            I count the steps from one end of my island to the other
          </Text>
          <Text as="p">
            It{"'"}s a hundred steps from where I sleep to the sea
          </Text>
        </Stack>
      </SectionMessage>

      <SectionMessage
        appearance="warning"
        actions={
          <SectionMessageAction href="https://www.youtube.com/watch?v=upjbIJESEUU">
            Outtake
          </SectionMessageAction>
        }
      >
        <Stack space="space.100">
          <Text as="p">
            And when I say I{"'"}ve learned all there is to know
          </Text>
          <Text as="p">Well there{"'"}s another little island lesson</Text>
          <Text as="p">Gramma Tala shows me</Text>
        </Stack>
      </SectionMessage>

      <SectionMessage
        appearance="error"
        actions={[
          <SectionMessageAction
            // eslint-disable-next-line @repo/internal/react/use-noop
            onClick={() => {}}
          >
            Outtake
          </SectionMessageAction>,
          <SectionMessageAction>Moana</SectionMessageAction>,
        ]}
      >
        <Stack space="space.100">
          <Text as="p">I know where I am from the scent of the breeze</Text>
          <Text as="p">The ascent of the climb</Text>
          <Text as="p">From the tangle of the trees</Text>
        </Stack>
      </SectionMessage>

      <SectionMessage appearance="success">
        <Stack space="space.100">
          <Text as="p">From the angle of the mountain</Text>
          <Text as="p">To the sand on our island shore</Text>
          <Text as="p">I{"'"}ve been here before</Text>
        </Stack>
      </SectionMessage>

      <SectionMessage appearance="discovery">
        <Stack space="space.100">
          <Text as="p">From the angle of the mountain</Text>
          <Text as="p">To the sand on our island shore</Text>
          <Text as="p">I{"'"}ve been here before</Text>
        </Stack>
      </SectionMessage>
    </Stack>
  </Box>
);

export default Example;
