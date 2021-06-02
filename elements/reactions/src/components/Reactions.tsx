import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { style } from 'typestyle';
import {
  createAndFireSafe,
  createPickerButtonClickedEvent,
  createPickerCancelledEvent,
  createPickerMoreClickedEvent,
  createReactionSelectionEvent,
  createReactionsRenderedEvent,
} from '../analytics';
import { OnEmoji, OnReaction, ReactionSource } from '../types';
import { ReactionStatus } from '../types/ReactionStatus';
import { ReactionSummary } from '../types/ReactionSummary';
import { messages } from './i18n';
import { Reaction } from './Reaction';
import { ReactionPicker } from './ReactionPicker';

const reactionStyle = style({
  display: 'inline-block',
  // top margin of 2px to allow spacing between rows when wrapped (paired with top margin in reactionsStyle)
  margin: '2px 4px 0 4px',
});

const reactionsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  borderRadius: '15px',
  // To allow to row spacing of 2px on wrap, and 0px on first row
  marginTop: '-2px',
  $nest: { '& > :first-child': { marginLeft: 0 } },
});

export interface Props {
  reactions: ReactionSummary[];
  status: ReactionStatus;
  loadReaction: () => void;
  onSelection: OnEmoji;

  onReactionClick: OnEmoji;
  onReactionHover?: OnReaction;
  allowAllEmojis?: boolean;
  flash?: {
    [emojiId: string]: boolean;
  };
  boundariesElement?: string;
  errorMessage?: string;
  emojiProvider: Promise<EmojiProvider>;
}

export class ReactionsWithoutAnalytics extends React.PureComponent<
  Props & WithAnalyticsEventsProps
> {
  static defaultProps = {
    flash: {},
    reactions: [],
  };

  static displayName = 'Reactions';

  private openTime: number | undefined;
  private renderTime: number | undefined;

  constructor(props: Props & WithAnalyticsEventsProps) {
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

  private handleReactionMouseOver = (reaction: ReactionSummary) => {
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
          className={reactionStyle}
          emojiProvider={emojiProvider}
          miniMode={true}
          boundariesElement={boundariesElement}
          allowAllEmojis={allowAllEmojis}
          disabled={this.isDisabled()}
          onSelection={this.handleOnSelection}
          onOpen={this.handlePickerOpen}
          onCancel={this.handleOnCancel}
          onMore={this.handleOnMore}
        />
      </Tooltip>
    );
  }

  private renderReaction = (reaction: ReactionSummary) => (
    <Reaction
      key={reaction.emojiId}
      className={reactionStyle}
      reaction={reaction}
      emojiProvider={this.props.emojiProvider}
      onClick={this.props.onReactionClick}
      onMouseOver={this.handleReactionMouseOver}
      flash={this.props.flash![reaction.emojiId]}
    />
  );

  render() {
    return (
      <div className={reactionsStyle}>
        {this.props.reactions.map(this.renderReaction)}
        {this.renderPicker()}
      </div>
    );
  }
}

export const Reactions = withAnalyticsEvents()(ReactionsWithoutAnalytics);
