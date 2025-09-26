import React from 'react';

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import Button from '@atlaskit/button/standard-button';
import { type CustomThemeButtonProps } from '@atlaskit/button/types';
import __noop from '@atlaskit/ds-lib/noop';

interface BreadcrumbsButtonProps extends CustomThemeButtonProps, WithAnalyticsEventsProps {
	hasOverflow?: boolean;

	/**
	 * Additional information to be included in the `context` of analytics events
	 */
	analyticsContext?: Record<string, any>;
}

const analyticsAttributes = {
	componentName: 'breadcrumbsItem',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const noop = __noop;

/**
 * __Step__
 *
 * A button that represents a single step in a breadcrumbs component.
 */
const StepOld: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<BreadcrumbsButtonProps> & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, BreadcrumbsButtonProps>(
	(
		{
			analyticsContext,
			component,
			hasOverflow = true,
			href = '#',
			iconAfter,
			iconBefore,
			onClick: onClickProvided = noop,
			target,
			testId,
			// Button does not take `createAnalyticsEvent`, but it is spread on anyway
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
				{...props}
				appearance="subtle-link"
				component={component}
				href={href}
				iconAfter={hasOverflow ? undefined : iconAfter}
				iconBefore={hasOverflow ? undefined : iconBefore}
				onClick={handleClicked}
				ref={ref}
				spacing="none"
				target={target}
				testId={testId}
			/>
		);
	},
);

export default StepOld;
