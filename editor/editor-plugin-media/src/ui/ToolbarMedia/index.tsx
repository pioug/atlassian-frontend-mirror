import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarMediaMessages } from '@atlaskit/editor-common/media';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';

import type { MediaNextEditorPluginType } from '../../next-plugin-type';
import type { MediaPluginState } from '../../pm-plugins/types';

interface Props {
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
			iconBefore={<AttachmentIcon label={intl.formatMessage(toolbarMediaTitle)} />}
		/>
	);
};

export default injectIntl(ToolbarMedia);
