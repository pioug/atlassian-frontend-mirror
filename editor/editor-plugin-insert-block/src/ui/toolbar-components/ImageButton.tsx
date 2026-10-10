import React from 'react';

import { useIntl } from 'react-intl';

import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ImageIcon } from '@atlaskit/editor-toolbar/image-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

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

	const isOffline = isOfflineMode(connectivityMode);

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
				testId={TOOLBAR_BUTTON_TEST_ID.IMAGE}
			/>
		</ToolbarTooltip>
	);
};
