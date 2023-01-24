/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Card from './94-card';

const SecondaryCard: FC = () => {
  return (
    <Card>
      <Inline gap="space.200">
        <Box
          UNSAFE_style={{ flexShrink: 0, marginBlock: 2 }}
          width="size.100"
          height="size.100"
          backgroundColor="neutral"
        />
        <Stack gap="space.050">
          <Text lineHeight="lineHeight.100">
            <a href="#id">Kudos in Kudos</a>
          </Text>
          <Text>
            Did a coworker do something you really appreicaetd or inspire you
            by...
          </Text>
        </Stack>
      </Inline>
    </Card>
  );
};

export default SecondaryCard;
