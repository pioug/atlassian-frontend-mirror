import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { hasTableColumnBeenResized } from './hasTableColumnBeenResized';

/**
 * Returns true if the table has been explicitly resized — either the table itself has a width
 * attribute set, or any column has been individually resized (colwidth present on cells).
 */
export const hasTableBeenResized = (tableNode: PMNode): boolean =>
	tableNode.attrs.width !== null || hasTableColumnBeenResized(tableNode);

/**
 * Determines whether a table should render in content mode.
 *
 * Content mode tables have no fixed column widths — the browser sizes columns to fit their
 * content (`table-layout: auto`). This is the shared core predicate used by both the editor
 * and the renderer. Each consumer is responsible for computing `isSupported` from its own
 * feature flags / props before calling this function.
 *
 * A table is in content mode when ALL of the following are true:
 * 1. The `platform_editor_table_fit_to_content_auto_convert` experiment is enabled
 * 2. `isSupported` is true (caller has verified resizing is allowed and appearance is full-page)
 * 3. The table is not nested inside another table or block node
 * 4. The table node exists
 * 5. The table has not been explicitly resized (`width === null` and no `colwidth` on cells)
 * 6. The table's layout is `'align-start'`
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isTableInContentMode = ({
	tableNode,
	isSupported,
	isTableNested,
}: {
	/** Whether the current environment supports content mode (resizing enabled, full-page appearance). */
	isSupported: boolean;
	isTableNested?: boolean;
	tableNode: PMNode | undefined;
}): boolean => {
	if (
		!expValEqualsNoExposure('platform_editor_table_fit_to_content_auto_convert', 'isEnabled', true)
	) {
		return false;
	}

	if (!tableNode || isTableNested) {
		return false;
	}

	return isSupported && !hasTableBeenResized(tableNode) && tableNode.attrs.layout === 'align-start';
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { hasTableColumnBeenResized } from './hasTableColumnBeenResized';
