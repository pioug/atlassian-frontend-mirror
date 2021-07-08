import { B400, N800, N200 } from '@atlaskit/theme/colors';
import React from 'react';
import { User } from '../types';
import { AvatarItemOption, TextWrapper } from './AvatarItemOption';
import { HighlightText } from './HighlightText';
import { SizeableAvatar } from './SizeableAvatar';
import { hasValue } from './utils';

export type UserOptionProps = {
  user: User;
  status?: string;
  isSelected: boolean;
};

export class UserOption extends React.PureComponent<UserOptionProps> {
  getPrimaryText = () => {
    const {
      user: { name, publicName, highlight },
    } = this.props;

    const result = [
      <TextWrapper key="name" color={this.props.isSelected ? B400 : N800}>
        <HighlightText highlights={highlight && highlight.name}>
          {name}
        </HighlightText>
      </TextWrapper>,
    ];
    if (hasValue(publicName) && name.trim() !== publicName.trim()) {
      result.push(
        <React.Fragment key="publicName">
          {' '}
          <TextWrapper color={this.props.isSelected ? B400 : N200}>
            (
            <HighlightText highlights={highlight && highlight.publicName}>
              {publicName}
            </HighlightText>
            )
          </TextWrapper>
        </React.Fragment>,
      );
    }
    return result;
  };

  renderSecondaryText = () =>
    this.props.user.byline ? (
      <TextWrapper color={this.props.isSelected ? B400 : N200}>
        {this.props.user.byline}
      </TextWrapper>
    ) : undefined;

  private renderAvatar = () => {
    const {
      user: { avatarUrl, name },
      status,
    } = this.props;
    return (
      <SizeableAvatar
        appearance="big"
        src={avatarUrl}
        presence={status}
        name={name}
      />
    );
  };

  private getLozengeProps = () =>
    typeof this.props.user.lozenge === 'string'
      ? {
          text: this.props.user.lozenge,
        }
      : this.props.user.lozenge;

  render() {
    return (
      <AvatarItemOption
        avatar={this.renderAvatar()}
        primaryText={this.getPrimaryText()}
        secondaryText={this.renderSecondaryText()}
        lozenge={this.getLozengeProps()}
      />
    );
  }
}
