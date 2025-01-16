import React, { forwardRef, type ReactNode } from 'react';

import {
	type UIAnalyticsEvent,
	usePlatformLeafEventHandler,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

export interface CommentActionItemProps extends WithAnalyticsEventsProps {
	/**
	 * The content to render inside the action button.
	 */
	children?: ReactNode;
	/**
	 * Set if the action button is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Handler called when the element is clicked.
	 */
	onClick?: (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	/**
	 * Handler called when the element is focused.
	 */
	onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
	/**
	 * Handler called when the element is moused over.
	 */
	onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const ActionItem = forwardRef<HTMLSpanElement, CommentActionItemProps>(
	({ children, onClick: providedOnClick, onFocus, onMouseOver, isDisabled }, ref) => {
		const onClick = usePlatformLeafEventHandler<React.MouseEvent<HTMLAnchorElement, MouseEvent>>({
			fn: (event, analyticsEvent) => providedOnClick && providedOnClick(event, analyticsEvent),
			action: 'clicked',
			componentName: 'commentAction',
			packageName: process.env._PACKAGE_NAME_ as string,
			packageVersion: process.env._PACKAGE_VERSION_ as string,
		});

		return (
			/**
			 * It is not normally acceptable to add click and key handlers to non-interactive
			 * elements as this is an accessibility anti-pattern. However, because this
			 * instance is to add support for analytics instead of creating an inaccessible
			 * custom element, we can add role="presentation" so that there are no negative
			 * impacts to assistive technologies.
			 */
			<span role="presentation" onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
				<Button
					ref={ref}
					appearance="subtle-link"
					spacing="none"
					type="button"
					isDisabled={isDisabled}
				>
					{children}
				</Button>
			</span>
		);
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ActionItem;
