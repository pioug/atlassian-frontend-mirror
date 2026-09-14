/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Shared utilities for TagNew and AvatarTag components.
 * Note: CSS styles cannot be shared due to Compiled CSS static analysis requirements.
 */

import { type ComponentType, Fragment, type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
