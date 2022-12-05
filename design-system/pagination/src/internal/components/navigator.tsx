import React, { ReactElement, SyntheticEvent } from 'react';

import Button from '@atlaskit/button/standard-button';

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
    />
  );
}
