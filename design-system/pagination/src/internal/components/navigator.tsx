import React, { type ReactElement, type SyntheticEvent } from 'react';

import Button from '@atlaskit/button/standard-button';

type NavigatorProps<T> = {
	/**
	 * This will be passed in as aria-label to the button. Use this to supply a descriptive label for assistive technology.
	 */
	'aria-label'?: string;
	/**
	 * Sets whether the navigator is disabled.
	 */
	isDisabled?: boolean;
	iconBefore: ReactElement;
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
			aria-label={props['aria-label']}
			isDisabled={props.isDisabled}
			iconBefore={props.iconBefore}
			testId={props.testId}
			onClick={props.onClick}
			component={props.component}
			appearance="subtle"
		/>
	);
}
