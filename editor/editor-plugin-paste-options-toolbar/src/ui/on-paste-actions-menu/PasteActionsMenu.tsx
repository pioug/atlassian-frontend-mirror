import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { pasteOptionsToolbarMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';

import {
	changeToMarkdownWithAnalytics,
	changeToPlainTextWithAnalytics,
	changeToRichTextWithAnalytics,
	hideToolbar,
	highlightContent,
} from '../../editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from '../../pasteOptionsToolbarPluginType';
import { ToolbarDropdownOption } from '../../types/types';

import type { MenuOption } from './PasteActionsMenuContent';
import { PasteActionsMenuContent } from './PasteActionsMenuContent';

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

interface PasteActionsMenuProps {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
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
	editorAnalyticsAPI,
}: PasteActionsMenuProps) => {
	const intl = useIntl();

	const { showToolbar, isPlainText, selectedOption, plaintextLength } =
		useSharedPluginStateWithSelector(api, ['pasteOptionsToolbarPlugin'], (states) => {
			const pluginState = states.pasteOptionsToolbarPluginState as
				| PasteOptionsToolbarSharedState
				| undefined;
			return {
				showToolbar: pluginState?.showToolbar ?? false,
				isPlainText: pluginState?.isPlainText ?? false,
				selectedOption: pluginState?.selectedOption ?? ToolbarDropdownOption.None,
				plaintextLength: pluginState?.plaintextLength ?? 0,
			};
		});

	const preventEditorFocusLoss = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
	}, []);

	const handleDismiss = useCallback(() => {
		hideToolbar()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleMouseEnter = useCallback(() => {
		highlightContent()(editorView.state, editorView.dispatch);
	}, [editorView]);

	const handleRichText = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			changeToRichTextWithAnalytics(editorAnalyticsAPI)()(editorView.state, editorView.dispatch);
		},
		[editorView, editorAnalyticsAPI],
	);

	const handleMarkdown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			changeToMarkdownWithAnalytics(editorAnalyticsAPI, plaintextLength)()(
				editorView.state,
				editorView.dispatch,
			);
		},
		[editorView, editorAnalyticsAPI, plaintextLength],
	);

	const handlePlainText = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			changeToPlainTextWithAnalytics(editorAnalyticsAPI, plaintextLength)()(
				editorView.state,
				editorView.dispatch,
			);
		},
		[editorView, editorAnalyticsAPI, plaintextLength],
	);

	const options = useMemo(() => {
		const items: MenuOption[] = [];

		if (!isPlainText) {
			items.push({
				id: 'editor.paste.richText',
				label: intl.formatMessage(messages.richText),
				selected: selectedOption === ToolbarDropdownOption.RichText,
				onClick: handleRichText,
			});
		}

		items.push({
			id: 'editor.paste.markdown',
			label: intl.formatMessage(messages.markdown),
			selected: selectedOption === ToolbarDropdownOption.Markdown,
			onClick: handleMarkdown,
		});

		items.push({
			id: 'editor.paste.plainText',
			label: intl.formatMessage(messages.plainText),
			selected: selectedOption === ToolbarDropdownOption.PlainText,
			onClick: handlePlainText,
		});

		return items;
	}, [isPlainText, selectedOption, intl, handleRichText, handleMarkdown, handlePlainText]);

	if (!showToolbar) {
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
			handleClickOutside={handleDismiss}
			handleEscapeKeydown={handleDismiss}
		>
			<PasteActionsMenuContent
				options={options}
				onMouseDown={preventEditorFocusLoss}
				onMouseEnter={handleMouseEnter}
			/>
		</PopupWithListeners>
	);
};
