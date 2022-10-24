/** @jsx jsx */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/core';

import { N20, B400, N800, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import PeopleIcon from '@atlaskit/icon/glyph/people';

import { Group } from '../../types';
import { AvatarItemOption, textWrapper } from '../AvatarItemOption';
import { messages } from '.././i18n';
import { HighlightText } from '../HighlightText';

export const groupOptionIconWrapper = css({
  padding: '2px',
  '> span': {
    backgroundColor: token('color.background.neutral', N20),
    borderRadius: '50%',
    padding: '4px',
  },
});

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
      <span
        key="name"
        css={textWrapper(
          isSelected
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

  private renderAvatar = () => (
    <span css={groupOptionIconWrapper}>
      <PeopleIcon label="group-icon" size="medium" />
    </span>
  );

  private renderByline = () => {
    const { isSelected } = this.props;
    return (
      <span
        css={textWrapper(
          isSelected
            ? token('color.text.selected', B400)
            : token('color.text.subtlest', N200),
        )}
      >
        <FormattedMessage {...messages.groupByline} />
      </span>
    );
  };

  private getLozengeProps = () =>
    typeof this.props.group.lozenge === 'string'
      ? {
          text: this.props.group.lozenge,
        }
      : this.props.group.lozenge;

  render() {
    return (
      <AvatarItemOption
        avatar={this.renderAvatar()}
        isDisabled={this.props.group.isDisabled}
        lozenge={this.getLozengeProps()}
        primaryText={this.getPrimaryText()}
        secondaryText={this.renderByline()}
      />
    );
  }
}
