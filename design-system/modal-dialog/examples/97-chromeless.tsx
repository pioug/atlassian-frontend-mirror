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
        width: '400px',
        height: '450px',
        margin: '40px',
        position: 'relative',
        borderRadius: '3px',
        backgroundColor: token('elevation.surface.overlay'),
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
