import React, { type FC, type ReactNode } from 'react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';

import Field from './field';

export interface CommentTimeProps {
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

const CommentTime: FC<CommentTimeProps> = ({
	children,
	href,
	onClick: providedOnClick,
	onFocus,
	onMouseOver,
}) => {
	const onClick = usePlatformLeafEventHandler<React.MouseEvent<HTMLAnchorElement, MouseEvent>>({
		fn: (event, analyticsEvent) => providedOnClick && providedOnClick(event, analyticsEvent),
		action: 'clicked',
		componentName: 'commentTime',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	return (
		<Field href={href} onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
			{children}
		</Field>
	);
};

CommentTime.displayName = 'CommentTime';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default CommentTime;
