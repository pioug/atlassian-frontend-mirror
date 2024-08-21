import React, { type FC, forwardRef, type ReactNode } from 'react';

import {
	createAndFireEvent,
	type UIAnalyticsEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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

const ActionItemComponent: FC<CommentActionItemProps> = forwardRef(
	({ children, onClick, onFocus, onMouseOver, isDisabled }, ref) => {
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

export { ActionItemComponent as CommentActionWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

/**
 * __Action item__
 *
 * An action item button for a comment. For example Reply or Like.
 */
const ActionItem = withAnalyticsContext({
	componentName: 'commentAction',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onClick: createAndFireEventOnAtlaskit({
			action: 'clicked',
			actionSubject: 'commentAction',
			attributes: {
				componentName: 'commentAction',
				packageName,
				packageVersion,
			},
		}),
	})(ActionItemComponent),
);

export default ActionItem;
