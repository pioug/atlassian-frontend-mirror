/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';

import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';
import ToolbarButton from '../../../ui/ToolbarButton';
import { inviteTeamWrapper } from './styles';
import { InviteToEditComponentProps } from '../types';

const ID: React.StatelessComponent = (props) => (
  <Fragment>{props.children}</Fragment>
);

export interface InviteToEditButtonProps {
  onClick?: React.MouseEventHandler;
  selected?: boolean;
  Component?: React.ComponentType<InviteToEditComponentProps>;
  title: string;
}

export const InviteToEditButton: React.FC<InviteToEditButtonProps> = (
  props,
) => {
  const { Component, onClick, selected, title } = props;

  const iconBefore = React.useMemo(
    () => <InviteTeamIcon label={title} />,
    [title],
  );

  if (!Component && !onClick) {
    return null;
  }

  const Wrapper = Component ? Component : ID;

  return (
    <div css={inviteTeamWrapper}>
      <Wrapper>
        <ToolbarButton
          className="invite-to-edit"
          onClick={onClick}
          selected={selected}
          title={title}
          titlePosition="bottom"
          iconBefore={iconBefore}
        />
      </Wrapper>
    </div>
  );
};
