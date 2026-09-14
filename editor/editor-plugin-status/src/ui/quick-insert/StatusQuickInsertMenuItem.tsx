import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import LozengeIcon from '@atlaskit/icon-lab/core/lozenge';

import { insertStatus } from '../../pm-plugins/actions';
import type { StatusPlugin } from '../../statusPluginType';

export const StatusQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<StatusPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);

			return insertStatus(api?.analytics?.actions)(INPUT_METHOD.QUICK_INSERT)({ tr }) ?? tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<LozengeIcon label="" />}
			onSelect={onSelect}
			title={formatMessage(messages.status)}
		/>
	);
};
