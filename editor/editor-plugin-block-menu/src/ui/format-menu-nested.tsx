import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/block-menu';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuComponent = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const { formatMessage } = useIntl();

	const text = fg('platform_editor_block_menu_patch_1')
		? formatMessage(blockMenuMessages.turnInto)
		: formatMessage(messages.turnInto);

	const isDisabled = useMemo(() => {
		return fg('platform_editor_block_menu_for_disabled_nodes')
			? checkIsFormatMenuHidden(api)
			: false;
	}, [api]);

	return (
		<ToolbarNestedDropdownMenu
			text={text}
			elemBefore={<ChangesIcon label="" />}
			elemAfter={<ChevronRightIcon label="" />}
			enableMaxHeight={true}
			isDisabled={isDisabled}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
