import { createContext } from 'react';
import type { Context } from 'react';

import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

import type { INPUT_METHOD } from '../analytics';
import type { InsertContentCallback } from '../insert';
export type QuickInsertSelectionHandler = (context: {
	insert: InsertContentCallback;
	source:
		| INPUT_METHOD.ELEMENT_BROWSER
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.TOOLBAR;
}) => Transaction | false | void;

export type QuickInsertContextValue = {
	editorView: EditorView;
	isOffline: boolean;
	item?: {
		description?: string;
		id: string;
		isPreviewActive?: boolean;
		isSelected: boolean;
	};
	popupsMountPoint?: HTMLElement;
	select: (selectionHandler: QuickInsertSelectionHandler) => void;
	surfaceContext?: SurfaceContext;
};

/**
 * Gives Quick Insert items access to the editor and the function for selecting a command.
 * The menu supplies shared values; each item adds its selected and preview state.
 */
export const QuickInsertContext: Context<QuickInsertContextValue | null> =
	createContext<QuickInsertContextValue | null>(null);
