import React from 'react';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import { ToolbarButton, TOOLBAR_BUTTON } from '@atlaskit/editor-common/ui-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MediaPluginState } from '../../pm-plugins/types';
import type { MediaNextEditorPluginType } from '../../next-plugin-type';
import { toolbarMediaMessages } from './toolbar-media-messages';
import type { WrappedComponentProps } from 'react-intl-next';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { injectIntl } from 'react-intl-next';

export interface Props {
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
  api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

const onClickMediaButton = (pluginState: MediaPluginState) => () => {
  pluginState.showMediaPicker();
  return true;
};

const ToolbarMedia = ({
  isDisabled,
  isReducedSpacing,
  intl,
  api,
}: Props & WrappedComponentProps) => {
  const { mediaState } = useSharedPluginState(api, ['media']);

  if (!mediaState?.allowsUploads) {
    return null;
  }

  const { toolbarMediaTitle } = toolbarMediaMessages;

  return (
    <ToolbarButton
      buttonId={TOOLBAR_BUTTON.MEDIA}
      onClick={onClickMediaButton(mediaState)}
      disabled={isDisabled}
      title={intl.formatMessage(toolbarMediaTitle)}
      spacing={isReducedSpacing ? 'none' : 'default'}
      iconBefore={
        <AttachmentIcon label={intl.formatMessage(toolbarMediaTitle)} />
      }
    />
  );
};

export default injectIntl(ToolbarMedia);
