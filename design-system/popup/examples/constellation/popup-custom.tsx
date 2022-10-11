/** @jsx jsx */
import { forwardRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Popup, { PopupComponentProps } from '../../src';

const containerStyles = css({
  padding: 15,
  backgroundColor: token('color.background.brand.bold', '#0C66E4'),
  borderRadius: borderRadius(),
  color: token('color.text.inverse', '#FFF'),
});

const CustomPopupContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
  ({ children, ...props }, ref) => (
    <div css={containerStyles} {...props} ref={ref}>
      {children}
    </div>
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
      content={() => <div>Customized popup</div>}
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
