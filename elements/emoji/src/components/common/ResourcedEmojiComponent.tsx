import PropTypes from 'prop-types';
import React from 'react';
import { Component } from 'react';
import EmojiProvider from '../../api/EmojiResource';
import { defaultEmojiHeight } from '../../util/constants';
import { isPromise } from '../../util/type-helpers';
import { EmojiId, OptionalEmojiDescription } from '../../types';
import CachingEmoji from './CachingEmoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { EmojiContext } from './internal-types';
import { State as LoadingState } from './LoadingEmojiComponent';

export interface BaseResourcedEmojiProps {
  emojiId: EmojiId;
  showTooltip?: boolean;
  fitToHeight?: number;
}

export interface Props extends BaseResourcedEmojiProps {
  emojiProvider: EmojiProvider;
}

export interface State extends LoadingState {
  emoji: OptionalEmojiDescription;
  loaded: boolean;
}

export default class ResourcedEmojiComponent extends Component<Props, State> {
  static childContextTypes = {
    emoji: PropTypes.object,
  };

  private ready = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      emoji: undefined,
      loaded: false,
    };
  }

  getChildContext(): EmojiContext {
    return {
      emoji: {
        emojiProvider: this.props.emojiProvider,
      },
    };
  }

  private refreshEmoji(emojiProvider: EmojiProvider, emojiId: EmojiId) {
    const foundEmoji = emojiProvider.findByEmojiId(emojiId);
    if (isPromise<OptionalEmojiDescription>(foundEmoji)) {
      this.setState({
        loaded: false,
      });
      foundEmoji.then((emoji) => {
        if (this.ready) {
          // don't update state if component was unmounted
          this.setState({
            emoji,
            loaded: true,
          });
        }
      });
    } else {
      // loaded
      this.setState({
        emoji: foundEmoji,
        loaded: true,
      });
    }
  }

  UNSAFE_componentWillMount() {
    this.ready = true;
    if (!this.state.emoji) {
      // using UNSAFE_componentWillMount instead of componentDidMount to avoid needless
      // rerendering.
      this.refreshEmoji(this.props.emojiProvider, this.props.emojiId);
    }
  }

  componentWillUnmount() {
    this.ready = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.emojiProvider !== this.props.emojiProvider ||
      nextProps.emojiId !== this.props.emojiId
    ) {
      this.refreshEmoji(nextProps.emojiProvider, nextProps.emojiId);
    }
  }

  render() {
    const {
      emojiId,
      fitToHeight = defaultEmojiHeight,
      showTooltip,
    } = this.props;
    const { emoji, loaded } = this.state;
    const { shortName, fallback } = emojiId;
    if (emoji) {
      return this.emojiWrapper(
        <CachingEmoji
          emoji={emoji}
          showTooltip={showTooltip}
          fitToHeight={fitToHeight}
        />,
      );
    } else if (loaded) {
      // loaded but not found - render fallback
      return this.emojiWrapper(<span>{fallback || shortName}</span>);
    }

    return this.emojiWrapper(
      <EmojiPlaceholder
        shortName={shortName}
        showTooltip={showTooltip}
        size={fitToHeight || defaultEmojiHeight}
      />,
    );
  }

  private emojiWrapper(element: JSX.Element) {
    const { shortName, id, fallback } = this.props.emojiId;
    return (
      <span
        data-emoji-id={id}
        data-emoji-short-name={shortName}
        data-emoji-text={fallback || shortName}
      >
        {element}
      </span>
    );
  }
}
