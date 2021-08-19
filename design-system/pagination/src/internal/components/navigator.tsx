/** @jsx jsx */
import React, { ReactElement, SyntheticEvent } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { navigatorStyle } from '../styles';

export type NavigatorPropsType<T> = {
  /** This will be passed in as aria-label to button. This is what screen reader will read */
  'aria-label'?: string;
  /** Is the navigator disabled */
  isDisabled?: boolean;
  iconBefore: ReactElement;
  pages: T[];
  testId?: string;
  /** This function is called with the when user clicks on navigator */
  onClick?: (event: SyntheticEvent) => void;
  component?: React.ElementType<any>;
};

export default function Navigator<T>(props: NavigatorPropsType<T>) {
  return (
    <Button
      {...props}
      appearance="subtle"
      spacing="none"
      css={navigatorStyle}
    />
  );
}
