import React from 'react';
import { UserType } from '../../types';
import { DescriptionBylineProps } from './types';
import UserMentionDescriptionByline from './UserMentionDescriptionByline';
import TeamMentionDescriptionByline from './TeamMentionDescriptionByline';

export default class MentionDescriptionByline extends React.PureComponent<
  DescriptionBylineProps,
  {}
> {
  render() {
    const { userType } = this.props.mention;

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
