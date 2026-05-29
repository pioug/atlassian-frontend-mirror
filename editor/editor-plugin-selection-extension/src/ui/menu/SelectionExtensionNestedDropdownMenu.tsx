import React from 'react';

import { cssMap } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { EXTENSION_MENU_ITEM_TEST_ID } from '@atlaskit/editor-common/block-menu';
import { ToolbarDropdownItemSection, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { ExtensionNestedDropdownMenuConfiguration } from '../../types';
import { useSelectionExtensionComponentContext } from '../SelectionExtensionComponentContext';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';

const BLOCK_MENU_TEMPLATES_SPOTLIGHT_PORTAL_SELECTOR =
	'[data-test-id="block-menu-templates-spotlight-portal-container"]';

const shouldIgnoreBlockMenuTemplatesSpotlightCloseEvent = (
	event: Event | React.MouseEvent | React.KeyboardEvent,
) =>
	event.target instanceof Element &&
	event.target.closest(BLOCK_MENU_TEMPLATES_SPOTLIGHT_PORTAL_SELECTOR) !== null;

const styles = cssMap({
	lozenge: {
		marginLeft: token('space.075'),
	},
});

export type SelectionExtensionNestedDropdownMenuProps = {
	nestedDropdownMenu: ExtensionNestedDropdownMenuConfiguration;
};

const ChildItems = ({ nestedDropdownMenu }: SelectionExtensionNestedDropdownMenuProps) => {
	const childItems = nestedDropdownMenu.getMenuItems();

	return (
		<ToolbarDropdownItemSection>
			{childItems.map((dropdownItem) => (
				<SelectionExtensionDropdownItem
					key={dropdownItem.key || dropdownItem.label}
					dropdownItem={dropdownItem}
				/>
			))}
		</ToolbarDropdownItemSection>
	);
};

export const SelectionExtensionNestedDropdownMenu = ({
	nestedDropdownMenu,
}: SelectionExtensionNestedDropdownMenuProps): React.JSX.Element => {
	const IconComponent = nestedDropdownMenu.icon;
	const { api, extensionKey, extensionSource, extensionLocation } =
		useSelectionExtensionComponentContext();

	const handleClick = () => {
		api.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_DROPDOWN,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				extensionKey,
				extensionSource,
				extensionLocation,
				extensionElement: 'nested-dropdown',
				extensionItemKey: nestedDropdownMenu.key,
			},
		});
	};

	const lozengeLabel = nestedDropdownMenu.lozenge?.label;
	const elemAfterText =
		lozengeLabel && fg('platform_editor_block_menu_v2_patch_2') ? (
			<Box as="span" xcss={styles.lozenge}>
				<Lozenge
					appearance={
						fg('confluence_fronend_labels_categorization_migration') ? 'discovery' : 'new'
					}
				>
					{lozengeLabel}
				</Lozenge>
			</Box>
		) : undefined;

	return (
		<ToolbarNestedDropdownMenu
			testId={EXTENSION_MENU_ITEM_TEST_ID}
			text={nestedDropdownMenu.label}
			elemAfterText={elemAfterText}
			elemBefore={IconComponent ? <IconComponent label="" size="small" /> : undefined}
			elemAfter={<ChevronRightIcon label="" size="small" />}
			onClick={handleClick}
			dropdownTestId="editor-selection-extension-menu"
			shouldTitleWrap={false}
			tooltipContent={nestedDropdownMenu.label}
			data-extension-item-key={nestedDropdownMenu.key}
			shouldIgnoreCloseEvent={
				fg('cc_blocks_changeboarding')
					? shouldIgnoreBlockMenuTemplatesSpotlightCloseEvent
					: undefined
			}
		>
			<ChildItems nestedDropdownMenu={nestedDropdownMenu} />
		</ToolbarNestedDropdownMenu>
	);
};
