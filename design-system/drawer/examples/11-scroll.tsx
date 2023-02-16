/** @jsx jsx */

import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

/**
 * Styles to allow the body to be scrollable and placed for the VR snapshot.
 */
const containerStyles = css({
  display: 'flex',
  height: '200%',
  padding: token('space.200', '16px'),
  justifyContent: 'flex-end',
});

const DrawersExample = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  return (
    <div css={containerStyles}>
      <div>
        <p>
          This body content will not be scrollable while the drawer is open.
        </p>
        <br />
        <br />
        <p>Only the drawer content will be scrollable.</p>

        <br />
        <br />
        <Button type="button" onClick={openDrawer} testId="open-drawer">
          Open drawer
        </Button>
      </div>

      <Drawer onClose={closeDrawer} isOpen={isOpen}>
        {/* Strictly used to target the content drawer for programmatic scrolling… */}
        <div data-testid="content-inner" />
        <Lorem count={100} />
      </Drawer>
    </div>
  );
};

export default DrawersExample;
