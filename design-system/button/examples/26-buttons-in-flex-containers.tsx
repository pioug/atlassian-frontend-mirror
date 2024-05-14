import React from 'react';

import Heading from '@atlaskit/heading';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import Button, { IconButton } from '../src/new';

const stackStyles = xcss({
  width: '400px',
});

const flexStyles = xcss({
  width: '100%',
  alignItems: 'initial',
});

const padderStyles = xcss({
  backgroundColor: 'color.background.accent.blue.subtle',
  width: '100%',
  display: 'block',
});

export default function IconButtonExample() {
  return (
    <Stack space="space.100" xcss={stackStyles}>
      <Heading size="xsmall">
        Make sure buttons don't shrink in a flex container
      </Heading>
      <Inline xcss={flexStyles}>
        <Box xcss={padderStyles} />
        <IconButton
          label="Label is also used for tooltip"
          icon={StarFilledIcon}
          isTooltipDisabled={false}
          testId="please-dont-collapse"
        />
      </Inline>
      <Inline xcss={flexStyles}>
        <Box xcss={padderStyles} />
        <Button iconBefore={StarFilledIcon} testId="please-dont-collapse">
          Text not truncated
        </Button>
      </Inline>
    </Stack>
  );
}
