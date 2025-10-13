import { type IntlShape } from 'react-intl-next';

import { getDocument } from '@atlaskit/browser-apis';
import { fullPageMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EDIT_AREA_ID } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { type ToolbarKeyboardNavigationProviderConfig } from '@atlaskit/editor-toolbar';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { getFocusableElements, isShortcutToFocusToolbar } from '../utils/toolbar';

export const getKeyboardNavigationConfig = (
	editorView: EditorView,
	intl: IntlShape,
	api?: ExtractInjectionAPI<ToolbarPlugin>,
): ToolbarKeyboardNavigationProviderConfig | undefined => {
	if (!(editorView.dom instanceof HTMLElement)) {
		return;
	}

	const toolbarSelector = "[data-testid='editor-floating-toolbar']";

	return {
		childComponentSelector: toolbarSelector,
		dom: editorView.dom,
		isShortcutToFocusToolbar: isShortcutToFocusToolbar,
		handleFocus: (event: KeyboardEvent) => {
			try {
				const toolbar = getDocument()?.querySelector(toolbarSelector);
				if (!(toolbar instanceof HTMLElement)) {
					return;
				}
				const filteredFocusableElements = getFocusableElements(toolbar);
				filteredFocusableElements[0]?.focus();

				// the button element removes the focus ring so this class adds it back
				if (filteredFocusableElements[0]?.tagName === 'BUTTON') {
					filteredFocusableElements[0].classList.add('first-floating-toolbar-button');
				}
				filteredFocusableElements[0]?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest',
				});
				event.preventDefault();
				event.stopPropagation();
			} catch (error: unknown) {
				if (error instanceof Error) {
					logException(error, { location: 'editor-plugin-toolbar/selectionToolbar' });
				}
			}
		},
		handleEscape: (event: KeyboardEvent) => {
			try {
				const isDropdownOpen = !!document.querySelector('[data-toolbar-component="menu-section"]');
				if (isDropdownOpen) {
					return;
				}
				api?.core.actions.focus();
				event.preventDefault();
				event.stopPropagation();
			} catch (error: unknown) {
				if (error instanceof Error) {
					logException(error, { location: 'editor-plugin-toolbar/selectionToolbar' });
				}
			}
		},
		ariaControls: EDIT_AREA_ID,
		ariaLabel: intl.formatMessage(fullPageMessages.toolbarLabel),
	};
};
