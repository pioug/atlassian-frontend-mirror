import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarMediaMessages } from '@atlaskit/editor-common/media';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import AttachmentIcon from '@atlaskit/icon/core/migration/attachment--editor-attachment';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

interface Props {
	isDisabled?: boolean;
	isReducedSpacing?: boolean;
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

const onClickMediaButton = (showMediaPicker: () => void) => () => {
	showMediaPicker();
	return true;
};

const ToolbarMedia = ({
	isDisabled,
	isReducedSpacing,
	intl,
	api,
}: Props & WrappedComponentProps) => {
	const { mediaState } = useSharedPluginState(api, ['media'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});
	const allowsUploadsSelector = useSharedPluginStateSelector(api, 'media.allowsUploads', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const showMediaPickerSelector = useSharedPluginStateSelector(api, 'media.showMediaPicker', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});

	const allowsUploads = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? allowsUploadsSelector
		: mediaState?.allowsUploads;
	const showMediaPicker = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? showMediaPickerSelector
		: mediaState?.showMediaPicker;

	if (!allowsUploads || !showMediaPicker) {
		return null;
	}

	const { toolbarMediaTitle } = toolbarMediaMessages;

	return (
		<ToolbarButton
			buttonId={TOOLBAR_BUTTON.MEDIA}
			onClick={onClickMediaButton(showMediaPicker)}
			disabled={isDisabled}
			title={intl.formatMessage(toolbarMediaTitle)}
			spacing={isReducedSpacing ? 'none' : 'default'}
			iconBefore={<AttachmentIcon label={intl.formatMessage(toolbarMediaTitle)} />}
		/>
	);
};

export default injectIntl(ToolbarMedia);
