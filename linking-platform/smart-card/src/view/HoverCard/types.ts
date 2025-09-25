import { type MouseEventHandler, type ReactElement } from 'react';

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import type { ActionName } from '../../constants';
import { type AnalyticsHandler } from '../../utils/types';
import type { CardActionOptions } from '../Card/types';

export interface HoverCardProps extends WithAnalyticsEventsProps {
	/**
	 * Configure visibility of server and client actions
	 */
	actionOptions?: CardActionOptions;

	/**
	 * Allow click event to bubble up from hover preview trigger component.
	 */
	allowEventPropagation?: boolean;

	/**
	 * Determines if the hover card is allowed to open. If changed from true to false while the
	 * hover card is open, the hover card will be closed.
	 */
	canOpen?: boolean;

	/**
	 * React children component over which the hover card can be triggered.
	 */
	children: ReactElement;

	/**
	 * Determines if the hover card should close when the children passed in are
	 * clicked.
	 */
	closeOnChildClick?: boolean;

	/**
	 * Additional configurations for hover card.
	 */
	hoverPreviewOptions?: HoverPreviewOptions;

	/**
	 * Unique ID for a hover card. Used for analytics.
	 */
	id?: string;

	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the hover card to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` attribute is strongly recommended.
	 */
	label?: string;

	/**
	 * Callback function that is called when the hover card is visible or hidden.
	 */
	onVisibilityChange?: (isVisible: boolean) => void;

	/**
	 * Use this to set the accessibility role for the hover card.
	 * Should be used along with `label` or `titleId` for supported roles.
	 */
	role?: string;

	/**
	 * Id referenced by the hover card `aria-labelledby` attribute.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;

	/**
	 * Hover card will display data from this url.
	 */
	url: string;

	/**
	 * Z-index that the hover card should be displayed in.
	 * This is passed to the portal component.
	 */
	zIndex?: number;
}

/**
 * An internal props that internal smart-card components can use to configure
 * hover preview behaviour. The prop contains here are suitable for unsafe
 * or experiment props that will not be or are yet ready to be available on
 * standalone hover card.
 */
export interface HoverCardInternalProps {
	/**
	 * Suspend hover card UI delays (fade-in, fade-out) for VR testing purposes.
	 */
	noFadeDelay?: boolean;
}

export interface HoverCardComponentProps extends HoverCardProps, HoverCardInternalProps {
	analyticsHandler?: AnalyticsHandler;
	canOpen?: boolean;
	closeOnChildClick?: boolean;
}

export type HoverCardContentProps = {
	actionOptions?: CardActionOptions;
	cardState: CardState;
	id?: string;
	onActionClick: (actionId: string | ActionName) => void;
	onMouseEnter?: MouseEventHandler;
	onMouseLeave?: MouseEventHandler;
	onResolve: () => void;
	renderers?: CardProviderRenderers;
	url: string;
};

export type ContentContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	isAIEnabled?: boolean;
	testId?: string;
	url: string;
};

export type ImagePreviewProps = {
	fallbackElementHeight: number;
	response?: SmartLinkResponse;
};
export interface HoverPreviewOptions {
	/**
	 * Delay (in milliseconds) between hovering over the trigger element and the hover card opening. Defaults to 500ms.
	 */
	fadeInDelay?: number;
}
