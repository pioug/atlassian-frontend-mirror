import React, { type FC, type ReactNode } from 'react';

import {
	createAndFireEvent,
	type UIAnalyticsEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import Field from './field';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface CommentTimeProps extends WithAnalyticsEventsProps {
	/**
	 * The time of the comment.
	 */
	children?: ReactNode;
	/**
	 * The URL of the link. If not provided, the element will be rendered as text.
	 */
	href?: string;
	/**
	 * Handler called when the element is clicked.
	 */
	onClick?: (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
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

const CommentTimeComponent: FC<CommentTimeProps> = ({
	children,
	href,
	onClick,
	onFocus,
	onMouseOver,
}) => {
	return (
		<Field href={href} onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
			{children}
		</Field>
	);
};

CommentTimeComponent.displayName = 'CommentTime';

export { CommentTimeComponent as CommentTimeWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

/**
 * __Comment time__
 *
 * The time the comment was made.
 */
const CommentTime = withAnalyticsContext({
	componentName: 'commentTime',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onClick: createAndFireEventOnAtlaskit({
			action: 'clicked',
			actionSubject: 'commentTime',

			attributes: {
				componentName: 'commentTime',
				packageName,
				packageVersion,
			},
		}),
	})(CommentTimeComponent),
);

export default CommentTime;
