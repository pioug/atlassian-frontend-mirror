import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { TOOLBAR_ACTION_SUBJECT_ID as TOOLBAR_BUTTON } from '@atlaskit/editor-common/analytics/types/toolbar-button';
import { toolbarMediaMessages } from '@atlaskit/editor-common/media/toolbarMedia';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import ToolbarButton from '@atlaskit/editor-common/ui-menu/ToolbarButton';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
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

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ToolbarMedia);
export default _default_1;
