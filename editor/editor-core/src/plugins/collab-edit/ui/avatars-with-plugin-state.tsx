import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { pluginKey as collabEditPluginKey, PluginState } from '../plugin';
import messages from '../../../messages';
import { CollabInviteToEditProps } from '../types';
import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';

export type AvatarsWithPluginStateProps = {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
} & CollabInviteToEditProps;

const AvatarsWithPluginState: React.StatelessComponent<
  AvatarsWithPluginStateProps & InjectedIntlProps
> = (props) => {
  const title = props.intl.formatMessage(messages.inviteToEditButtonTitle);

  const {
    isInviteToEditButtonSelected: selected,
    inviteToEditHandler: onClick,
    inviteToEditComponent: Component,
    editorView,
  } = props;

  const render = React.useCallback(
    ({ data }: { data?: PluginState }) => {
      if (!data) {
        return null;
      }

      return (
        <Avatars
          sessionId={data.sessionId}
          participants={data.activeParticipants}
          editorView={editorView}
        >
          <InviteToEditButton
            title={title}
            selected={selected}
            onClick={onClick}
            Component={Component}
          />
        </Avatars>
      );
    },
    [selected, onClick, Component, title, editorView],
  );

  return (
    <WithPluginState
      plugins={{ data: collabEditPluginKey }}
      render={render}
      editorView={editorView}
    />
  );
};

export default injectIntl(AvatarsWithPluginState);
