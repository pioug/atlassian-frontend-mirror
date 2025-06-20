import React, { forwardRef } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import LogInIcon from '@atlaskit/icon/core/log-in';
import type { AnchorProps } from '@atlaskit/primitives/anchor';

import { ListItem } from '../../components/list-item';

import { LinkIconButton } from './themed/migration';

interface LogInProps extends Pick<AnchorProps, 'href'> {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels.
	 * They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for
	 * information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics)
	 * or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).
	 */
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Called when the mouse enters the element container.
	 * Allows preloading popup components
	 */
	onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
}
/**
 * __Log in__
 *
 * The Log in button for the top navigation.
 */
export const LogIn = forwardRef<HTMLAnchorElement, LogInProps>(
	({ onClick, onMouseEnter, testId, interactionName, href, label }, ref) => (
		/**
		 * This component doesn't use `EndItem` internally because it renders a
		 * `LinkIconButton` instead of an `IconButton`.
		 *
		 * We could make another abstraction, but this is the only top navigation item
		 * that renders a link.
		 */
		<ListItem>
			<LinkIconButton
				ref={ref}
				label={label}
				href={href}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				testId={testId}
				interactionName={interactionName}
				icon={LogInIcon}
				appearance="subtle"
				isTooltipDisabled={false}
			/>
		</ListItem>
	),
);
