import React from 'react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import Button from '@atlaskit/button/standard-button';
import { type CustomThemeButtonProps } from '@atlaskit/button/types';
import __noop from '@atlaskit/ds-lib/noop';

interface BreadcrumbsButtonProps extends CustomThemeButtonProps {
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
const Step = React.forwardRef<HTMLButtonElement, BreadcrumbsButtonProps>(
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

export default Step;
