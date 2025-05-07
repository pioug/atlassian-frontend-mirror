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
	 * Unique ID for a hover card. Used for analytics.
	 */
	id?: string;

	/**
	 * Hover card will display data from this url.
	 */
	url: string;

	/**
	 * React children component over which the hover card can be triggered.
	 */
	children: ReactElement;

	/**
	 * Determines if the hover card is allowed to open. If changed from true to false while the
	 * hover card is open, the hover card will be closed.
	 */
	canOpen?: boolean;

	/**
	 * Determines if the hover card should close when the children passed in are
	 * clicked.
	 */
	closeOnChildClick?: boolean;

	/**
	 * Configure visibility of server and client actions
	 */
	actionOptions?: CardActionOptions;

	/**
	 * Z-index that the hover card should be displayed in.
	 * This is passed to the portal component.
	 */
	zIndex?: number;

	/**
	 * Additional configurations for hover card.
	 */
	hoverPreviewOptions?: HoverPreviewOptions;

	/**
	 * Use this to set the accessibility role for the hover card.
	 * Should be used along with `label` or `titleId` for supported roles.
	 */
	role?: string;

	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the hover card to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` attribute is strongly recommended.
	 */
	label?: string;

	/**
	 * Id referenced by the hover card `aria-labelledby` attribute.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;
}

/**
 * An internal props that internal smart-card components can use to configure
 * hover preview behaviour. The prop contains here are suitable for unsafe
 * or experiment props that will not be or are yet ready to be available on
 * standalone hover card.
 */
export interface HoverCardInternalProps {
	/**
	 * Allow click event to bubble up from hover preview trigger component.
	 * @see EDM-7187 for further details
	 */
	allowEventPropagation?: boolean;
	/**
	 * Suspend hover card UI delays (fade-in, fade-out) for VR testing purposes.
	 */
	noFadeDelay?: boolean;
	/**
	 * A flag to determine whether to show aria-label
	 * @deprecated remove when cleaning up FG platform_bandicoots-smart-card-disable-aria
	 */
	showLabel?: boolean;
}

export interface HoverCardComponentProps extends HoverCardProps, HoverCardInternalProps {
	analyticsHandler?: AnalyticsHandler;
	canOpen?: boolean;
	closeOnChildClick?: boolean;
}

export type HoverCardContentProps = {
	id?: string;
	cardState: CardState;
	renderers?: CardProviderRenderers;
	onActionClick: (actionId: string | ActionName) => void;
	onResolve: () => void;
	url: string;
	onMouseEnter?: MouseEventHandler;
	onMouseLeave?: MouseEventHandler;
	actionOptions?: CardActionOptions;
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
