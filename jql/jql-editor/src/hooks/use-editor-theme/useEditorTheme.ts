import { useCallback, useMemo, useState } from 'react';

import { defaultMaxRows, expandedRows } from './index';
import type { EditorTheme } from './index';

/**
 * Hook to manage the theming state of the editor.
 */
export const useEditorTheme = ({
	isSearch = false,
	isCompact = false,
	defaultRows,
}: {
	defaultRows?: number;
	isCompact?: boolean;
	isSearch?: boolean;
}): EditorTheme => {
	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = useCallback(() => setExpanded((prevState) => !prevState), []);

	return useMemo(
		() => ({
			defaultMaxRows:
				defaultRows !== undefined && defaultRows > defaultMaxRows ? defaultRows : defaultMaxRows,
			expanded,
			expandedRows,
			toggleExpanded,
			isSearch,
			isCompact,
			defaultRows,
		}),
		[expanded, toggleExpanded, isSearch, isCompact, defaultRows],
	);
};
