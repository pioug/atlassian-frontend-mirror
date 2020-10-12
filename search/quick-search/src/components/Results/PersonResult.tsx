import React from 'react';
import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';
import { CommonResultProps } from './types';

export type Props = CommonResultProps & {
  /** Name of the container. Provides the main text to be displayed as the item. */
  name: React.ReactNode;
  /** A user's custom handle. Appears to the right of their `name`. It has a lower font-weight. */
  mentionName?: string;
  /** A character with which to prefix the `mentionName`. Defaults to '@' */
  mentionPrefix?: string;
  /** Text to be shown alongside the main `text`. */
  presenceMessage?: React.ReactNode;
  /** Sets the appearance of the presence indicator */
  presenceState?: 'online' | 'busy' | 'offline' | null;
};

export default class PersonResult extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    mentionPrefix: '@',
    presenceState: null, // No presence indicator by default
  };

  getMention = () =>
    this.props.mentionName
      ? `${this.props.mentionPrefix}${this.props.mentionName}`
      : undefined;

  getAvatar = () => {
    if (this.props.avatar) {
      return this.props.avatar;
    }

    return (
      <Avatar
        presence={this.props.presenceState}
        size="small"
        src={this.props.avatarUrl}
      />
    );
  };

  render() {
    const {
      name,
      mentionName,
      mentionPrefix,
      presenceMessage,
      presenceState,
      type = 'person',
      ...commonResultProps
    } = this.props;

    return (
      <ResultBase
        {...commonResultProps}
        type={type}
        text={name}
        subText={presenceMessage}
        caption={this.getMention()}
        icon={this.getAvatar()}
      />
    );
  }
}
