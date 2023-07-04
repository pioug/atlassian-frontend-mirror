/** @jsx jsx */
import { forwardRef, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
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
  ({ children, ...props }, ref) => (
    <Box xcss={containerStyles} {...props} ref={ref}>
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
        <Button
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          iconBefore={<MoreIcon label="More" />}
        />
      )}
    />
  );
};

export default PopupCustomExample;
