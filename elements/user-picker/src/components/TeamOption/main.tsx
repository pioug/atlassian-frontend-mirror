/** @jsx jsx */
import { B400, N800, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { jsx } from '@emotion/core';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { Team } from '../../types';
import { AvatarItemOption, textWrapper } from '../AvatarItemOption';
import { HighlightText } from '../HighlightText';
import { messages } from '../i18n';
import { SizeableAvatar } from '../SizeableAvatar';

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
      <span
        key="name"
        css={textWrapper(
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text', N800),
        )}
      >
        <HighlightText highlights={highlight && highlight.name}>
          {name}
        </HighlightText>
      </span>,
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
    <span
      css={textWrapper(
        isSelected
          ? token('color.text.selected', B400)
          : token('color.text.subtlest', N200),
      )}
    >
      {message}
    </span>
  );

  private renderAvatar = () => {
    const {
      team: { avatarUrl, name },
    } = this.props;
    return <SizeableAvatar appearance="big" src={avatarUrl} name={name} />;
  };

  private getLozengeProps = () =>
    typeof this.props.team.lozenge === 'string'
      ? {
          text: this.props.team.lozenge,
        }
      : this.props.team.lozenge;

  private renderCustomByLine = () => {
    if (!this.props.team?.byline) {
      return undefined;
    }

    return (
      <span
        css={textWrapper(
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.subtlest', N200),
        )}
      >
        {this.props.team.byline}
      </span>
    );
  };

  render() {
    return (
      <AvatarItemOption
        avatar={this.renderAvatar()}
        isDisabled={this.props.team.isDisabled}
        lozenge={this.getLozengeProps()}
        primaryText={this.getPrimaryText()}
        secondaryText={this.renderCustomByLine() || this.renderByline()}
      />
    );
  }
}
