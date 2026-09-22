import { type MouseEventHandler, type ReactElement } from 'react';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { CardProviderRenderers } from '@atlaskit/link-provider/types';
import type { CardState } from '@atlaskit/linking-common/store';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import type { PopupProps } from '@atlaskit/popup/types';

import type { ActionName } from '../../constants';
import { type AnalyticsHandler } from '../../utils/types';
import type { CardActionOptions, InternalCardActionOptions } from '../Card/types';

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
	 * @deprecated To be removed - Suspend hover card UI delays (fade-in, fade-out) for VR testing purposes.
	 */
	noFadeDelay?: boolean;

	/**
	 * Callback function that is called when the hover card is visible or hidden.
	 */
	onVisibilityChange?: (isVisible: boolean) => void;

	/**
	 * Where the card should sit relative to the trigger element. Omitted, the card opens below and
	 * to the right of the pointer, which is what an inline link in a body of text wants. Set it when
	 * the card would otherwise cover the content the user is pointing at — for example a row in a
	 * list, where `"left-start"` keeps the row itself visible.
	 */
	placement?: PopupProps['placement'];

	/**
	 * Use this to set the accessibility role for the hover card.
	 * Should be used along with `label` or `titleId` for supported roles.
	 */
	role?: string;

	/**
	 * Whether the hover card should render to the parent element, to the
	 * atlaskit-portal-container at the root of the document. Defaults to false.
	 */
	shouldRenderToParent?: boolean;

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
 * @deprecated To be removed - internal component prop
 */
export interface HoverCardInternalProps extends HoverCardProps {
	actionOptions?: CardActionOptions;
	/**
	 * Suspend hover card UI delays (fade-in, fade-out) for VR testing purposes.
	 */
	noFadeDelay?: boolean;
}

/**
 * @deprecated To be removed - internal component prop
 */
export interface HoverCardComponentProps extends HoverCardProps {
	analyticsHandler?: AnalyticsHandler;
	canOpen?: boolean;
	closeOnChildClick?: boolean;
}

/**
 * @deprecated To be removed - internal component prop
 */
export type HoverCardContentProps = {
	actionOptions?: InternalCardActionOptions;
	cardState: CardState;
	hoverPreviewOptions?: HoverPreviewOptions;
	id?: string;
	onActionClick: (actionId: string | ActionName) => void;
	/**
	 * Closes the hover card popup (e.g. secondary actions like "Maybe later").
	 */
	onDismiss?: () => void;
	onMouseEnter?: MouseEventHandler;
	onMouseLeave?: MouseEventHandler;
	onResolve: () => void;
	renderers?: CardProviderRenderers;
	url: string;
};

/**
 * @deprecated To be removed - internal component type
 */
export type ContentContainerWidthAppearance = 'default' | 'slim';

/**
 * @deprecated To be removed - internal component prop
 */
export type ContentContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	isAIEnabled?: boolean;
	testId?: string;
	url: string;
	/**
	 * Visual width preset for the hover card shell. Omit or `undefined` uses `'default'`.
	 */
	widthAppearance?: ContentContainerWidthAppearance;
};

/**
 * @deprecated To be removed - internal component prop
 */
export type ImagePreviewProps = {
	fallbackElementHeight: number;
	response?: SmartLinkResponse;
};

export interface HoverPreviewOptions {
	/**
	 * Delay (in milliseconds) between hovering over the trigger element and the hover card opening. Defaults to 500ms.
	 */
	fadeInDelay?: number;

	/**
	 * Render a custom component instead of the default hover card.
	 */
	render?: () => React.ReactNode;
}
