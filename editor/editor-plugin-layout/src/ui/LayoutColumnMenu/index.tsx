import React, { useCallback, useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { EditorToolbarProvider } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';

import type { LayoutPlugin } from '../../layoutPluginType';

import { LAYOUT_COLUMN_MENU, LAYOUT_COLUMN_MENU_FALLBACKS } from './components';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

const LAYOUT_COLUMN_MENU_POPUP_OFFSET: [number, number] = [0, 10];

const getLayoutColumnMenuTarget = (
	editorView: EditorView,
	selectionAnchorPos: number | undefined,
) => {
	if (selectionAnchorPos === undefined) {
		return null;
	}

	const selectionNode = editorView.state.doc.nodeAt(selectionAnchorPos);
	if (selectionNode?.type.name !== 'layoutColumn') {
		return null;
	}

	return findDomRefAtPos(selectionAnchorPos, editorView.domAtPos.bind(editorView));
};

type LayoutColumnMenuProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
};

export const LayoutColumnMenu: React.NamedExoticComponent<LayoutColumnMenuProps> = React.memo(
	function LayoutColumnMenu({
		api,
		editorView,
		mountTo,
		boundariesElement,
		scrollableElement,
	}: LayoutColumnMenuProps): React.JSX.Element | null {
		const { isLayoutColumnMenuOpen, selection } = useSharedPluginStateWithSelector(
			api,
			['layout', 'selection'],
			(states) => ({
				isLayoutColumnMenuOpen: states.layoutState?.isLayoutColumnMenuOpen ?? false,
				selection: states.selectionState?.selection,
			}),
		);

		const closeLayoutColumnMenu = useCallback(() => {
			api?.core?.actions.execute(api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false }));
		}, [api]);

		const handleSetIsOpen = useCallback(
			(isOpen: boolean) => {
				if (!isOpen) {
					closeLayoutColumnMenu();
				}
			},
			[closeLayoutColumnMenu],
		);

		const components = api?.uiControlRegistry?.actions.getComponents(LAYOUT_COLUMN_MENU.key) ?? [];
		const target = isLayoutColumnMenuOpen
			? getLayoutColumnMenuTarget(editorView, selection?.from)
			: null;
		const hasValidTarget = target instanceof HTMLElement;

		useEffect(() => {
			if (isLayoutColumnMenuOpen && (!hasValidTarget || components.length === 0)) {
				closeLayoutColumnMenu();
			}
		}, [closeLayoutColumnMenu, components.length, hasValidTarget, isLayoutColumnMenuOpen]);

		if (!isLayoutColumnMenuOpen || components.length === 0 || !hasValidTarget) {
			return null;
		}

		return (
			<PopupWithListeners
				target={target}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				zIndex={akEditorFloatingPanelZIndex}
				alignX="center"
				alignY="top"
				forcePlacement
				offset={LAYOUT_COLUMN_MENU_POPUP_OFFSET}
				handleClickOutside={closeLayoutColumnMenu}
				handleEscapeKeydown={closeLayoutColumnMenu}
			>
				<EditorToolbarProvider editorView={editorView}>
					<ToolbarDropdownMenuProvider isOpen={isLayoutColumnMenuOpen} setIsOpen={handleSetIsOpen}>
						<SurfaceRenderer
							components={components}
							fallbacks={LAYOUT_COLUMN_MENU_FALLBACKS}
							surface={LAYOUT_COLUMN_MENU}
						/>
					</ToolbarDropdownMenuProvider>
				</EditorToolbarProvider>
			</PopupWithListeners>
		);
	},
);
