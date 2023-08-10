/** @jsx jsx */
import React from 'react';
import { PopupComponentProps } from '@atlaskit/popup';
import { popupContainerStyles } from '../styled';
import { jsx } from '@emotion/react';

const CustomPopupContainer = React.forwardRef<
  HTMLDivElement,
  PopupComponentProps
>(({ children, ...props }, ref) => (
  <div css={popupContainerStyles} {...props} ref={ref}>
    {children}
  </div>
));
export default CustomPopupContainer;
