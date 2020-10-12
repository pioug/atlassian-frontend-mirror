import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { N20, N0, N800, N50, N200 } from '@atlaskit/theme/colors';
import PeopleIcon from '@atlaskit/icon/glyph/people';

import { Group } from '../types';
import { AvatarItemOption, TextWrapper } from './AvatarItemOption';
import { messages } from './i18n';
import { HighlightText } from './HighlightText';

export const GroupOptionIconWrapper = styled.span`
  padding: 2px;

  > span {
    background-color: ${N20};
    border-radius: 50%;
    padding: 4px;
  }
`;

export type GroupOptionProps = {
  group: Group;
  isSelected: boolean;
};

export class GroupOption extends React.PureComponent<GroupOptionProps> {
  private getPrimaryText = () => {
    const {
      isSelected,
      group: { name, highlight },
    } = this.props;
    return [
      <TextWrapper key="name" color={isSelected ? N0 : N800}>
        <HighlightText highlights={highlight && highlight.name}>
          {name}
        </HighlightText>
      </TextWrapper>,
    ];
  };

  private renderAvatar = () => (
    <GroupOptionIconWrapper>
      <PeopleIcon label="group-icon" size="medium" />
    </GroupOptionIconWrapper>
  );

  private renderByline = () => {
    const { isSelected } = this.props;
    return (
      <TextWrapper color={isSelected ? N50 : N200}>
        <FormattedMessage {...messages.groupByline} />
      </TextWrapper>
    );
  };

  private getLozengeProps = () =>
    this.props.group.lozenge
      ? {
          text: this.props.group.lozenge,
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
