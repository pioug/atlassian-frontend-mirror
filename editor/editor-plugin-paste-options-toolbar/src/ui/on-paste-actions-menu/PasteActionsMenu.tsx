import React, { useCallback, useEffect, useRef } from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { EditorToolbarProvider, PASTE_MENU } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarDropdownMenuProvider } from '@atlaskit/editor-toolbar';

import { hideToolbar, highlightContent, showToolbar } from '../../editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from '../../pasteOptionsToolbarPluginType';
import { ToolbarDropdownOption } from '../../types/types';
import { isToolbarVisible } from '../toolbar';

import { getVisibleKeys, hasVisibleButton } from './hasVisibleButton';
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
}: PasteActionsMenuProps): React.JSX.Element | null => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const { lastContentPasted } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
		lastContentPasted: states.pasteState?.lastContentPasted,
	}));
	const prevShowToolbarRef = useRef(false);

	useEffect(() => {
		if (!lastContentPasted) {
			hideToolbar()(editorView.state, editorView.dispatch);
			return;
		}

		let selectedOption = ToolbarDropdownOption.None;
		if (!lastContentPasted.isPlainText) {
			selectedOption = ToolbarDropdownOption.RichText;
		} else if (lastContentPasted.isShiftPressed) {
			selectedOption = ToolbarDropdownOption.PlainText;
		} else {
			selectedOption = ToolbarDropdownOption.Markdown;
		}

		const $pos = editorView.state.doc.resolve(lastContentPasted.pasteStartPos);
		const pasteAncestorNodeNames: string[] = [];
		for (let depth = $pos.depth; depth > 0; depth--) {
			pasteAncestorNodeNames.push($pos.node(depth).type.name);
		}

		const legacyVisible = isToolbarVisible(editorView.state, lastContentPasted);

		showToolbar(
			lastContentPasted,
			selectedOption,
			legacyVisible,
			pasteAncestorNodeNames,
		)(editorView.state, editorView.dispatch);
	}, [lastContentPasted, editorView]);

	const { showToolbar: isToolbarShown } = useSharedPluginStateWithSelector(
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

	const aiSurfaceComponents = api?.uiControlRegistry?.actions.getComponents('ai-paste-menu') ?? [];
	const visibleAiActionKeys = getVisibleKeys(aiSurfaceComponents, ['button', 'menu-item']);

	useEffect(() => {
		if (!prevShowToolbarRef.current && isToolbarShown) {
			editorAnalyticsAPI?.fireAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.PASTE_ACTIONS_MENU,
				eventType: EVENT_TYPE.UI,
				attributes: {
					visibleAiActions: visibleAiActionKeys,
				},
			});
		}
		prevShowToolbarRef.current = isToolbarShown;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isToolbarShown, editorAnalyticsAPI]);

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

	const pasteMenuComponents = api?.uiControlRegistry?.actions.getComponents(PASTE_MENU.key) ?? [];

	const anyComponentVisible = hasVisibleButton(pasteMenuComponents);

	if (!isToolbarShown) {
		return null;
	}

	if (!anyComponentVisible) {
		return null;
	}

	const target = getTargetElement(editorView);
	if (!target) {
		return null;
	}

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
				<ToolbarDropdownMenuProvider isOpen={isToolbarShown} setIsOpen={handleSetIsOpen}>
					<PasteActionsMenuContent
						onMouseDown={preventEditorFocusLoss}
						onMouseEnter={handleMouseEnter}
						components={pasteMenuComponents}
					/>
				</ToolbarDropdownMenuProvider>
			</EditorToolbarProvider>
		</PopupWithListeners>
	);
};
