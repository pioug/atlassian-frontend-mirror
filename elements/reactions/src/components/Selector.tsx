import {
  EmojiId,
  OnEmojiEvent,
  OptionalEmojiDescription,
} from '@atlaskit/emoji/types';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import Tooltip from '@atlaskit/tooltip';
import cx from 'classnames';
import React from 'react';
import { PureComponent, SyntheticEvent } from 'react';
import { keyframes, style } from 'typestyle';
import { EmojiButton } from './EmojiButton';
import { ShowMore } from './ShowMore';
import { equalEmojiId } from './utils';

export interface Props {
  emojiProvider: Promise<EmojiProvider>;
  onSelection: OnEmojiEvent;
  showMore?: boolean;
  onMoreClick: React.MouseEventHandler<HTMLElement>;
}

const selectorStyle = style({
  boxSizing: 'border-box',
  display: 'flex',
  padding: 0,
});

const emojiStyle = style({
  display: 'inline-block',
  opacity: 0,
  $nest: {
    '&.selected': {
      transition: 'transform 200ms ease-in-out  ',
      transform: 'translateY(-48px) scale(2.667)',
    },
  },
});

const revealAnimation = keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(0.5)',
  },
  '75%': {
    transform: 'scale(1.25)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
});

export const revealStyle = style({
  animation: `${revealAnimation} 150ms ease-in-out forwards`,
});

const revealDelay = (index: number) => ({ animationDelay: `${index * 50}ms` });

export const defaultReactions: EmojiId[] = [
  { id: '1f44d', shortName: ':thumbsup:' },
  { id: '1f44f', shortName: ':clap:' },
  { id: '1f525', shortName: ':fire:' },
  { id: '2665', shortName: ':hearts:' },
  { id: '1f632', shortName: ':astonished:' },
  { id: '1f914', shortName: ':thinking:' },
];

export const defaultReactionsByShortName: Map<string, EmojiId> = new Map<
  string,
  EmojiId
>(
  defaultReactions.map<[string, EmojiId]>((reaction) => [
    reaction.shortName,
    reaction,
  ]),
);

export const isDefaultReaction = (emojiId: EmojiId) =>
  defaultReactions.filter((otherEmojiId) => equalEmojiId(otherEmojiId, emojiId))
    .length > 0;

export interface State {
  selection: EmojiId | undefined;
}

export class Selector extends PureComponent<Props, State> {
  private timeouts: Array<number>;

  constructor(props: Props) {
    super(props);
    this.timeouts = [];

    this.state = {
      selection: undefined,
    };
  }

  componentWillUnmount() {
    this.timeouts.forEach(clearTimeout);
  }

  private onEmojiSelected = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
    event?: SyntheticEvent<any>,
  ) => {
    this.timeouts.push(
      window.setTimeout(
        () => this.props.onSelection(emojiId, emoji, event),
        250,
      ),
    );
    this.setState({
      selection: emojiId,
    });
  };

  private renderEmoji = (emojiId: EmojiId, index: number) => {
    const { emojiProvider } = this.props;
    const key = emojiId.id || emojiId.shortName;

    const classNames = cx(emojiStyle, revealStyle, {
      selected: emojiId === this.state.selection,
    });

    const style = revealDelay(index);

    return (
      <div key={key} className={classNames} style={style}>
        <Tooltip content={emojiId.shortName}>
          <EmojiButton
            emojiId={emojiId}
            emojiProvider={emojiProvider}
            onClick={this.onEmojiSelected}
          />
        </Tooltip>
      </div>
    );
  };

  private renderShowMore = (): React.ReactNode => (
    <ShowMore
      key="more"
      className={{ button: revealStyle }}
      style={{ button: revealDelay(defaultReactions.length) }}
      onClick={this.props.onMoreClick}
    />
  );

  render() {
    const { showMore } = this.props;

    return (
      <div className={selectorStyle}>
        {defaultReactions.map(this.renderEmoji)}

        {showMore ? this.renderShowMore() : null}
      </div>
    );
  }
}
