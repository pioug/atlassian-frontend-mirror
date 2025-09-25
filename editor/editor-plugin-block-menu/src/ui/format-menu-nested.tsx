import React, { useMemo, useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { messages } from '@atlaskit/editor-common/block-menu';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuComponent = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const { formatMessage } = useIntl();
	const { fireAnalyticsEvent } = useBlockMenu();

	const text = fg('platform_editor_block_menu_patch_1')
		? formatMessage(blockMenuMessages.turnInto)
		: formatMessage(messages.turnInto);

	const isDisabled = useMemo(() => {
		return fg('platform_editor_block_menu_for_disabled_nodes')
			? checkIsFormatMenuHidden(api)
			: false;
	}, [api]);

	const handleClick = useCallback(() => {
		fireAnalyticsEvent?.({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_MENU,
			eventType: EVENT_TYPE.UI,
			attributes: { inputMethod: INPUT_METHOD.MOUSE },
		});
	}, [fireAnalyticsEvent]);

	return (
		<ToolbarNestedDropdownMenu
			text={text}
			elemBefore={<ChangesIcon label="" />}
			elemAfter={<ChevronRightIcon label="" />}
			enableMaxHeight={true}
			isDisabled={isDisabled}
			onClick={handleClick}
			dropdownTestId="editor-nested-turn-into-menu"
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
