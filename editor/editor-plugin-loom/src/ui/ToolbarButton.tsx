import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import VideoCircleIcon from '@atlaskit/icon/glyph/video-circle';

import { recordVideo } from '../commands';
import type { LoomPlugin } from '../plugin';

const LoomToolbarButton = ({
  disabled,
  api,
  intl: { formatMessage },
}: {
  disabled: boolean;
  api: ExtractInjectionAPI<LoomPlugin> | undefined;
} & WrappedComponentProps) => {
  const { loomState } = useSharedPluginState(api, ['loom']);
  if (!loomState) {
    return null;
  }
  const label = formatMessage(toolbarInsertBlockMessages.recordVideo);

  return (
    <ToolbarButton
      buttonId={TOOLBAR_BUTTON.RECORD_VIDEO}
      onClick={() =>
        api?.core?.actions.execute(
          recordVideo({
            inputMethod: INPUT_METHOD.TOOLBAR,
            editorAnalyticsAPI: api?.analytics?.actions,
          }),
        )
      }
      // Disable the icon while the SDK isn't initialised
      disabled={disabled || !loomState?.isEnabled}
      title={label}
      iconBefore={<VideoCircleIcon label={label} />}
    />
  );
};

export default injectIntl(LoomToolbarButton);
