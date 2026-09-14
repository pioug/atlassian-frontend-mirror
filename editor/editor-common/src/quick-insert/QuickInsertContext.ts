import { createContext } from 'react';
import type { Context } from 'react';

import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

import type { INPUT_METHOD } from '../analytics';
import type { TypeAheadInsert } from '../types';

export type QuickInsertSelectionHandler = (context: {
	insert: TypeAheadInsert;
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
		isSelected: boolean;
	};
	menuOpenId?: symbol;
	select: (selectionHandler: QuickInsertSelectionHandler) => void;
	surface: 'typeahead' | 'toolbar' | 'element-browser';
	surfaceContext?: SurfaceContext;
};

export const QuickInsertContext: Context<QuickInsertContextValue | null> =
	createContext<QuickInsertContextValue | null>(null);
