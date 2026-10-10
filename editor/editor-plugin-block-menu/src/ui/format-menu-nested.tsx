import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type { BlockMenuEventPayload } from '@atlaskit/editor-common/analytics/types/block-menu-events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import { messages as blockMenuMessages } from '@atlaskit/editor-common/messages/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-nested-dropdown-menu';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { useBlockMenuTargetVisibility } from './block-menu-target-visibility-context';
import { BLOCK_MENU_ITEM_NAME } from './consts';

const BLOCK_MENU_TRANSFORM_SPOTLIGHT_PORTAL_SELECTOR =
	'[data-test-id="block-menu-transform-spotlight-portal-container"]';

const shouldIgnoreBlockMenuTransformSpotlightCloseEvent = (
	event: Event | React.MouseEvent | React.KeyboardEvent,
) =>
	event.target instanceof Element &&
	event.target.closest(BLOCK_MENU_TRANSFORM_SPOTLIGHT_PORTAL_SELECTOR) !== null;

export const FormatMenuComponent = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const targetVisible = useBlockMenuTargetVisibility();

	const formatMenuLabel = blockMenuMessages.changeFormat;

	const handleClick = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.FORMAT_MENU,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);
			return tr;
		});
	}, [api]);

	return (
		<ToolbarNestedDropdownMenu
			isPopupVisible={targetVisible}
			text={formatMessage(formatMenuLabel)}
			elemBefore={<ChangesIcon label="" size="small" />}
			elemAfter={<ChevronRightIcon label="" size="small" />}
			enableMaxHeight={true}
			onClick={handleClick}
			dropdownTestId="editor-turn-into-menu"
			testId={fg('cc_blocks_changeboarding') ? 'turn-into-block-menu-btn' : undefined}
			shouldFitContainer
			shouldIgnoreCloseEvent={
				fg('cc_blocks_changeboarding')
					? shouldIgnoreBlockMenuTransformSpotlightCloseEvent
					: undefined
			}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
