/** @jsx jsx */
import React, { ReactElement, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

const navigatorStyles = css({
  paddingRight: gridSize / 2,
  paddingLeft: gridSize / 2,
});

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
      css={navigatorStyles}
    />
  );
}
