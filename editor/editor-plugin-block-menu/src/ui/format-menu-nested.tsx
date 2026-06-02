import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { BlockMenuEventPayload } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

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

	// eslint-disable-next-line @atlaskit/platform/no-preconditioning -- gate + experiment layering for MAUI rollout (cc-maui-experiment + cc-maui-phase-3); will simplify post-rollout
	const formatMenuLabel =
		(expValEquals('cc-maui-experiment', 'isEnabled', true) && fg('cc-maui-phase-3')) ||
		fg('platform_editor_block_menu_jira_patch_3')
			? blockMenuMessages.changeFormat
			: blockMenuMessages.turnInto;

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
