import React from 'react';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import WithPluginState from '../../../../ui/WithPluginState';
import type { EventDispatcher } from '../../../../event-dispatcher';
import type { MediaPluginState } from '../../pm-plugins/types';
import { toolbarMediaMessages } from './toolbar-media-messages';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

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
  intl,
}: Props<T> & WrappedComponentProps) => (
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

      const { toolbarMediaTitle } = toolbarMediaMessages;

      return (
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.MEDIA}
          onClick={onClickMediaButton(mediaPlugin)}
          disabled={isDisabled}
          title={intl.formatMessage(toolbarMediaTitle)}
          spacing={isReducedSpacing ? 'none' : 'default'}
          iconBefore={
            <AttachmentIcon label={intl.formatMessage(toolbarMediaTitle)} />
          }
        />
      );
    }}
  />
);

export default injectIntl(ToolbarMedia);
