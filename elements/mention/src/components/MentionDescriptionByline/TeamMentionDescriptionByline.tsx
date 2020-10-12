import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DescriptionBylineProps } from './types';
import { DescriptionBylineStyle } from './styles';
import { messages } from '../i18n';

export default class TeamMentionDescriptionByline extends React.PureComponent<
  DescriptionBylineProps
> {
  private renderByline = (memberCount: number, includesYou: boolean) => {
    if (includesYou) {
      if (memberCount > 50) {
        return this.getBylineComponent(
          <FormattedMessage {...messages.plus50MembersWithYou} />,
        );
      }

      return this.getBylineComponent(
        <FormattedMessage
          {...messages.memberCountWithYou}
          values={{
            0: memberCount,
          }}
        />,
      );
    } else {
      if (memberCount > 50) {
        return this.getBylineComponent(
          <FormattedMessage {...messages.plus50MembersWithoutYou} />,
        );
      }

      return this.getBylineComponent(
        <FormattedMessage
          {...messages.memberCountWithoutYou}
          values={{
            0: memberCount,
          }}
        />,
      );
    }
  };

  private getBylineComponent = (message: JSX.Element) => (
    <DescriptionBylineStyle>{message}</DescriptionBylineStyle>
  );

  render() {
    const { context } = this.props.mention;

    if (!context) {
      return null;
    }

    const includesYou = context.includesYou;
    const memberCount = context.memberCount;

    return this.renderByline(memberCount, includesYou);
  }
}
