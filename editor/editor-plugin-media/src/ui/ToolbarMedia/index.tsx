import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { toolbarMediaMessages } from '@atlaskit/editor-common/media';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AttachmentIcon from '@atlaskit/icon/core/attachment';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

interface Props {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	isDisabled?: boolean;
	isReducedSpacing?: boolean;
}

const onClickMediaButton = (showMediaPicker: () => void) => () => {
	showMediaPicker();
	return true;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		allowsUploads: states.mediaState?.allowsUploads,
		showMediaPicker: states.mediaState?.showMediaPicker,
	};
};

const ToolbarMedia = ({
	isDisabled,
	isReducedSpacing,
	intl,
	api,
}: Props & WrappedComponentProps) => {
	const { allowsUploads, showMediaPicker } = useSharedPluginStateWithSelector(
		api,
		['media'],
		selector,
	);
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
