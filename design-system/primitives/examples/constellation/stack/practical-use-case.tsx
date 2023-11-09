import React from 'react';

import Heading from '@atlaskit/heading';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import EmojiSymbolsIcon from '@atlaskit/icon/glyph/emoji/symbols';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack } from '@atlaskit/primitives';

export default function Example() {
  return (
    <Box backgroundColor="elevation.surface" padding="space.150">
      <Stack space="space.150">
        <Stack space="space.050">
          <Inline alignBlock="center" space="space.100">
            <Story16Icon label="" />
            <Heading level="h500">
              What we learned reviewing Atlas end to end
            </Heading>
          </Inline>
          <Inline separator="•" space="space.100">
            <Box>Created by Bradley Rogers</Box>
            <Box>5 hours ago</Box>
            <Box>Atlas</Box>
          </Inline>
        </Stack>
        What did we do? As a team, Atlas just completed our first full round of
        reviewing our end user experience from end to end. We started by
        identifying 12 top tasks…
        <Inline space="space.050">
          <Lozenge>
            <EmojiSymbolsIcon label="" />
          </Lozenge>
          <Lozenge>
            <EmojiAtlassianIcon label="" />
          </Lozenge>
          <Lozenge>
            <EmojiAddIcon label="" />
          </Lozenge>
        </Inline>
      </Stack>
    </Box>
  );
}
