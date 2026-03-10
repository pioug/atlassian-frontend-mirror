import React, { useCallback } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { EditorToolbarProvider, PASTE_MENU } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar';

import { hideToolbar, highlightContent } from '../../editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from '../../pasteOptionsToolbarPluginType';

import { PasteActionsMenuContent } from './PasteActionsMenuContent';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

interface PasteActionsMenuProps {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
}

function getTargetElement(editorView: EditorView): HTMLElement | null {
	const { from } = editorView.state.selection;
	try {
		const domRef = findDomRefAtPos(from, editorView.domAtPos.bind(editorView));
		if (domRef instanceof HTMLElement) {
			return domRef;
		}
		return null;
	} catch {
		return null;
	}
}

function getPopupOffset(dom: HTMLElement | null): [number, number] {
	if (!dom) {
		return [0, 20];
	}
	const rightEdge = dom.getBoundingClientRect().right;
	return [-(window.innerWidth - rightEdge - 50), 20];
}

export const PasteActionsMenu = ({
	api,
	editorView,
	mountTo,
	boundariesElement,
	scrollableElement,
}: PasteActionsMenuProps) => {
	const { showToolbar } = useSharedPluginStateWithSelector(
		api,
		['pasteOptionsToolbarPlugin'],
		(states) => {
			const pluginState = states.pasteOptionsToolbarPluginState as
				| PasteOptionsToolbarSharedState
				| undefined;
			return {
				showToolbar: pluginState?.showToolbar ?? false,
			};
		},
	);

	const preventEditorFocusLoss = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
	}, []);

	const handleDismiss = useCallback(() => {
		hideToolbar()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleMouseEnter = useCallback(() => {
		highlightContent()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleClickOutside = useCallback(
		(evt: MouseEvent) => {
			if (evt.target instanceof Element) {
				const isInsideNestedDropdown = evt.target.closest('[data-toolbar-nested-dropdown-menu]');
				if (isInsideNestedDropdown) {
					return;
				}
			}
			handleDismiss();
		},
		[handleDismiss],
	);

	const handleSetIsOpen = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				handleDismiss();
			}
		},
		[handleDismiss],
	);

	if (!showToolbar) {
		return null;
	}

	const target = getTargetElement(editorView);
	if (!target) {
		return null;
	}

	const aiSurface = { type: 'menu' as const, key: 'ai-paste-menu' };
	const aiSurfaceComponents = api?.uiControlRegistry?.actions.getComponents(aiSurface.key) ?? [];

	const pasteSurfaceComponents =
		api?.uiControlRegistry?.actions.getComponents(PASTE_MENU.key) ?? [];

	return (
		<PopupWithListeners
			target={target}
			mountTo={mountTo}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			offset={getPopupOffset(target)}
			zIndex={akEditorFloatingPanelZIndex}
			alignX="right"
			alignY="bottom"
			handleClickOutside={handleClickOutside}
			handleEscapeKeydown={handleDismiss}
		>
			<EditorToolbarProvider editorView={editorView}>
				<ToolbarDropdownMenuProvider isOpen={showToolbar} setIsOpen={handleSetIsOpen}>
					<PasteActionsMenuContent
						onMouseDown={preventEditorFocusLoss}
						onMouseEnter={handleMouseEnter}
						aiSurface={aiSurface}
						aiSurfaceComponents={aiSurfaceComponents}
						pasteSurfaceComponents={pasteSurfaceComponents}
					/>
				</ToolbarDropdownMenuProvider>
			</EditorToolbarProvider>
		</PopupWithListeners>
	);
};
