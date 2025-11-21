import React from 'react';
import FocusRing from '@atlaskit/focus-ring';

import MessagesIntlProvider from '../MessagesIntlProvider';
import PrimitiveMention from './PrimitiveMention';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
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
	id: string;
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

	componentDidMount() {
		mentionRenderedUfoExperience.getInstance(this.props.id).success();
	}

	private handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onClick } = this.props;
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
		const { accessLevel, isHighlighted } = this.props;
		if (isHighlighted) {
			return MentionType.SELF;
		}
		if (isRestricted(accessLevel)) {
			return MentionType.RESTRICTED;
		}
		return MentionType.DEFAULT;
	};

	componentWillUnmount() {
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
		const { text, id, accessLevel, localId } = props;
		const mentionType: MentionType = this.getMentionType();

		const failedMention = text === `@${UNKNOWN_USER_ID}`;

		const showTooltip = mentionType === MentionType.RESTRICTED;

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
					data-mention-tooltip={showTooltip}
				>
					{failedMention ? this.renderUnknownUserError(id) : text || '@...'}
				</PrimitiveMention>
			</FocusRing>
		);

		const ssrPlaceholderProp = props.ssrPlaceholderId
			? { 'data-ssr-placeholder': props.ssrPlaceholderId }
			: {};

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
					<MessagesIntlProvider>
						{showTooltip ? (
							<React.Suspense fallback={mentionComponent}>
								<AsyncNoAccessTooltip name={text}>{mentionComponent}</AsyncNoAccessTooltip>
							</React.Suspense>
						) : (
							mentionComponent
						)}
					</MessagesIntlProvider>
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

const Mention = MentionWithAnalytics;
type Mention = MentionInternal;

export default Mention;
