/** @jsx jsx */
import { Fragment, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Drawer from '../../src';

const sidebarOverrideStyles = xcss({
  display: 'flex',
  width: '64px',
  height: '100vh',
  paddingBlockStart: 'space.300',
  paddingBlockEnd: 'space.200',
  alignItems: 'center',
  flexBasis: 'auto',
  flexDirection: 'column',
  backgroundColor: 'color.background.accent.yellow.subtlest',
  color: 'color.text.accent.yellow.bolder',
});

const contentOverrideStyles = xcss({
  padding: 'space.300',
  flex: 1,
  backgroundColor: 'color.background.accent.blue.subtlest',
  color: 'color.text.accent.blue.bolder',
  overflow: 'auto',
});

const DrawerOverridesExample = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Drawer
        label="Drawer with custom overrides"
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        overrides={{
          Sidebar: {
            component: ({ children }) => (
              <Box xcss={sidebarOverrideStyles}>{children} Sidebar</Box>
            ),
          },
          Content: {
            component: ({ children }) => (
              <Box xcss={contentOverrideStyles}>{children} Content</Box>
            ),
          },
        }}
        onClose={() => setOpen(false)}
        isOpen={open}
      />
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer with overrides
      </Button>
    </Fragment>
  );
};

export default DrawerOverridesExample;
