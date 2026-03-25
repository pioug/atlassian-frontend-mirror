import React, { useRef } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { ToolbarButton, ToolbarTooltip, ImageIcon, useToolbarUI } from '@atlaskit/editor-toolbar';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type MediaButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const MediaButton = ({ api }: MediaButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { popupsMountPoint } = useToolbarUI();

	const { showMediaPicker, connectivityMode, allowsUploads } = useSharedPluginStateWithSelector(
		api,
		['media', 'connectivity'],
		(states) => ({
			showMediaPicker: states.mediaState?.showMediaPicker,
			allowsUploads: states.mediaState?.allowsUploads,
			connectivityMode: states.connectivityState?.mode,
		}),
	);

	const mediaButtonRef = useRef<HTMLButtonElement | null>(null);

	if (!api?.media) {
		return null;
	}

	const onClick = () => {
		if (!showMediaPicker) {
			return;
		}

		if (api?.mediaInsert?.commands?.showMediaInsertPopup) {
			const ref = mediaButtonRef.current;
			const mountInfoOld = ref
				? {
						ref,
						mountPoint: ref,
					}
				: undefined;
			const mountInfo = ref?.parentElement
				? {
						ref,
						mountPoint: popupsMountPoint ?? ref.parentElement,
					}
				: undefined;
			const resolvedMountInfo = editorExperiment('platform_editor_fix_media_picker_hidden', true, {
				exposure: true,
			})
				? mountInfo
				: mountInfoOld;

			api?.core?.actions.execute(
				api?.mediaInsert?.commands.showMediaInsertPopup(resolvedMountInfo),
			);
		} else {
			showMediaPicker();
		}

		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.OPENED,
			actionSubject: ACTION_SUBJECT.PICKER,
			actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
			attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
			eventType: EVENT_TYPE.UI,
		});
	};

	const isOffline = isOfflineMode(connectivityMode);

	return (
		<ToolbarTooltip content={formatMessage(messages.addMediaFiles)}>
			<ToolbarButton
				iconBefore={<ImageIcon label={formatMessage(messages.addMediaFiles)} size="small" />}
				onClick={onClick}
				ref={mediaButtonRef}
				isDisabled={isOffline || !allowsUploads}
				testId={TOOLBAR_BUTTON_TEST_ID.MEDIA}
			/>
		</ToolbarTooltip>
	);
};
