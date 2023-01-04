import React from 'react';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { CollabEditOptions } from '../collab-edit';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';

type Config = {
  collabEdit?: CollabEditOptions;
  takeFullWidth: boolean;
};

const avatarGroup: NextEditorPlugin<'avatarGroup', never, Config> = (
  props,
) => ({
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
      />
    );
  },
});

export default avatarGroup;
