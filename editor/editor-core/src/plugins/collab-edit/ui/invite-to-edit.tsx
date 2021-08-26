import React from 'react';

import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';
import ToolbarButton from '../../../ui/ToolbarButton';
import { InviteTeamWrapper } from './styles';
import { InviteToEditComponentProps } from '../types';

const ID: React.StatelessComponent = (props) => <>{props.children}</>;

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

  const iconBefore = React.useMemo(() => <InviteTeamIcon label={title} />, [
    title,
  ]);

  if (!Component && !onClick) {
    return null;
  }

  const Wrapper = Component ? Component : ID;

  return (
    <InviteTeamWrapper>
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
    </InviteTeamWrapper>
  );
};
