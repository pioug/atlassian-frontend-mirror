import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MentionStyle } from './styles';
import { NoAccessTooltip } from '../NoAccessTooltip';
import { isRestricted, MentionType, MentionEventHandler } from '../../types';
import { fireAnalyticsMentionEvent } from '../../util/analytics';

import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { messages } from '../i18n';

export const ANALYTICS_HOVER_DELAY = 1000;
export const UNKNOWN_USER_ID = '_|unknown|_';

export type OwnProps = {
  id: string;
  text: string;
  isHighlighted?: boolean;
  accessLevel?: string;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
  onHover?: () => void;
};

export type Props = OwnProps & WithAnalyticsEventsProps;

export class MentionInternal extends React.PureComponent<Props, {}> {
  private hoverTimeout?: number;

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
  }

  renderUnknownUserError(id: string) {
    return (
      <FormattedMessage
        {...messages.unknownUserError}
        values={{ userId: id.slice(-5) }}
      >
        {(message) => `@${message}`}
      </FormattedMessage>
    );
  }

  render() {
    const {
      handleOnClick,
      handleOnMouseEnter,
      handleOnMouseLeave,
      props,
    } = this;
    const { text, id, accessLevel } = props;
    const mentionType: MentionType = this.getMentionType();

    const failedMention = text === `@${UNKNOWN_USER_ID}`;

    const mentionComponent = (
      <MentionStyle
        mentionType={mentionType}
        onClick={handleOnClick}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {failedMention ? this.renderUnknownUserError(id) : text || '@...'}
      </MentionStyle>
    );

    return (
      <span
        data-mention-id={id}
        data-access-level={accessLevel}
        spellCheck={false}
      >
        {mentionType === MentionType.RESTRICTED ? (
          <NoAccessTooltip name={text}>{mentionComponent}</NoAccessTooltip>
        ) : (
          mentionComponent
        )}
      </span>
    );
  }
}

const MentionWithAnalytics = withAnalyticsEvents({
  onClick: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
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

  onHover: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
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
