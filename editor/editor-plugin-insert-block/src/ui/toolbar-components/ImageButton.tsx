import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, ImageIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type ImageButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const ImageButton = ({ api }: ImageButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { connectivityMode, imageUploadEnabled } = useSharedPluginStateWithSelector(
		api,
		['connectivity', 'imageUpload'],
		(states) => ({
			connectivityMode: states.connectivityState?.mode,
			imageUploadEnabled: states.imageUploadState?.enabled,
		}),
	);

	const { editorView } = useEditorToolbar();

	const isOffline = connectivityMode === 'offline';

	const onClick = () => {
		if (editorView) {
			const { state, dispatch } = editorView;
			api?.imageUpload?.actions.startUpload()(state, dispatch);
		}
	};
	return (
		<ToolbarTooltip content={formatMessage(messages.image)}>
			<ToolbarButton
				iconBefore={<ImageIcon label={formatMessage(messages.image)} size="small" />}
				onClick={onClick}
				isDisabled={!imageUploadEnabled || isOffline}
			/>
		</ToolbarTooltip>
	);
};
