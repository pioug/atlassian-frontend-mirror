import { createContext, type Context } from 'react';

import noop from 'lodash/noop';

export type EditorTheme = {
	/**
	 * The maximum number of rows that are visible in the default editor view.
	 */
	defaultMaxRows: number;
	/**
	 * The number of initial rows that are visible.
	 */
	defaultRows?: number;
	/**
	 * `true` if the editor view is in the expanded state.
	 */
	expanded: boolean;
	/**
	 * The number of rows that are visible when the editor view is expanded.
	 */
	expandedRows: number;
	/**
	 * `false` matches AK's default field styling
	 * `true` matches AK's compact field styling, generally used for search purposes.
	 */
	isCompact: boolean;
	/**
	 * `true` shows search button, other search related elements
	 * `false` to act as a text field
	 */
	isSearch: boolean;
	/**
	 * Toggle the editor view expanded state.
	 */
	toggleExpanded: () => void;
};

export const defaultMaxRows: any = 3;

export const expandedRows: any = 15;

const defaultEditorTheme: EditorTheme = {
	defaultMaxRows,
	expanded: false,
	expandedRows,
	toggleExpanded: noop,
	isSearch: false,
	isCompact: false,
};

export const EditorThemeContext: Context<EditorTheme> =
	createContext<EditorTheme>(defaultEditorTheme);
