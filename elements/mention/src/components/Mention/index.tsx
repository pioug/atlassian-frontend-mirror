/* eslint-disable @atlaskit/design-system/no-deprecated-imports, @typescript-eslint/ban-types -- Preserve existing mention implementation while focus-ring usage is reviewed separately. */
import React from 'react';
import FocusRing from '@atlaskit/focus-ring';

import MessagesIntlProvider from '../MessagesIntlProvider';
import PrimitiveMention from './PrimitiveMention';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
import AsyncDisabledMentionTooltip from '../DisabledMentionTooltip';
import { isRestricted, MentionType, type MentionEventHandler } from '../../types';
import { fireAnalyticsMentionEvent } from '../../util/analytics';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { UFOExperienceState } from '@atlaskit/ufo';
import { UnknownUserError } from '../../util/i18n';
import { UfoErrorBoundary, mentionRenderedUfoExperience } from './ufoExperiences';

export const ANALYTICS_HOVER_DELAY = 1000;
export const UNKNOWN_USER_ID = '_|unknown|_';

export type OwnProps = {
	accessLevel?: string;
	/**
	 * Tooltip text shown on hover when the chip is disabled. Ignored when
	 * `isDisabled` is false. When omitted, no tooltip is rendered even if
	 * `isDisabled` is true.
	 */
	disabledTooltip?: string;
	id: string;
	/**
	 * When true, the mention chip is rendered in its disabled visual state
	 * (`MentionType.DISABLED`) and click handlers are not invoked. Takes
	 * precedence over `isHighlighted` and the restricted state.
	 */
	isDisabled?: boolean;
	isHighlighted?: boolean;
	localId?: string;
	onClick?: MentionEventHandler;
	onHover?: () => void;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	ssrPlaceholderId?: string;
	text: string;
};

export type Props = OwnProps & WithAnalyticsEventsProps;

export class MentionInternal extends React.PureComponent<Props, {}> {
	private hoverTimeout?: number;

	constructor(props: Props) {
		super(props);
		mentionRenderedUfoExperience.getInstance(props.id).start();
	}

	componentDidMount(): void {
		mentionRenderedUfoExperience.getInstance(this.props.id).success();
	}

	private handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onClick, isDisabled } = this.props;
		if (isDisabled) {
			// Disabled chips do not invoke their click handler.
			return;
		}
		if (onClick) {
			onClick(id, text, e);
		}
	};

	private handleOnMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onMouseEnter, onHover } = this.props;
		if (onMouseEnter) {
			onMouseEnter(id, text, e);
		}
		this.hoverTimeout = window.setTimeout(() => {
			if (onHover) {
				onHover();
			}
			this.hoverTimeout = undefined;
		}, ANALYTICS_HOVER_DELAY);
	};

	private handleOnMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onMouseLeave } = this.props;
		if (onMouseLeave) {
			onMouseLeave(id, text, e);
		}
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
		}
	};

	private getMentionType = (): MentionType => {
		const { accessLevel, isHighlighted, isDisabled } = this.props;
		if (isDisabled) {
			return MentionType.DISABLED;
		}
		if (isHighlighted) {
			return MentionType.SELF;
		}
		if (isRestricted(accessLevel)) {
			return MentionType.RESTRICTED;
		}
		return MentionType.DEFAULT;
	};

	componentWillUnmount(): void {
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
		}

		const ufoInstance = mentionRenderedUfoExperience.getInstance(this.props.id);
		if (
			[UFOExperienceState['STARTED'], UFOExperienceState['IN_PROGRESS']].includes(ufoInstance.state)
		) {
			ufoInstance.abort();
		}
	}

	renderUnknownUserError(id: string): React.JSX.Element {
		return (
			<UnknownUserError values={{ userId: id.slice(-5) }}>
				{(message) => <>{`@${message}`}</>}
			</UnknownUserError>
		);
	}

	render(): React.JSX.Element {
		const { handleOnClick, handleOnMouseEnter, handleOnMouseLeave, props } = this;
		const { text, id, accessLevel, localId, disabledTooltip } = props;
		const mentionType: MentionType = this.getMentionType();

		const failedMention = text === `@${UNKNOWN_USER_ID}`;

		const showRestrictedTooltip = mentionType === MentionType.RESTRICTED;
		const showDisabledTooltip = mentionType === MentionType.DISABLED && !!disabledTooltip;

		// A11y: when the chip is in the disabled visual state, expose
		// `aria-disabled` so assistive tech announces it as such. The
		// disabled-tooltip text is mirrored into `aria-label` so the
		// announcement carries the reason even without portal-id wiring for
		// `aria-describedby`.
		const isDisabledChip = mentionType === MentionType.DISABLED;
		const disabledA11yProps = isDisabledChip
			? {
					'aria-disabled': true as const,
					...(disabledTooltip ? { 'aria-label': `${text || '@...'} — ${disabledTooltip}` } : {}),
				}
			: {};

		const mentionComponent = (
			<FocusRing>
				<PrimitiveMention
					mentionType={mentionType}
					onClick={handleOnClick}
					onMouseEnter={handleOnMouseEnter}
					onMouseLeave={handleOnMouseLeave}
					spellCheck={false}
					data-testid={`mention-${id}`}
					data-mention-type={mentionType}
					data-mention-tooltip={showRestrictedTooltip || showDisabledTooltip}
					{...disabledA11yProps}
				>
					{failedMention ? this.renderUnknownUserError(id) : text || '@...'}
				</PrimitiveMention>
			</FocusRing>
		);

		const ssrPlaceholderProp = props.ssrPlaceholderId
			? { 'data-ssr-placeholder': props.ssrPlaceholderId }
			: {};

		const wrappedMention = (() => {
			if (showRestrictedTooltip) {
				return (
					<React.Suspense fallback={mentionComponent}>
						<AsyncNoAccessTooltip name={text}>{mentionComponent}</AsyncNoAccessTooltip>
					</React.Suspense>
				);
			}
			if (showDisabledTooltip) {
				return (
					<React.Suspense fallback={mentionComponent}>
						<AsyncDisabledMentionTooltip tooltip={disabledTooltip!}>
							{mentionComponent}
						</AsyncDisabledMentionTooltip>
					</React.Suspense>
				);
			}
			return mentionComponent;
		})();

		return (
			<UfoErrorBoundary id={id}>
				<span
					id={localId}
					data-mention-id={id}
					data-local-id={localId}
					data-access-level={accessLevel}
					spellCheck={false}
					{...ssrPlaceholderProp}
				>
					<MessagesIntlProvider>{wrappedMention}</MessagesIntlProvider>
				</span>
			</UfoErrorBoundary>
		);
	}
}

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

const Mention: React.ForwardRefExoticComponent<
	Omit<OwnProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = MentionWithAnalytics;
type Mention = MentionInternal;

export default Mention;
