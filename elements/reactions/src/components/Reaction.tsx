import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30A, N400 } from '@atlaskit/theme/colors';
import cx from 'classnames';
import React from 'react';
import { PureComponent, SyntheticEvent } from 'react';
import { style } from 'typestyle';
import {
  createAndFireSafe,
  createReactionClickedEvent,
  createReactionHoveredEvent,
} from '../analytics';
import { ReactionSummary } from '../types/ReactionSummary';
import { Counter } from './Counter';
import { FlashAnimation } from './FlashAnimation';
import { ReactionTooltip } from './ReactionTooltip';
import { isLeftClick } from './utils';

const akBorderRadius = `${borderRadius()}px`;
const akColorN30A = N30A;
const akColorN400 = N400;

const emojiStyle = style({
  transformOrigin: 'center center 0',
  margin: '0 4px',
});

const reactionStyle = style({
  outline: 'none',
  display: 'flex',
  flexDirection: 'row',
  minWidth: '36px',
  height: '24px',
  lineHeight: '24px',
  background: 'transparent',
  border: '0',
  borderRadius: akBorderRadius,
  color: akColorN400,
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  transition: '200ms ease-in-out',
  $nest: { '&:hover': { background: akColorN30A } },
});

const flashStyle = style({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: akBorderRadius,
});

const counterStyle = style({
  padding: '0 4px 0 0',
});

export interface ReactionOnClick {
  (emojiId: string, event?: SyntheticEvent<any>): void;
}

export interface Props {
  reaction: ReactionSummary;
  emojiProvider: Promise<EmojiProvider>;
  onClick: ReactionOnClick;
  className?: string;
  onMouseOver?: (
    reaction: ReactionSummary,
    event?: SyntheticEvent<any>,
  ) => void;
  flash?: boolean;
}

export interface State {
  emojiName?: string;
}

class ReactionWithoutAnalytics extends PureComponent<
  Props & WithAnalyticsEventsProps,
  State
> {
  static defaultProps = {
    flash: false,
    className: undefined,
    onMouseOver: undefined,
    flashOnMount: false,
  };

  static displayName = 'Reaction';

  private mounted: boolean = false;
  private hoverStart: number | undefined;

  constructor(props: Props & WithAnalyticsEventsProps) {
    super(props);

    this.state = {};
  }

  componentDidUpdate({ reaction: prevReaction }: Props) {
    if (!prevReaction.users && this.props.reaction.users) {
      createAndFireSafe(
        this.props.createAnalyticsEvent,
        createReactionHoveredEvent,
        this.hoverStart,
      );
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.props.emojiProvider
      .then(emojiResource =>
        emojiResource.findByEmojiId({
          shortName: '',
          id: this.props.reaction.emojiId,
        }),
      )
      .then(foundEmoji => {
        if (foundEmoji && this.mounted) {
          this.setState({
            emojiName: foundEmoji.name,
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.props.onClick && isLeftClick(event)) {
      const { reaction, createAnalyticsEvent } = this.props;
      const { reacted, emojiId } = reaction;
      createAndFireSafe(
        createAnalyticsEvent,
        createReactionClickedEvent,
        !reacted,
        emojiId,
      );

      this.props.onClick(this.props.reaction.emojiId, event);
    }
  };

  private handleMouseOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { onMouseOver, reaction } = this.props;
    if (!reaction.users || !reaction.users.length) {
      this.hoverStart = Date.now();
    }
    if (onMouseOver) {
      onMouseOver(this.props.reaction, event);
    }
  };

  render() {
    const {
      emojiProvider,
      reaction,
      className: classNameProp,
      flash,
    } = this.props;
    const { emojiName } = this.state;

    const classNames = cx(reactionStyle, classNameProp);

    const emojiId = { id: reaction.emojiId, shortName: '' };

    return (
      <button
        className={classNames}
        onMouseUp={this.handleMouseDown}
        onMouseOver={this.handleMouseOver}
      >
        <ReactionTooltip emojiName={emojiName} reaction={reaction}>
          <FlashAnimation flash={flash} className={flashStyle}>
            <div className={emojiStyle}>
              <ResourcedEmoji
                emojiProvider={emojiProvider}
                emojiId={emojiId}
                fitToHeight={16}
              />
            </div>
            <Counter
              className={counterStyle}
              value={reaction.count}
              highlight={reaction.reacted}
            />
          </FlashAnimation>
        </ReactionTooltip>
      </button>
    );
  }
}

export const Reaction = withAnalyticsEvents()(ReactionWithoutAnalytics);
