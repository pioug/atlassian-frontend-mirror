/** @jsx jsx */
import React, { ReactElement, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

const navigatorStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `gridSize / 2`
  paddingRight: token('spacing.scale.050', '4px'),
  // TODO Delete this comment after verifying spacing token -> previous value `gridSize / 2`
  paddingLeft: token('spacing.scale.050', '4px'),
});

export type NavigatorProps<T> = {
  /**
   * This will be passed in as aria-label to button. This is what screen reader will read
   */
  'aria-label'?: string;
  /**
   * Is the navigator disabled
   */
  isDisabled?: boolean;
  iconBefore: ReactElement;
  pages: T[];
  testId?: string;
  /**
   * This function is called with the when user clicks on navigator
   */
  onClick?: (event: SyntheticEvent) => void;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  component?: React.ElementType<any>;
};

export default function Navigator<T>(props: NavigatorProps<T>) {
  return (
    <Button
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
      appearance="subtle"
      spacing="none"
      css={navigatorStyles}
    />
  );
}
