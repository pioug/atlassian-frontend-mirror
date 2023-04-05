import React from 'react';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { CollabEditOptions } from '../collab-edit';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

type Config = {
  collabEdit?: CollabEditOptions;
  takeFullWidth: boolean;
};

const avatarGroup: NextEditorPlugin<
  'avatarGroup',
  {
    pluginConfiguration: Config;
    dependencies: [typeof featureFlagsPlugin];
  }
> = (props, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'avatarGroup',

    primaryToolbarComponent({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
      isToolbarReducedSpacing,
      eventDispatcher,
      dispatchAnalyticsEvent,
    }) {
      return (
        <AvatarGroupPluginWrapper
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          collabEdit={props.collabEdit}
          takeFullWidth={props.takeFullWidth}
          featureFlags={featureFlags}
        />
      );
    },
  };
};

export default avatarGroup;
