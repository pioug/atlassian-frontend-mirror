import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { toolbarMediaMessages } from '@atlaskit/editor-common/media';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AttachmentIcon from '@atlaskit/icon/core/migration/attachment--editor-attachment';

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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		return useSharedPluginStateWithSelector(api, ['media'], selector);
	},
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { mediaState } = useSharedPluginState(api, ['media']);
		return {
			allowsUploads: mediaState?.allowsUploads,
			showMediaPicker: mediaState?.showMediaPicker,
		};
	},
);

const ToolbarMedia = ({
	isDisabled,
	isReducedSpacing,
	intl,
	api,
}: Props & WrappedComponentProps) => {
	const { allowsUploads, showMediaPicker } = useSharedState(api);
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
