import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { RendererAppearance } from '../../../ui/Renderer/types';

/**
 * Checks whether any cell in the first row of the table has a colwidth attribute set.
 *
 * This mirrors `hasTableColumnBeenResized` from editor-plugin-table's `colgroup.ts`.
 */
export const hasColWidths = (tableNode: PMNode): boolean => {
	const firstRow = tableNode.content.firstChild;
	if (!firstRow) {
		return false;
	}
	for (let i = 0; i < firstRow.childCount; i++) {
		if (firstRow.child(i).attrs.colwidth) {
			return true;
		}
	}
	return false;
};

type ContentModeOptions = {
	allowTableResizing?: boolean;
	isTableNested?: boolean;
	rendererAppearance?: RendererAppearance;
	tableNode: PMNode | undefined;
};

/**
 * Mirrors `isContentModeSupported()` from editor-plugin-table's `tableMode.ts`.
 *
 * In the editor this checks `allowColumnResizing && allowTableResizing && isFullPageEditor`.
 * In the renderer there is no separate `allowColumnResizing` flag — `allowTableResizing`
 * covers both — and `isFullPageEditor` maps to `rendererAppearance === 'full-page'`.
 */
const isContentModeSupported = ({
	allowTableResizing,
	rendererAppearance,
}: Pick<ContentModeOptions, 'allowTableResizing' | 'rendererAppearance'>): boolean => {
	return (
		!!allowTableResizing &&
		(rendererAppearance === 'full-page' ||
			rendererAppearance === 'full-width' ||
			rendererAppearance === 'max')
	);
};

/**
 * Determines whether a table should render in content mode.
 *
 * Content mode tables have no fixed column widths — the browser sizes columns to fit their
 * content (table-layout: auto). A table is in content mode when:
 *
 * 1. The feature is supported (table resizing enabled, full-page appearance)
 * 2. The table is at the top level of the document (not nested in another table or block node)
 * 3. The table node exists
 * 4. `table.attrs.width` is null (no explicit width set by the user)
 * 5. No cells in the first row have `colwidth` set (table has not been column-resized)
 * 6. The `platform_editor_table_fit_to_content_auto_convert` experiment is enabled
 *
 * This mirrors `isTableInContentMode()` from editor-plugin-table's `tableMode.ts`.
 *
 * SSR-safe: `expValEquals` returns false on the server (FeatureGates not initialised),
 * so content mode is never active during SSR — no hydration mismatch.
 */
export const isTableInContentMode = ({
	tableNode,
	allowTableResizing,
	rendererAppearance,
	isTableNested,
}: ContentModeOptions): boolean => {
	if (
		!expValEqualsNoExposure('platform_editor_table_fit_to_content_auto_convert', 'isEnabled', true)
	) {
		return false;
	}

	if (!tableNode) {
		return false;
	}

	return (
		!isTableNested &&
		isContentModeSupported({ allowTableResizing, rendererAppearance }) &&
		tableNode.attrs.width === null &&
		!hasColWidths(tableNode) &&
		tableNode.attrs.layout === 'align-start'
	);
};
