import { type MessageDescriptor } from 'react-intl-next';

import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import { type FireEventFunction } from '../../common/analytics/types';
import { type SmartLinkSize, type SmartLinkStatus, type SmartLinkTheme } from '../../constants';
import { type AISummaryConfig } from '../../state/hooks/use-ai-summary-config/types';
import { type ResolveFunction } from '../../state/hooks/use-resolve';
import { type AnalyticsOrigin } from '../../utils/types';
import {
	type CardActionOptions,
	type CardInnerAppearance,
	type OnResolveCallback,
} from '../Card/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import { type OnErrorCallback } from '../types';

export type FlexibleCardProps = {
	/**
	 * @internal A unique ID for a Smart Link.
	 */
	id?: string;

	/**
	 * Determines the appearance of the Smart Link.
	 * @internal
	 */
	appearance?: CardInnerAppearance;

	/**
	 * Determines the status and data of the Smart Link.
	 * @internal
	 */
	cardState: CardState;

	/**
	 * The Flexible UI block component(s) to be rendered.
	 * The minimum is a TitleBlock.
	 */
	children: React.ReactNode;

	/**
	 * Determines the onClick behaviour of Flexible UI. This will proxy to the
	 * TitleBlock if supplied.
	 */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

	/**
	 * An additional action that can be performed when link is not resolved, e.g.
	 * connect account to gain access to 403 link.
	 * @internal
	 */
	onAuthorize?: () => void;

	/**
	 * function to be called after a flexible card has rendered its error states
	 */
	onError?: OnErrorCallback;

	/**
	 * function to be called after a flexible card has rendered its resolved state
	 */
	onResolve?: OnResolveCallback;

	/**
	 * Smart links origin for analytics purposes
	 */
	origin?: AnalyticsOrigin;

	/**
	 * Any additional renderers required by Flexible UI. Currently used by icon
	 * to render Emoji.
	 */
	renderers?: CardProviderRenderers;

	/**
	 * Configure visibility of server and client actions
	 */
	actionOptions?: CardActionOptions;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Determines the appearance of Flexible UI.
	 * @see InternalFlexibleUiOptions
	 */
	ui?: InternalFlexibleUiOptions;

	/**
	 * Determines the URL of the Smart Link.
	 */
	url: string;

	/**
	 * Determine whether or not a preview card should show up when a user hovers
	 * over the smartlink. Default value is false.
	 */
	showHoverPreview?: boolean;

	/**
	 * Configuration options for hover preview
	 */
	hoverPreviewOptions?: HoverPreviewOptions;

	/**
	 * Competitor Prompt Component for Competitor link experiment
	 */
	CompetitorPrompt?: React.ComponentType<{ sourceUrl: string; linkType?: string }>;
	/**
	 * For image icons in the title, whether to show a loading skeleton while the image is loading.
	 */
	hideIconLoadingSkeleton?: boolean;
};

export type InternalFlexibleUiOptions = FlexibleUiOptions & {
	hideLegacyButton?: boolean;
};

export type FlexibleUiOptions = {
	/**
	 * Determines whether the entire Smart Link container should be clickable.
	 */
	clickableContainer?: boolean;

	/**
	 * Determines whether to hide elevation styling.
	 */
	hideElevation?: boolean;

	/**
	 * Determines whether to hide css padding styling.
	 */
	hidePadding?: boolean;

	/**
	 * Determines whether to hide css background color styling.
	 */
	hideBackground?: boolean;

	/**
	 * Remove TitleBlock requirement and child component restriction.
	 * When `true`, Card with any children will be rendered as flexible card.
	 * Card will no longer remove child components that are not flexible card blocks.
	 * TitleBlock is no longer required.
	 */
	removeBlockRestriction?: boolean;

	/**
	 * Determines the default padding and sizing of the underlying blocks and
	 * elements within Flexible UI.
	 */
	size?: SmartLinkSize;

	/**
	 * Determines the default theme of the Flexible UI.
	 * Can be Black or Link (default URL blue)
	 */
	theme?: SmartLinkTheme;

	/**
	 * Z-index that Atlaskit portal component should be displayed in.
	 * This is passed to the portal component.
	 */
	zIndex?: number;

	/**
	 * Flag to enable specific SmartCard components to directly enable or disable the SnippetRennderer override
	 */
	enableSnippetRenderer?: boolean;
};

/**
 * Retry options used if Smart Link resolves to an errored state.
 */
export type RetryOptions = {
	/**
	 * Determines the error message to show.
	 */
	descriptor?: MessageDescriptor;

	/**
	 * Determines the onClick behaviour of the error message.
	 */
	onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;

	/**
	 * A list of optional value pairs for string interpolation in the message.
	 */
	values?: Record<string, string>;
};

export type ExtractFlexibleUiDataContextParams = Pick<
	FlexibleCardProps,
	'appearance' | 'id' | 'actionOptions' | 'origin' | 'onAuthorize' | 'onClick' | 'renderers' | 'url'
> & {
	fireEvent?: FireEventFunction;
	status?: SmartLinkStatus;
	response?: SmartLinkResponse;
	resolve?: ResolveFunction;
	aiSummaryConfig?: AISummaryConfig;
	isPreviewPanelAvailable?: (params: { ari: string }) => boolean;
	openPreviewPanel?: (params: {
		ari: string;
		url: string;
		name: string;
		iconUrl: string | undefined;
	}) => void;
};

/**
 * Mark a specific props in the type as optional.
 * FlexibleCard use this concept where base component has required props
 * and the extended component provides these props. The props become an optional
 * for the extended component but is still available for override/callback.
 *
 * For example: Action component require onClick callback to perform action
 * but PreviewAction defines the onClick behaviour inside its component.
 * PreviewAction still wants the onClick for a callback to executed after the
 * action completes, but it is optional.
 *
 * Usage:
 *   type ActionProps = { onClick: () => {}, content: string, icon?: React.ReactNode }
 *   type PreviewActionProps = Optional<ActionProps, 'onClick'>
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & {
	[K in keyof T]?: T[K];
};
