import React, { type ComponentType, Fragment, type ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

// Props for the link wrapper
interface LinkWrapperProps {
	isLink: boolean;
	href?: string;
	LinkComponent: ComponentType<any>;
	testId?: string;
	children: ReactNode;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void;
	linkHandlers?: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onMouseDown: () => void;
		onFocus: () => void;
		onBlur: () => void;
	};
}

// Shared component for conditional link wrapping
export function LinkWrapper({
	isLink,
	href,
	LinkComponent,
	testId,
	children,
	onClick,
	linkHandlers,
}: LinkWrapperProps): JSX.Element {
	if (isLink && href) {
		return (
			<LinkComponent
				href={href}
				testId={testId ? `${testId}--link` : undefined}
				onClick={onClick}
				onMouseEnter={linkHandlers?.onMouseEnter}
				onMouseLeave={linkHandlers?.onMouseLeave}
				onMouseDown={linkHandlers?.onMouseDown}
				onFocus={linkHandlers?.onFocus}
				onBlur={linkHandlers?.onBlur}
			>
				{children}
			</LinkComponent>
		);
	}
	return <Fragment>{children}</Fragment>;
}
