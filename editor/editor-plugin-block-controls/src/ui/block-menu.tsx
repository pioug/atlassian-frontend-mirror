import React, { useCallback } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { ArrowKeyNavigationType, DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

import { getBlockMenuItems, menuItemsCallback } from './block-menu-items';
import { BLOCK_MENU_WIDTH } from './consts';
import { getAnchorAttrName } from './utils/dom-attr-name';

type BlockMenuProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView | undefined;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
};

type BlockMenuContentProps = BlockMenuProps & {
	formatMessage: WrappedComponentProps['intl']['formatMessage'];
	menuTriggerBy: string;
};

const BlockMenuContent = ({
	editorView,
	mountPoint,
	boundariesElement,
	scrollableElement,
	api,
	menuTriggerBy,
	formatMessage,
}: BlockMenuContentProps) => {
	const activeNodeSelector = `[${getAnchorAttrName()}=${menuTriggerBy}]`;
	const targetHandleRef = document.querySelector(activeNodeSelector);
	const items = getBlockMenuItems(formatMessage);

	const handleOpenChange = useCallback(
		(payload?: { event: PointerEvent | KeyboardEvent; isOpen: boolean }) => {
			if (!payload?.isOpen) {
				api?.core.actions.execute(api?.blockControls.commands.toggleBlockMenu({ closeMenu: true }));
			}
		},
		[api?.core.actions, api?.blockControls.commands],
	);

	const onMenuItemActivated = useCallback(
		({ item }: { item: MenuItem }) => {
			if (editorView) {
				menuItemsCallback[item.value.name as keyof typeof menuItemsCallback]?.(
					api,
					formatMessage,
				)?.(editorView.state, editorView.dispatch, editorView);
				api?.core.actions.execute(api?.blockControls.commands.toggleBlockMenu({ closeMenu: true }));
			}
		},
		[api, editorView, formatMessage],
	);

	return (
		<Popup
			alignX={'left'}
			alignY={'start'}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetHandleRef as HTMLElement}
			mountTo={undefined}
			zIndex={akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			stick={true}
			offset={[-6, 8]}
		>
			<DropdownMenu
				mountTo={mountPoint}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				//This needs be removed when the a11y is completely handled
				//Disabling key navigation now as it works only partially
				arrowKeyNavigationProviderOptions={{
					type: ArrowKeyNavigationType.MENU,
				}}
				items={items}
				isOpen={true}
				fitWidth={BLOCK_MENU_WIDTH}
				section={{ hasSeparator: true }}
				onOpenChange={handleOpenChange}
				onItemActivated={onMenuItemActivated}
			/>
		</Popup>
	);
};

const BlockMenu = ({
	editorView,
	mountPoint,
	boundariesElement,
	scrollableElement,
	api,
	intl: { formatMessage },
}: BlockMenuProps & WrappedComponentProps) => {
	const { isMenuOpen, menuTriggerBy } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		(states) => ({
			isMenuOpen: states.blockControlsState?.isMenuOpen,
			menuTriggerBy: states.blockControlsState?.menuTriggerBy,
		}),
	);

	if (isMenuOpen) {
		return null;
	}

	if (!menuTriggerBy) {
		return null;
	}

	return (
		<BlockMenuContent
			editorView={editorView}
			mountPoint={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			api={api}
			menuTriggerBy={menuTriggerBy}
			formatMessage={formatMessage}
		/>
	);
};

export default injectIntl(BlockMenu);
