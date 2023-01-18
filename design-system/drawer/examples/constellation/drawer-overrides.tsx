/* eslint-disable @repo/internal/react/use-primitives */
/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Drawer from '../../src';

const SidebarOverrideStyles = css({
  display: 'flex',
  width: 64,
  height: '100vh',
  // TODO Delete this comment after verifying spacing token -> previous value `24`
  paddingTop: token('spacing.scale.300', '24px'),
  // TODO Delete this comment after verifying spacing token -> previous value `16`
  paddingBottom: token('spacing.scale.200', '16px'),
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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
