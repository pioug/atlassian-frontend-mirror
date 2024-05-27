/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { type BackgroundColor, Box, xcss } from '@atlaskit/primitives';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';

import Card from './94-card';

const boxStyles = xcss({
  flexShrink: 0,
  borderRadius: 'border.radius',
  width: 'size.500',
  height: 'size.500',
});

const JSMCard: FC<{
  title: string;
  iconColor: BackgroundColor;
  children?: ReactNode;
}> = ({
  iconColor = 'color.background.discovery',
  children = 'Wow, finally after so many years, we have an amazing portal with a long description to top up the lorem ipsum',
  title = 'Title',
}) => {
  return (
    <Card>
      <Inline space="space.200">
        <Box backgroundColor={iconColor} xcss={boxStyles} />
        <Stack space="space.100">
          <Heading as="h3" level="h600">
            {title}
          </Heading>
          <span>{children}</span>
        </Stack>
      </Inline>
    </Card>
  );
};

export default JSMCard;
