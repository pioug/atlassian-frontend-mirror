import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import VideoIcon from '@atlaskit/icon/core/video';
import { token } from '@atlaskit/tokens';

import type { LoomPlugin } from '../../loomPluginType';
import { recordVideo, recordVideoFailed } from '../../pm-plugins/commands';
import { loomPluginKey } from '../../pm-plugins/main';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVM4.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVIR.png',
};

export const LoomQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { isOffline } = useQuickInsertContext();
	const preview = useMemo(
		() => ({
			image: previewImageUrls,
			attribution: { name: formatMessage(quickInsertMessages.previewAttributionAtlassian) },
		}),
		[formatMessage],
	);
	const onSelect = useCallback(
		({ editorView, insert }: OnSelectContext) => {
			const tr = insert(undefined);
			const loomState = loomPluginKey.getState(editorView.state);
			if (!loomState?.isEnabled) {
				logException(new Error(loomState?.error), {
					location: 'editor-plugin-loom/quick-insert-record-video',
				});
				return (
					recordVideoFailed({
						inputMethod: INPUT_METHOD.QUICK_INSERT,
						error: loomState?.error,
						editorAnalyticsAPI: api?.analytics?.actions,
					})({ tr }) ?? false
				);
			}

			return (
				recordVideo({
					inputMethod: INPUT_METHOD.QUICK_INSERT,
					editorAnalyticsAPI: api?.analytics?.actions,
				})({ tr }) ?? false
			);
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.recordVideoDescription)}
			iconBefore={<VideoIcon label="" color={token('color.icon.subtle')} spacing="spacious" />}
			isDisabled={isOffline}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(messages.recordVideo)}
		/>
	);
};
