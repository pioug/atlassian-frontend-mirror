/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Drawer from '../../src';

const wrapperStyles = css({
  position: 'relative',
});

const contentStyles = css({
  padding: token('space.100', '8px'),
});

const headerStyles = css({
  padding: token('space.100', '8px'),
  position: 'sticky',
  backgroundColor: token('utility.elevation.surface.current', '#FFFFFF'),
  borderBlockEnd: `1px solid ${token('color.border', '#CCCCCC')}`,
  boxShadow: token(
    'elevation.shadow.overflow',
    '0px 0px 8px rgba(9, 30, 66, 0.16)',
  ),
  insetBlockStart: 0,
  insetInlineEnd: 0,
  insetInlineStart: 0,
});

const DrawerSurfaceDetectionExample = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Drawer
        onClose={() => setOpen(false)}
        isOpen={open}
        titleId="drawerTitle"
      >
        <div css={wrapperStyles}>
          <div css={headerStyles}>
            <h1 id="drawerTitle">Header overlay</h1>
          </div>
          <div css={contentStyles}>
            <Lorem count={10} />
          </div>
        </div>
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
    </Fragment>
  );
};

export default DrawerSurfaceDetectionExample;
