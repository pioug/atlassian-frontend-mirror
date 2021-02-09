import React from 'react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import Button from '@atlaskit/button/standard-button';
import { CustomThemeButtonProps } from '@atlaskit/button/types';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

interface BreadcrumbsButtonProps extends CustomThemeButtonProps {
  hasOverflow?: boolean;

  /** Additional information to be included in the `context` of analytics events */
  analyticsContext?: Record<string, any>;
}

const analyticsAttributes = {
  componentName: 'breadcrumbsItem',
  packageName,
  packageVersion,
};

const noop = () => {};

export default React.forwardRef<HTMLButtonElement, BreadcrumbsButtonProps>(
  (
    {
      hasOverflow = true,
      href = '#',
      onClick: onClickProvided = noop,
      analyticsContext,
      iconBefore,
      iconAfter,
      ...props
    },
    ref,
  ) => {
    const handleClicked = usePlatformLeafEventHandler({
      fn: onClickProvided,
      action: 'clicked',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    return (
      <Button
        appearance="subtle-link"
        spacing="none"
        iconAfter={hasOverflow ? undefined : iconAfter}
        iconBefore={hasOverflow ? undefined : iconBefore}
        onClick={handleClicked}
        ref={ref}
        href={href}
        {...props}
      />
    );
  },
);
