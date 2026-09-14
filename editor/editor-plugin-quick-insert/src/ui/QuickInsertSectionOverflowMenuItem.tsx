import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AddIcon from '@atlaskit/icon/core/add';

import type { QuickInsertPlugin } from '../quickInsertPluginType';

type Props = {
	api: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
	category: string;
};

export const QuickInsertSectionOverflowMenuItem = ({ api, category }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);

			return api?.quickInsert?.commands.openElementBrowser({ category })({ tr }) ?? tr;
		},
		[api, category],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<AddIcon label="" />}
			isDisabled={!api?.quickInsert}
			onSelect={onSelect}
			title={formatMessage(toolbarInsertBlockMessages.viewMore)}
		/>
	);
};
