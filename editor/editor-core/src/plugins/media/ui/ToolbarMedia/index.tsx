import React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import WithPluginState from '../../../../ui/WithPluginState';
import { EventDispatcher } from '../../../../event-dispatcher';
import { MediaPluginState } from '../../pm-plugins/types';

export interface Props<T extends MediaPluginState> {
  editorView: EditorView;
  pluginKey: PluginKey<T>;
  eventDispatcher: EventDispatcher;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

const onClickMediaButton = (pluginState: MediaPluginState) => () => {
  pluginState.showMediaPicker();
  return true;
};

const ToolbarMedia = <T extends MediaPluginState>({
  editorView,
  eventDispatcher,
  pluginKey,
  isDisabled,
  isReducedSpacing,
}: Props<T>) => (
  <WithPluginState
    editorView={editorView}
    eventDispatcher={eventDispatcher}
    plugins={{
      mediaPlugin: pluginKey,
    }}
    render={({ mediaPlugin }) => {
      if (!mediaPlugin?.allowsUploads) {
        return null;
      }

      return (
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.MEDIA}
          onClick={onClickMediaButton(mediaPlugin)}
          disabled={isDisabled}
          title="Files & images"
          spacing={isReducedSpacing ? 'none' : 'default'}
          iconBefore={<AttachmentIcon label="Files & images" />}
        />
      );
    }}
  />
);

export default ToolbarMedia;
