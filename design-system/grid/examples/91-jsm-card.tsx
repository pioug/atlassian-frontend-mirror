/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_BoxProps as BoxProps,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';

import Card from './94-card';

const JSMCard: FC<{
  title: string;
  iconColor: BoxProps['backgroundColor'];
}> = ({
  iconColor = 'discovery',
  children = 'Wow, finally after so many years, we have an amazing portal with a long description to top up the lorem ipsum',
  title = 'Title',
}) => {
  return (
    <Card>
      <Inline gap="scale.200">
        <Box
          UNSAFE_style={{ flexShrink: 0 }}
          display="block"
          backgroundColor={iconColor}
          borderRadius="normal"
          width="size.500"
          height="size.500"
        />
        <Stack gap="scale.100">
          <Heading as="h3" level="h600">
            {title}
          </Heading>
          <Text>{children}</Text>
        </Stack>
      </Inline>
    </Card>
  );
};

export default JSMCard;
