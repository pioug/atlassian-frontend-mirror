import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { pluginKey as collabEditPluginKey, PluginState } from '../plugin';
import messages from '../../../messages';
import { CollabInviteToEditProps } from '../types';
import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';
import { FeatureFlags } from '@atlaskit/editor-common/types';

export type AvatarsWithPluginStateProps = {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  featureFlags: FeatureFlags;
} & CollabInviteToEditProps;

const AvatarsWithPluginState: React.StatelessComponent<
  AvatarsWithPluginStateProps & WrappedComponentProps
> = (props) => {
  const title = props.intl.formatMessage(messages.inviteToEditButtonTitle);

  const {
    isInviteToEditButtonSelected: selected,
    inviteToEditHandler: onClick,
    inviteToEditComponent: Component,
    editorView,
    featureFlags,
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
          featureFlags={featureFlags}
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
    [selected, onClick, Component, title, editorView, featureFlags],
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
