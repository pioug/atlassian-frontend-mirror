/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const contentStyles = css({
  maxWidth: 220,
  padding: token('space.200', '16px'),
  backgroundColor: token('utility.elevation.surface.current', '#FFFFFF'),
});

const headerStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
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

const PopupSurfaceDetectionExample = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      content={() => (
        <div css={contentStyles}>
          <div css={headerStyles}>Header overlay</div>
          <p>
            The header's background color is set to the current surface color
            and will overlay this content.
          </p>
        </div>
      )}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          appearance="primary"
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Open'} popup
        </Button>
      )}
    />
  );
};

export default PopupSurfaceDetectionExample;
