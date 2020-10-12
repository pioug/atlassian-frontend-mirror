import { N0, N800, N50, N200 } from '@atlaskit/theme/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Team } from '../types';
import { AvatarItemOption, TextWrapper } from './AvatarItemOption';
import { HighlightText } from './HighlightText';
import { messages } from './i18n';
import { SizeableAvatar } from './SizeableAvatar';

export type TeamOptionProps = {
  team: Team;
  isSelected: boolean;
};

export class TeamOption extends React.PureComponent<TeamOptionProps> {
  private getPrimaryText = () => {
    const {
      team: { name, highlight },
    } = this.props;

    return [
      <TextWrapper key="name" color={this.props.isSelected ? N0 : N800}>
        <HighlightText highlights={highlight && highlight.name}>
          {name}
        </HighlightText>
      </TextWrapper>,
    ];
  };

  private renderByline = () => {
    const {
      isSelected,
      team: { memberCount, includesYou },
    } = this.props;

    // if Member count is missing, do not show the byline, regardless of the availability of includesYou
    if (memberCount === null || typeof memberCount === 'undefined') {
      return undefined;
    } else {
      if (includesYou === true) {
        if (memberCount > 50) {
          return this.getBylineComponent(
            isSelected,
            <FormattedMessage {...messages.plus50MembersWithYou} />,
          );
        } else {
          return this.getBylineComponent(
            isSelected,
            <FormattedMessage
              {...messages.memberCountWithYou}
              values={{
                count: memberCount,
              }}
            />,
          );
        }
      } else {
        if (memberCount > 50) {
          return this.getBylineComponent(
            isSelected,
            <FormattedMessage {...messages.plus50MembersWithoutYou} />,
          );
        } else {
          return this.getBylineComponent(
            isSelected,
            <FormattedMessage
              {...messages.memberCountWithoutYou}
              values={{
                count: memberCount,
              }}
            />,
          );
        }
      }
    }
  };

  private getBylineComponent = (isSelected: boolean, message: JSX.Element) => (
    <TextWrapper color={isSelected ? N50 : N200}>{message}</TextWrapper>
  );

  private renderAvatar = () => {
    const {
      team: { avatarUrl, name },
    } = this.props;
    return <SizeableAvatar appearance="big" src={avatarUrl} name={name} />;
  };

  private getLozengeProps = () =>
    this.props.team.lozenge
      ? {
          text: this.props.team.lozenge,
        }
      : undefined;

  render() {
    return (
      <AvatarItemOption
        avatar={this.renderAvatar()}
        secondaryText={this.renderByline()}
        primaryText={this.getPrimaryText()}
        lozenge={this.getLozengeProps()}
      />
    );
  }
}
