import React from 'react';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

type Config = {
  collabEdit?: CollabEditOptions;
  takeFullWidth: boolean;
};

const avatarGroup: NextEditorPlugin<
  'avatarGroup',
  {
    pluginConfiguration: Config;
    dependencies: [FeatureFlagsPlugin, OptionalPlugin<AnalyticsPlugin>];
  }
> = ({ config: props, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
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
          collabEdit={props?.collabEdit}
          takeFullWidth={props?.takeFullWidth}
          featureFlags={featureFlags}
          editorAnalyticsAPI={api?.analytics?.actions}
        />
      );
    },
  };
};

export default avatarGroup;
