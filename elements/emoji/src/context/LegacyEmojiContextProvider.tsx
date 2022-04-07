import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EmojiContext } from '../components/common/internal-types';
import { EmojiContextProvider } from './EmojiContextProvider';

export interface LegacyEmojiContextProviderProps {
  emojiContextValue?: EmojiContext;
}

interface LegacyEmojiContextProviderState {
  prioritisedContextValue?: EmojiContext;
}

/**
 * Legacy Context Priority Passthrough ...
 * If component finds legacy context, then use it, otherwise use the passed through context
 */

export default class LegacyEmojiContextProvider extends Component<
  LegacyEmojiContextProviderProps,
  LegacyEmojiContextProviderState
> {
  static contextTypes = {
    emoji: PropTypes.object,
  };
  context!: EmojiContext;

  constructor(props: LegacyEmojiContextProviderProps, context: EmojiContext) {
    super(props, context);
    this.state = {
      prioritisedContextValue: context.emoji
        ? context
        : this.props.emojiContextValue,
    };
  }

  render() {
    if (this.state.prioritisedContextValue) {
      return (
        <EmojiContextProvider
          emojiContextValue={this.state.prioritisedContextValue}
        >
          {this.props.children}
        </EmojiContextProvider>
      );
    }

    return this.props.children;
  }
}
