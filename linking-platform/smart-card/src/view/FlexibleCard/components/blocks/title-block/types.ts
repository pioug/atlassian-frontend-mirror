import type React from 'react';

import { type SmartLinkPosition, type SmartLinkTheme } from '../../../../../constants';
import { type RetryOptions } from '../../../types';
import { type AnchorTarget } from '../../types';
import {
	type ActionItem,
	type BlockProps,
	type ElementItem,
	type OnActionMenuOpenChangeOptions,
} from '../types';

export type TitleBlockProps = {
	/**
	 * An array of action items to be displayed after the title
	 * on the right of the block.
	 * An action item provides preset icon and label, with exception of
	 * a custom action which either Icon or label must be provided.
	 * @see ActionItem
	 */
	actions?: ActionItem[];

	/**
	 * Determines the href target behaviour of the Link.
	 */
	anchorTarget?: AnchorTarget;

	/**
	 * [Experiment] Determines whether the linked title should display tooltip on hover.
	 */
	hideTitleTooltip?: boolean;

	/**
	 * Determines the maximum number of lines for the underlying link text to
	 * spread over. Default is 2. Maximum is 2.
	 */
	maxLines?: number;

	/**
	 * An array of metadata elements to display in the TitleBlock.
	 * By default elements will be shown to the right of the TitleBlock.
	 * The visibility of the element is determine by the link data.
	 * If link contain no data to display a particular element, the element
	 * will simply not show up.
	 * @see ElementItem
	 */
	metadata?: ElementItem[];

	/**
	 * Called when the action dropdown menu (if present) is open/closed.
	 * Receives an object with `isOpen` state.
	 */
	onActionMenuOpenChange?: (options: OnActionMenuOpenChangeOptions) => void;

	/**
	 * Determines the position of the link icon in relative to the vertical
	 * height of the TitleBlock.  It can either be centred or placed on “top”.
	 * Default is top.
	 */
	position?: SmartLinkPosition;

	/**
	 * Determines the onClick behaviour of the Link. By default used for analytics.
	 * @internal
	 * @deprecated Remove on platform-linking-flexible-card-context cleanup
	 */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

	/**
	 * The options that determine the retry behaviour when a Smart Link errors.
	 * @internal
	 */
	retry?: RetryOptions;

	/**
	 * This option determines whenever we show any of the links and messages on the right side of the block,
	 * like "connect to preview" or "Can't find link" or "Restricted link, try another account" etc.
	 * Default is false.
	 */
	hideRetry?: boolean;

	/**
	 * Determines whether TitleBlock will hide actions until the user is hovering
	 * over the link.
	 */
	showActionOnHover?: boolean;

	/**
	 * An array of metadata elements to display in the TitleBlock.
	 * By default elements will be shown below the link text.
	 * The visibility of the element is determine by the link data.
	 * If link contain no data to display a particular element, the element
	 * will simply not show up.
	 * @see ElementItem
	 */
	subtitle?: ElementItem[];

	/**
	 * The text to display in the link. Overrides any text that is retrieved from
	 * the Smart Link.
	 */
	text?: string;

	/**
	 * The icon to display in the title block. Overrides any icon that is retrieved from
	 * the Smart Link.
	 */
	icon?: React.ReactNode;

	/**
	 * The theme of the link text. Can be Black or Link (default URL blue)
	 * @internal
	 * @deprecated Remove on platform-linking-flexible-card-context cleanup
	 */
	theme?: SmartLinkTheme;

	/**
	 * The vertical position of the metadata fields. Internal prop, please DO NOT USE.
	 * @internal
	 */
	metadataPosition?: SmartLinkPosition;

	/**
	 * Determines whether TitleBlock will hide the Link Icon.
	 */
	hideIcon?: boolean;
	/**
	 * Ref passed into the link <a> element
	 */
	anchorRef?: React.Ref<HTMLAnchorElement>;

	/**
	 * A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.
	 */
	placeholderId?: string;

	/**
	 * Competitor Prompt Component for Competitor link experiment
	 */
	CompetitorPrompt?: React.ComponentType<{ sourceUrl: string; linkType?: string }>;

	/**
	 * The URL of the link for Competitor Prompt experiment
	 */
	url?: string;
} & BlockProps;

export type TitleBlockViewProps = TitleBlockProps & {
	actionGroup?: React.ReactNode;
	title: React.ReactNode;
};
