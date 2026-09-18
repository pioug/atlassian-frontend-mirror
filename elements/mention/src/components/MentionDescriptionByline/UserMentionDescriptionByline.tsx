import React from 'react';

import { renderHighlight } from '../MentionItem/MentionHighlightHelpers';
import { DescriptionBylineStyle } from './styles';
import { type DescriptionBylineProps } from './types';

export default class UserMentionDescriptionByline extends React.PureComponent<
	DescriptionBylineProps,
	{}
> {
	render(): React.JSX.Element | null {
		const { highlight, name, nickname } = this.props.mention;
		const nicknameHighlights = highlight && highlight.nickname;

		if (name === nickname) {
			return null;
		}

		return renderHighlight(DescriptionBylineStyle, nickname, nicknameHighlights, '@');
	}
}
