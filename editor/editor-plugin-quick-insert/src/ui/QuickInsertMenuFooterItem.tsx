import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import type { QuickInsertPlugin } from '../quickInsertPluginType';

type Props = {
	api: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
};

export const QuickInsertMenuFooterItem = ({ api }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);

			return api?.quickInsert?.commands.openElementBrowser()({ tr }) ?? tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			ariaLabel={formatMessage(toolbarInsertBlockMessages.viewMoreAriaLabel)}
			iconBefore={<ShowMoreHorizontalIcon label="" />}
			isDisabled={!api?.quickInsert}
			onSelect={onSelect}
			shouldShowPreview={false}
			shouldWrapIcon={false}
			title={formatMessage(toolbarInsertBlockMessages.viewMore)}
		/>
	);
};
