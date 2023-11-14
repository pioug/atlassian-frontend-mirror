import React from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import WithPluginState from '../../../ui/WithPluginState';
import type { EventDispatcher } from '../../../event-dispatcher';
import type { PluginState } from '../plugin';
import { pluginKey as collabEditPluginKey } from '../plugin';
import messages from '../../../messages';
import type { CollabInviteToEditProps } from '../types';
import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export type AvatarsWithPluginStateProps = {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  featureFlags: FeatureFlags;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
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
    editorAnalyticsAPI,
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
          editorAnalyticsAPI={editorAnalyticsAPI}
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
    [
      selected,
      onClick,
      Component,
      title,
      editorView,
      featureFlags,
      editorAnalyticsAPI,
    ],
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
