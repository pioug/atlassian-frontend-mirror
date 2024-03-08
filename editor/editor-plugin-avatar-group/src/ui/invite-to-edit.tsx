/** @jsx jsx */
import React, { Fragment } from 'react';

import { jsx } from '@emotion/react';

import type { InviteToEditComponentProps } from '@atlaskit/editor-common/collab';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';

import { inviteTeamWrapperStyles } from './styles';

const ID: React.FunctionComponent = props => (
  <Fragment>{props.children}</Fragment>
);

export interface InviteToEditButtonProps {
  onClick?: React.MouseEventHandler;
  selected?: boolean;
  Component?: React.ComponentType<InviteToEditComponentProps>;
  title: string;
}

export const InviteToEditButton: React.FC<InviteToEditButtonProps> = props => {
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
    // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
    <div css={inviteTeamWrapperStyles}>
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
