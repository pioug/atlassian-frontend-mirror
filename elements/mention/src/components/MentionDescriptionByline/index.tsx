import React from 'react';

import { FormattedMessage } from 'react-intl';

import { UserType } from '../../types';
import { messages } from '../i18n';
import { DescriptionBylineStyle } from './styles';
import TeamMentionDescriptionByline from './TeamMentionDescriptionByline';
import { type DescriptionBylineProps } from './types';
import UserMentionDescriptionByline from './UserMentionDescriptionByline';

export default class MentionDescriptionByline extends React.PureComponent<
	DescriptionBylineProps,
	{}
> {
	render(): React.JSX.Element {
		const { userType, isXProductUser } = this.props.mention;

		if (isXProductUser) {
			return (
				<DescriptionBylineStyle>
					<FormattedMessage {...messages.xProductMentionDescription} />
				</DescriptionBylineStyle>
			);
		}

		switch (userType) {
			case UserType[UserType.TEAM]: {
				return <TeamMentionDescriptionByline mention={this.props.mention} />;
			}
			default: {
				return <UserMentionDescriptionByline mention={this.props.mention} />;
			}
		}
	}
}
