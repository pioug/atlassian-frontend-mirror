import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { ArrowKeyNavigationType, DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

import { getBlockMenuItems, menuItemsCallback } from './block-menu-items';
import { BLOCK_MENU_WIDTH } from './consts';

const dragHandleSelector = '[data-blocks-drag-handle-container="true"] button';

type BlockMenuProps = {
	editorView: EditorView | undefined;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
};

const BlockMenu = ({
	editorView,
	mountPoint,
	boundariesElement,
	scrollableElement,
	api,
	intl: { formatMessage },
}: BlockMenuProps & WrappedComponentProps) => {
	const { blockControlsState } = useSharedPluginState(api, ['blockControls']);
	if (!blockControlsState?.isMenuOpen) {
		return null;
	}

	const targetHandleRef = document.querySelector(dragHandleSelector);
	const items = getBlockMenuItems(formatMessage);

	const handleOpenChange = (payload?: { event: PointerEvent | KeyboardEvent; isOpen: boolean }) => {
		if (!payload?.isOpen) {
			api?.core.actions.execute(api?.blockControls.commands.toggleBlockMenu({ closeMenu: true }));
		}
	};

	const onMenuItemActivated = ({ item }: { item: MenuItem }) => {
		if (editorView) {
			menuItemsCallback[item.value.name as keyof typeof menuItemsCallback]?.(api, formatMessage)?.(
				editorView.state,
				editorView.dispatch,
				editorView,
			);
		}
	};

	return (
		<Popup
			alignX={'right'}
			alignY={'start'}
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			target={targetHandleRef as HTMLElement}
			mountTo={undefined}
			zIndex={akEditorFloatingOverlapPanelZIndex}
			forcePlacement={true}
			stick={true}
			offset={[-18, 8]}
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

export default injectIntl(BlockMenu);
