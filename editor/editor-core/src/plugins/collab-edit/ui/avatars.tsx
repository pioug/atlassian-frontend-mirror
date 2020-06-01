import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import { gridSize, colors } from '@atlaskit/theme';
import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';
import { akEditorSmallZIndex } from '@atlaskit/editor-common';

import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { pluginKey as collabEditPluginKey, PluginState } from '../plugin';
import { getAvatarColor } from '../utils';
import ToolbarButton from '../../../ui/ToolbarButton';
import messages from '../../../messages';
import { CollabInviteToEditProps } from '../types';

export type Props = {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
} & CollabInviteToEditProps;

const AvatarContainer = styled.div`
  margin-right: ${gridSize()}px;
  display: flex;
  align-items: center;
  div:last-child button.invite-to-edit {
    border-radius: 50%;
    height: 32px;
    width: 32px;
    padding: 2px;
  }
`;

const InviteTeamWrapper = styled.div`
  background: ${colors.N20};
  border-radius: 50%;
  min-width: ${gridSize() * 4}px;
  margin-left: -${gridSize() / 2}px;
`;

const Badge = styled.div<{ color: string }>`
  display: block;
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 13px;
  height: 13px;
  z-index: ${akEditorSmallZIndex};
  border-radius: 3px;
  background: ${({ color }) => color};
  color: #fff;
  font-size: 9px;
  line-height: 0;
  padding-top: 7px;
  text-align: center;
  box-shadow: 0 0 1px #fff;
  box-sizing: border-box;
`;

class Avatars extends React.Component<Props & InjectedIntlProps, any> {
  private onAvatarClick = () => {};
  private renderInviteToEditButton = () => {
    const {
      inviteToEditComponent: InviteToEditComponent,
      inviteToEditHandler,
      isInviteToEditButtonSelected,
      intl: { formatMessage },
    } = this.props;

    const button = (
      <ToolbarButton
        className="invite-to-edit"
        onClick={inviteToEditHandler}
        selected={isInviteToEditButtonSelected}
        title={formatMessage(messages.inviteToEditButtonTitle)}
        titlePosition="bottom"
        iconBefore={
          <InviteTeamIcon
            label={formatMessage(messages.inviteToEditButtonTitle)}
          />
        }
      />
    );

    if (InviteToEditComponent) {
      return (
        <InviteTeamWrapper>
          <InviteToEditComponent>{button}</InviteToEditComponent>
        </InviteTeamWrapper>
      );
    } else if (inviteToEditHandler) {
      return <InviteTeamWrapper>{button}</InviteTeamWrapper>;
    }

    return null;
  };

  private renderAvatars = (state: { data?: PluginState }) => {
    if (!state.data) {
      return null;
    }
    const { sessionId, activeParticipants } = state.data as PluginState;
    const avatars = activeParticipants
      .toArray()
      .map(p => ({
        email: p.email,
        key: p.sessionId,
        name: p.name,
        src: p.avatar,
        sessionId: p.sessionId,
        size: 'medium' as SizeType,
        presence: (
          <Badge color={getAvatarColor(p.sessionId).color.solid}>
            {p.name.substr(0, 1).toUpperCase()}
          </Badge>
        ),
      }))
      .sort(p => (p.sessionId === sessionId ? -1 : 1));

    if (!avatars.length) {
      return null;
    }

    return (
      <AvatarContainer>
        <AvatarGroup
          appearance="stack"
          size="medium"
          data={avatars}
          onAvatarClick={this.onAvatarClick}
        />
        {this.renderInviteToEditButton()}
      </AvatarContainer>
    );
  };

  render() {
    return (
      <WithPluginState
        plugins={{ data: collabEditPluginKey }}
        render={this.renderAvatars}
        editorView={this.props.editorView}
      />
    );
  }
}

export default injectIntl(Avatars);
