import type { ReactElement } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

/**
 * Appearance determines the icon and background color pairing indicating the message type
 */
export type Appearance = 'information' | 'warning' | 'error' | 'success' | 'discovery';

export interface SectionMessageProps {
	/**
	 * The appearance styling to use for the section message.
	 */
	appearance?: Appearance;
	/**
	 * The main content of the section message. This accepts a react node, although
	 * we recommend that this should be a paragraph.
	 */
	children: React.ReactNode;
	/**
	 * The heading of the section message.
	 */
	title?: string;
	/**
	 * Actions for the user to take after reading the section message. Accepts a ReactElement
	 * or an array of one or more SectionMessageAction React elements, which are applied as link buttons.
	 * Middle dots are automatically added between multiple link buttons, so no elements
	 * should be present between multiple actions.
	 *
	 * In general, avoid using more than two actions.
	 */
	actions?: ReactElement | ReactElement<SectionMessageActionProps>[];
	/**
	 * An Icon component to be rendered instead of the default icon for the component.
	 * This should only be an `@atlaskit/icon` icon. You can check out [this example](/packages/design-system/section-message/example/custom-icon)
	 * to see how to provide this icon.
	 */
	icon?: React.ElementType;
	/**
	 * Displays a dismiss button, that allows the user to dismiss the message.
	 * It will be removed from the DOM immediately and will not be re-rendered.
	 * It does not handle persistence of the dismissed state across page reloads or remounts.
	 */
	isDismissible?: boolean;
	/**
	 * A `testId` prop is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface SectionMessageActionProps {
	/**
	 * The text that needs to be displayed for section message action.
	 */
	children: React.ReactNode;
	/**
	 * A custom link component. This prop is designed to allow a custom link
	 * component to be passed to the rendered link button. The
	 * intended use-case is for when a custom router component such as react router
	 * is being used within the application.
	 *
	 * This component will only be used if a href prop is passed.
	 */
	linkComponent?: React.ComponentType<any>;
	/**
	 * Click handler which will be attached to the rendered link button. The second argument can be used to
	 * track analytics data. See the tutorial in the analytics-next package for details.
	 */
	onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * The URL that the rendered link button will point to.
	 */
	href?: string;
	/**
	 * The target attribute of the link. This is only used if the href prop is passed.
	 */
	target?: HTMLAnchorElement['target'];
	/**
	 * A `testId` prop is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}
