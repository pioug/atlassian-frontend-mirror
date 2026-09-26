/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
/* eslint-disable @atlaskit/design-system/no-deprecated-imports, @typescript-eslint/no-restricted-types -- Preserve existing mention implementation while focus-ring usage is reviewed separately. */

import React from 'react';

import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { type MentionEventHandler } from '../../types';
import { fireAnalyticsMentionEvent } from '../../util/fire-analytics-mention-event';
import { MentionInternal } from './MentionInternal';

export const ANALYTICS_HOVER_DELAY = 1000;

/**
 * @deprecated Use `import { UNKNOWN_USER_ID } from '@atlaskit/mention/constants'` instead.
 */
export { UNKNOWN_USER_ID } from '../../_constants';

export type OwnProps = {
	accessLevel?: string;
	appType?: string | null;
	avatarUrl?: string;
	/**
	 * Tooltip text shown on hover when the chip is disabled. Ignored when
	 * `isDisabled` is false. When omitted, no tooltip is rendered even if
	 * `isDisabled` is true.
	 */
	disabledTooltip?: string;
	id: string;
	isAvatarImagePreShaped?: boolean;
	/**
	 * When true, the mention chip is rendered in its disabled visual state
	 * (`MentionType.DISABLED`) and click handlers are not invoked. Takes
	 * precedence over `isHighlighted` and the restricted state.
	 */
	isDisabled?: boolean;
	isHighlighted?: boolean;
	/** Whether this mention represents the Rovo Chat agent. */
	isRovoChat?: boolean;
	localId?: string;
	onClick?: MentionEventHandler;
	onHover?: () => void;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	/** Whether the upstream integration has enabled the avatar treatment for this mention. */
	renderAvatarSlot?: boolean;
	ssrPlaceholderId?: string;
	text: string;
};

export type Props = OwnProps & WithAnalyticsEventsProps;

const MentionWithAnalytics = withAnalyticsEvents({
	onClick: (createEvent: CreateUIAnalyticsEvent, props: Props): UIAnalyticsEvent => {
		const { id, text, accessLevel } = props;
		const event = fireAnalyticsMentionEvent(createEvent)(
			'mention',
			'selected',
			text,
			id,
			accessLevel,
		);
		return event;
	},

	onHover: (createEvent: CreateUIAnalyticsEvent, props: Props): UIAnalyticsEvent => {
		const { id, text, accessLevel } = props;

		const event = fireAnalyticsMentionEvent(createEvent)(
			'mention',
			'hovered',
			text,
			id,
			accessLevel,
		);
		return event;
	},
})(MentionInternal);

// oxlint-disable-next-line eslint/no-redeclare
const Mention: React.ForwardRefExoticComponent<
	Omit<OwnProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = MentionWithAnalytics;

type Mention = MentionInternal;

export default Mention;

/**
 * @deprecated Use `import { MentionInternal } from '@atlaskit/mention/mention'` instead.
 */
export { MentionInternal } from './MentionInternal';
