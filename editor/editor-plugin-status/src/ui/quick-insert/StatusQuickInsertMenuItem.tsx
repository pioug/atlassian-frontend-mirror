import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import LozengeIcon from '@atlaskit/icon-lab/core/lozenge';

import { insertStatus } from '../../pm-plugins/actions';
import type { StatusPlugin } from '../../statusPluginType';

export const StatusQuickInsertMenuItem = ({
	api,
	previewImageUrls,
}: {
	api: ExtractInjectionAPI<StatusPlugin> | undefined;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() =>
			previewImageUrls
				? {
						image: previewImageUrls,
						attribution: {
							name: formatMessage(quickInsertMessages.previewAttributionAtlassian),
						},
					}
				: undefined,
		[formatMessage, previewImageUrls],
	);
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);

			return insertStatus(api?.analytics?.actions)(INPUT_METHOD.QUICK_INSERT)({ tr }) ?? tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.statusDescription)}
			iconBefore={<LozengeIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(messages.status)}
		/>
	);
};
