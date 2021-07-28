/** @jsx jsx */
import { forwardRef, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { N700 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import Popup, { PopupComponentProps } from '../src';

const containerStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: N700,
  borderRadius: borderRadius(),
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
