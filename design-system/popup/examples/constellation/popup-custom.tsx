/** @jsx jsx */
import { forwardRef, useState } from 'react';

import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { Box, xcss } from '@atlaskit/primitives';

import Popup, { PopupComponentProps } from '../../src';

const containerStyles = xcss({
  padding: 'space.200',
  backgroundColor: 'color.background.brand.bold',
  borderRadius: 'border.radius',
  color: 'color.text.inverse',
});

const CustomPopupContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
  ({ children, 'data-testid': testId, ...props }, ref) => (
    <Box xcss={containerStyles} testId={testId} {...props} ref={ref}>
      {children}
    </Box>
  ),
);

const PopupCustomExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      popupComponent={CustomPopupContainer}
      content={() => <Box>Customized popup</Box>}
      trigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          icon={MoreIcon}
          label="More"
        />
      )}
    />
  );
};

export default PopupCustomExample;
