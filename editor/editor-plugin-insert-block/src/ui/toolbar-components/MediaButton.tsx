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
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, ImageIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type MediaButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const MediaButton = ({ api }: MediaButtonProps) => {
	const { formatMessage } = useIntl();

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
			const mountInfo = mediaButtonRef.current
				? { ref: mediaButtonRef.current, mountPoint: mediaButtonRef.current }
				: undefined;

			api?.core?.actions.execute(api?.mediaInsert?.commands.showMediaInsertPopup(mountInfo));
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

	const isOffline = connectivityMode === 'offline';

	return (
		<ToolbarTooltip content={formatMessage(messages.addMediaFiles)}>
			<ToolbarButton
				iconBefore={<ImageIcon label={formatMessage(messages.addMediaFiles)} size="small" />}
				onClick={onClick}
				ref={mediaButtonRef}
				isDisabled={isOffline || !allowsUploads}
			/>
		</ToolbarTooltip>
	);
};
