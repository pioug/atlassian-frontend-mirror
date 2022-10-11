import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import SectionMessage, { SectionMessageAction } from '../src';

const Example = () => (
  <Box testId="appearance-example" display="block" padding="sp-100">
    <Stack gap="sp-200">
      <SectionMessage appearance="information" title="More">
        <Stack gap="sp-100">
          <Text>I count the steps from one end of my island to the other</Text>
          <Text>It{"'"}s a hundred steps from where I sleep to the sea</Text>
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
        <Stack gap="sp-100">
          <Text>And when I say I{"'"}ve learned all there is to know</Text>
          <Text>Well there{"'"}s another little island lesson</Text>
          <Text>Gramma Tala shows me</Text>
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
        <Stack gap="sp-100">
          <Text>I know where I am from the scent of the breeze</Text>
          <Text>The ascent of the climb</Text>
          <Text>From the tangle of the trees</Text>
        </Stack>
      </SectionMessage>

      <SectionMessage appearance="success">
        <Stack gap="sp-100">
          <Text>From the angle of the mountain</Text>
          <Text>To the sand on our island shore</Text>
          <Text>I{"'"}ve been here before</Text>
        </Stack>
      </SectionMessage>

      <SectionMessage appearance="discovery">
        <Stack gap="sp-100">
          <Text>From the angle of the mountain</Text>
          <Text>To the sand on our island shore</Text>
          <Text>I{"'"}ve been here before</Text>
        </Stack>
      </SectionMessage>
    </Stack>
  </Box>
);

export default Example;
