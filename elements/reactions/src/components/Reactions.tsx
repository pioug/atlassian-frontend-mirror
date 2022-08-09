/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import {
  createAndFireSafe,
  createPickerButtonClickedEvent,
  createPickerCancelledEvent,
  createPickerMoreClickedEvent,
  createReactionSelectionEvent,
  createReactionsRenderedEvent,
} from '../analytics';
import { ReactionSource } from '../types';
import { ReactionStatus } from '../types/ReactionStatus';
import { ReactionSummary } from '../types/ReactionSummary';
import { messages } from './i18n';
import { Reaction, OnReactionClick } from './Reaction';
import { ReactionPicker } from './ReactionPicker';

const reactionStyle = css({
  display: 'inline-block',
  // top margin of 2px to allow spacing between rows when wrapped (paired with top margin in reactionsStyle)
  margin: '2px 4px 0 4px',
});

const wrapperStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  borderRadius: '15px',
  // To allow to row spacing of 2px on wrap, and 0px on first row
  marginTop: '-2px',
  '> :first-of-type > :first-child': { marginLeft: 0 },
});

export interface StateMapperProps {
  /**
   * List of reactions to render
   */
  reactions: ReactionSummary[];
  /**
   * Condition for the reaction list status while been fetched
   */
  status: ReactionStatus;
  /**
   * Optional emoji reactions list to show custom animation or render as standard (key => emoji string "id", value => true/false to show custom animation)
   */
  flash?: {
    [emojiId: string]: boolean;
  };
}

export interface ReactionsProps extends StateMapperProps {
  /**
   * event handler to fetching the reactions
   */
  loadReaction: () => void;
  /**
   * Event callback when an emoji button is selected
   */
  onSelection: (emojiId: string) => void;
  /**
   * event handler when the emoji button is clicked
   */
  onReactionClick: OnReactionClick;
  /**
   * Optional event when the mouse cursor hovers over the reaction
   * @param emojiId hovered reaction emoji id
   */
  onReactionHover?: (emojiId: string) => void;
  /**
   * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
   */
  allowAllEmojis?: boolean;
  /**
   * @deprecated Not been used anymore
   */
  boundariesElement?: string;
  /**
   * Optional error message to show when unable to display the reaction emoji
   */
  errorMessage?: string;
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
}

export class ReactionsWithoutAnalytics extends React.PureComponent<
  ReactionsProps & WithAnalyticsEventsProps
> {
  static defaultProps = {
    flash: {},
    reactions: [],
  };

  static displayName = 'Reactions';

  private openTime: number | undefined;
  private renderTime: number | undefined;

  constructor(props: ReactionsProps & WithAnalyticsEventsProps) {
    super(props);
    if (props.status !== ReactionStatus.ready) {
      this.renderTime = Date.now();
    }
  }

  componentDidMount() {
    if (this.props.status === ReactionStatus.notLoaded) {
      this.props.loadReaction();
    }
  }

  componentDidUpdate = () => {
    if (this.props.status === ReactionStatus.ready && this.renderTime) {
      createAndFireSafe(
        this.props.createAnalyticsEvent,
        createReactionsRenderedEvent,
        this.renderTime,
      );
      this.renderTime = undefined;
    }
  };

  private isDisabled = (): boolean =>
    this.props.status !== ReactionStatus.ready;

  private getTooltip = (): React.ReactNode | undefined => {
    const { status, errorMessage } = this.props;

    switch (status) {
      case ReactionStatus.error:
        return errorMessage ? (
          errorMessage
        ) : (
          <FormattedMessage {...messages.unexpectedError} />
        );
      case ReactionStatus.loading:
      case ReactionStatus.notLoaded:
        return <FormattedMessage {...messages.loadingReactions} />;
      default:
        return undefined;
    }
  };

  private handleReactionMouseEnter = (reaction: ReactionSummary) => {
    if (this.props.onReactionHover) {
      this.props.onReactionHover(reaction.emojiId);
    }
  };

  private handlePickerOpen = () => {
    this.openTime = Date.now();
    createAndFireSafe(
      this.props.createAnalyticsEvent,
      createPickerButtonClickedEvent,
      this.props.reactions.length,
    );
  };

  private handleOnCancel = () => {
    createAndFireSafe(
      this.props.createAnalyticsEvent,
      createPickerCancelledEvent,
      this.openTime,
    );
    this.openTime = undefined;
  };

  private handleOnMore = () => {
    createAndFireSafe(
      this.props.createAnalyticsEvent,
      createPickerMoreClickedEvent,
      this.openTime,
    );
  };

  private handleOnSelection = (emojiId: string, source: ReactionSource) => {
    createAndFireSafe(
      this.props.createAnalyticsEvent,
      createReactionSelectionEvent,
      source,
      emojiId,
      this.props.reactions.find((reaction) => reaction.emojiId === emojiId),
      this.openTime,
    );
    this.openTime = undefined;
    if (this.props.onSelection) {
      this.props.onSelection(emojiId);
    }
  };

  private renderPicker() {
    const { emojiProvider, boundariesElement, allowAllEmojis } = this.props;

    return (
      <Tooltip content={this.getTooltip()}>
        <ReactionPicker
          css={reactionStyle}
          emojiProvider={emojiProvider}
          miniMode
          boundariesElement={boundariesElement}
          allowAllEmojis={allowAllEmojis}
          disabled={this.isDisabled()}
          onSelection={this.handleOnSelection}
          onOpen={this.handlePickerOpen}
          onCancel={this.handleOnCancel}
          onShowMore={this.handleOnMore}
        />
      </Tooltip>
    );
  }

  private renderReaction = (reaction: ReactionSummary) => (
    <Reaction
      key={reaction.emojiId}
      css={reactionStyle}
      reaction={reaction}
      emojiProvider={this.props.emojiProvider}
      onClick={this.props.onReactionClick}
      onMouseEnter={this.handleReactionMouseEnter}
      flash={this.props.flash![reaction.emojiId]}
    />
  );

  render() {
    return (
      <div css={wrapperStyle}>
        {this.props.reactions.map(this.renderReaction)}
        {this.renderPicker()}
      </div>
    );
  }
}

export const Reactions = withAnalyticsEvents()(ReactionsWithoutAnalytics);
