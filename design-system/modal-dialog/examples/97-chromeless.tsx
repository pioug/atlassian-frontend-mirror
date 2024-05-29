import React from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Flex, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const wrapperStyles = xcss({ height: '100%', padding: 'space.300' });
const bodyStyles = xcss({ flexGrow: '2' });

export default function Example() {
  return (
    <div
      style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        width: '400px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        height: '450px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        margin: '40px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        position: 'relative',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        borderRadius: '3px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        backgroundColor: token('elevation.surface.overlay'),
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        boxShadow: token('elevation.shadow.overlay'),
      }}
    >
      <Flex gap="space.300" direction="column" xcss={wrapperStyles}>
        <Heading level="h600">You’re about to delete this page</Heading>
        <Box xcss={bodyStyles}>
          <p>
            Before you delete it permanently, there’s some things you should
            know:
          </p>
          <ul>
            <li>4 pages have links to this page that will break</li>
            <li>2 child pages will be left behind in the page tree</li>
          </ul>
        </Box>
        <Inline space="space.200" alignInline="end">
          <Button appearance="subtle">Cancel</Button>
          <Button appearance="danger" onClick={() => {}}>
            Delete
          </Button>
        </Inline>
      </Flex>
    </div>
  );
}
