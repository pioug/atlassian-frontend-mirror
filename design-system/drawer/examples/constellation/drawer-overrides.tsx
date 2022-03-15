/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Drawer from '../../src';

const SidebarOverrideStyles = css({
  display: 'flex',
  width: 64,
  height: '100vh',
  paddingTop: 24,
  paddingBottom: 16,
  alignItems: 'center',
  flexBasis: 'auto',
  flexDirection: 'column',
  backgroundColor: token('color.background.accent.yellow.subtlest', '#FFF7D6'),
  color: token('color.text.accent.yellow.bolder', '#533F04'),
});

const ContentOverrideStyles = css({
  padding: 25,
  flex: 1,
  backgroundColor: token('color.background.accent.blue.subtlest', '#E9F2FF'),
  color: token('color.text.accent.blue.bolder', '#09326C'),
  overflow: 'auto',
});

const DrawerOverridesExample = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Drawer
        overrides={{
          Sidebar: {
            component: ({ children }) => (
              <div css={SidebarOverrideStyles}>{children} Sidebar</div>
            ),
          },
          Content: {
            component: ({ children }) => (
              <div css={ContentOverrideStyles}>{children} Content</div>
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
