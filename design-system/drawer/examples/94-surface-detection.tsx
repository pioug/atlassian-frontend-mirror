/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

const contentStyles = css({
  padding: token('space.100', '8px'),
  position: 'relative',
});

const headerStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  backgroundColor: token('utility.elevation.surface.current', '#FFFFFF'),
  borderBottom: `1px solid ${token('color.border', '#CCCCCC')}`,
  boxShadow: token(
    'elevation.shadow.overflow',
    '0px 0px 8px rgba(9, 30, 66, 0.16)',
  ),
});

const DrawerSurfaceDetectionExample = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Fragment>
      <Drawer
        onClose={() => setOpen(false)}
        isOpen={open}
        label="Surface detection"
      >
        <div css={contentStyles}>
          <div css={headerStyles}>
            <h2>Header overlay</h2>
          </div>
          <Lorem count={2} />
        </div>
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
    </Fragment>
  );
};

export default DrawerSurfaceDetectionExample;
