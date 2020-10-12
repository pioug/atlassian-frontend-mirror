import React from 'react';
import { DescriptionBylineProps } from './types';
import { renderHighlight } from '../MentionItem/MentionHighlightHelpers';
import { DescriptionBylineStyle } from './styles';

export default class UserMentionDescriptionByline extends React.PureComponent<
  DescriptionBylineProps,
  {}
> {
  render() {
    const { highlight, name, nickname } = this.props.mention;
    const nicknameHighlights = highlight && highlight.nickname;

    if (name === nickname) {
      return null;
    }

    return renderHighlight(
      DescriptionBylineStyle,
      nickname,
      nicknameHighlights,
      '@',
    );
  }
}
