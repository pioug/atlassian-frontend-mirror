import React, { ReactElement, SyntheticEvent } from 'react';

import Button from '@atlaskit/button/standard-button';

export type NavigatorProps<T> = {
  /**
   * This will be passed in as aria-label to the button. Use this to supply a descriptive label for assistive technology.
   */
  'aria-label'?: string;
  /**
   * Sets whether the navigator is disabled.
   */
  isDisabled?: boolean;
  iconBefore: ReactElement;
  pages: T[];
  testId?: string;
  /**
   * This function is called when the user clicks on the navigator.
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
