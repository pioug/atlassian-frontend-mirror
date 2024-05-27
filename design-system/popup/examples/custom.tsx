/** @jsx jsx */
import { forwardRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { token } from '@atlaskit/tokens';

import Popup, { type PopupComponentProps } from '../src';

const containerStyles = css({
  backgroundColor: token('color.background.neutral.bold'),
  borderRadius: token('border.radius', '3px'),
  ':focus': {
    outline: 'none',
  },
});
const contentStyles = css({
  width: 175,
  height: 250,
});
const CustomPopupContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
  ({ children, ...props }, ref) => (
    <div css={containerStyles} {...props} ref={ref}>
      {children}
    </div>
  ),
);

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      popupComponent={CustomPopupContainer}
      content={() => <div css={contentStyles} />}
      trigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          label="More"
          icon={MoreIcon}
        />
      )}
    />
  );
};
