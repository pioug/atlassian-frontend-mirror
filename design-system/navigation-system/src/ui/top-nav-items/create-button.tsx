import React, { forwardRef } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import AddIcon from '@atlaskit/icon/core/add';

import { Button } from './themed/migration';

type CreateButtonProps = {
	/**
	 * The content of the button.
	 */
	children: React.ReactNode;
	/**
	 * Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels.
	 * They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for
	 * information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics)
	 * or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).
	 */
	onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
};

/**
 * __Create button__
 *
 * The create button for the top navigation.
 */
export const CreateButton = forwardRef(
	(
		{ children, onClick, testId, interactionName }: CreateButtonProps,
		ref: React.ForwardedRef<HTMLButtonElement>,
	) => (
		<Button
			ref={ref}
			appearance="primary"
			iconBefore={AddIcon}
			onClick={onClick}
			testId={testId}
			interactionName={interactionName}
		>
			{children}
		</Button>
	),
);
