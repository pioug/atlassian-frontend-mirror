import React from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { renderHighlight } from '../MentionItem/MentionHighlightHelpers';
import { DescriptionBylineStyle } from './styles';
import { type DescriptionBylineProps } from './types';

export default class UserMentionDescriptionByline extends React.PureComponent<
	DescriptionBylineProps,
	{}
> {
	render(): React.JSX.Element | null {
		const { email, highlight, name, nickname } = this.props.mention;
		const nicknameHighlights = highlight && highlight.nickname;

		if (
			email &&
			(!nickname || name === nickname) &&
			isExperimentEnabled('platform_editor_mentions_email_search')
		) {
			return <DescriptionBylineStyle>{email}</DescriptionBylineStyle>;
		}

		if (name === nickname) {
			return null;
		}

		return renderHighlight(DescriptionBylineStyle, nickname, nicknameHighlights, '@');
	}
}
