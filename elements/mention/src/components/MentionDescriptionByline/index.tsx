import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { UserType } from '../../types';
import { type DescriptionBylineProps } from './types';
import UserMentionDescriptionByline from './UserMentionDescriptionByline';
import TeamMentionDescriptionByline from './TeamMentionDescriptionByline';
import { DescriptionBylineStyle } from './styles';
import { messages } from '../i18n';

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
