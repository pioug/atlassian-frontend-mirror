import React, { forwardRef } from 'react';

import type { PopupComponentProps } from '@atlaskit/popup';

import { PopupComponentContainer } from './styled';

export const PopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
  (props, ref) => (
    <PopupComponentContainer
      {...props}
      data-testId={'confluence-search-datasource-popup-container'}
      ref={ref}
    />
  ),
);
