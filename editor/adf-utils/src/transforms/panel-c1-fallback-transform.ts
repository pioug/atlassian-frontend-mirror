import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { traverse } from '../traverse/traverse';
import type { ADFEntity, EntityParent } from '../types';

// A Legacy Content Macro (LCM) is a Confluence macro stored as an ADF `extension`.
// Its handler renders an editable nested editor, so wrapping a table in an LCM keeps
// it visible/editable inside a plain `panel` (which permits `extension` children) —
// unlike `unsupportedBlock`, which only shows a placeholder.
// @see confluence/next/packages/experiment-legacy-content-macro
const LCM_EXTENSION_TYPE = 'com.atlassian.confluence.migration';
const LCM_EXTENSION_KEY = 'legacy-content';
const PANEL_C1_FALLBACK_MARKER = '__platformEditorPanelC1Fallback';

// Parents a wrapped table may be restored into. A plain `panel` doesn't yet allow a
// `table`, but it's the pre-promotion wrapper this transform emits: the shared
// container transform restores the table here, then promotes `panel` -> `panel_c1`.
// Restricting to panel-family parents avoids unwrapping tables wrapped elsewhere.
const TABLE_RESTORE_PARENT_TYPES = new Set(['panel', 'panel_c1']);

const safeParseAdf = (adf: unknown): ADFEntity | undefined => {
	if (typeof adf !== 'string') {
		return undefined;
	}
	try {
		return JSON.parse(adf) as ADFEntity;
	} catch {
		return undefined;
	}
};

const wrapAsLcm = (node: ADFEntity): ADFEntity => {
	const nestedContent: ADFEntity = { version: 1, type: 'doc', content: [node] };
	return {
		type: 'extension',
		attrs: {
			extensionType: LCM_EXTENSION_TYPE,
			extensionKey: LCM_EXTENSION_KEY,
			layout: 'default',
			parameters: {
				nestedContent,
				adf: JSON.stringify(nestedContent),
				[PANEL_C1_FALLBACK_MARKER]: true,
			},
		},
	};
};

const isLcm = (node: ADFEntity): boolean =>
	node.type === 'extension' &&
	node.attrs?.extensionType === LCM_EXTENSION_TYPE &&
	node.attrs?.extensionKey === LCM_EXTENSION_KEY &&
	node.attrs?.parameters?.[PANEL_C1_FALLBACK_MARKER] === true;

/** Single wrapped block from an LCM, preferring `nestedContent` then parsed `adf`. */
const getLcmWrappedNode = (node: ADFEntity): ADFEntity | undefined => {
	const params = node.attrs?.parameters;
	const nested = params?.nestedContent ?? safeParseAdf(params?.adf);
	return nested?.content?.length === 1 ? (nested.content[0] as ADFEntity) : undefined;
};

const wrappedNodeIsTable = (node: ADFEntity): boolean =>
	(isLcm(node) && getLcmWrappedNode(node)?.type === 'table') ||
	(node.type === 'unsupportedBlock' && node.attrs?.originalValue?.type === 'table');

const isTableInPanelSupported = (schema: Schema): boolean => {
	const { table, panel_c1: panelC1 } = schema.nodes;

	if (!table || !panelC1) {
		return false;
	}

	return expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true);
};

/**
 * Schema-driven fallback for `panel_c1` (a panel that may hold a table), mirroring
 * `syncBlockFallbackTransform`. `panel_c1` only exists when the
 * `platform_editor_nest_table_in_panel` experiment is on; without it, loading a
 * document containing `panel_c1` would throw `Unknown node type: panel_c1`.
 *
 * - Experiment off: rename `panel_c1` -> `panel` and wrap any `table` child in an LCM
 *   `extension` (keeps it visible/editable). Falls back to `unsupportedBlock` when
 *   `extension` is unavailable; no-ops when neither escape hatch exists.
 * - Experiment on: leave `panel_c1` untouched and restore wrapped tables. Restoration
 *   only fires inside a panel parent so tables wrapped elsewhere are left untouched.
 */
export const panelC1FallbackTransform = (
	schema: Schema,
	adf: ADFEntity,
): {
	isTransformed: boolean;
	transformedAdf: false | ADFEntity;
} => {
	let isTransformed = false;

	const { extension, unsupportedBlock } = schema.nodes;
	const tableInPanelSupported = isTableInPanelSupported(schema);
	const shouldDowngrade = !tableInPanelSupported;
	const shouldRestore = tableInPanelSupported;

	const hasRelevantNode = (node: ADFEntity): boolean =>
		(shouldDowngrade && node.type === 'panel_c1') ||
		(shouldRestore && wrappedNodeIsTable(node)) ||
		(Array.isArray(node.content) && node.content.some((c) => !!c && hasRelevantNode(c)));

	if (!hasRelevantNode(adf)) {
		return { isTransformed, transformedAdf: adf };
	}

	// Prefer the LCM (visible/editable); fall back to a preserved-but-hidden unsupportedBlock.
	const wrapTable = (tableNode: ADFEntity): ADFEntity =>
		extension
			? wrapAsLcm(tableNode)
			: (unsupportedBlock.createChecked({ originalValue: tableNode }).toJSON() as ADFEntity);

	const downgradePanel = (node: ADFEntity): ADFEntity => {
		if (!Array.isArray(node.content)) {
			return node;
		}
		const hasTableChild = node.content.some((child) => child?.type === 'table');
		if (hasTableChild && !extension && !unsupportedBlock) {
			return node;
		}
		const content = node.content.map((child) => {
			if (child?.type === 'table') {
				isTransformed = true;
				return wrapTable(child);
			}
			return child;
		});
		isTransformed = true;
		return { ...node, type: 'panel', content };
	};

	const restoreWrappedTable = (node: ADFEntity, parent: EntityParent): ADFEntity => {
		if (!TABLE_RESTORE_PARENT_TYPES.has(parent?.node?.type ?? '')) {
			return node;
		}

		const restored = isLcm(node)
			? getLcmWrappedNode(node)
			: (node.attrs?.originalValue as ADFEntity | undefined);

		if (restored?.type === 'table') {
			isTransformed = true;
			return restored;
		}
		return node;
	};

	const transformedAdf = traverse(adf, {
		// Experiment off: downgrade to a plain `panel`, wrapping table children.
		panel_c1: (node) => (shouldDowngrade ? downgradePanel(node) : node),
		// Experiment on: restore tables wrapped as an LCM / unsupportedBlock.
		extension: (node, parent) => (shouldRestore ? restoreWrappedTable(node, parent) : node),
		unsupportedBlock: (node, parent) => (shouldRestore ? restoreWrappedTable(node, parent) : node),
	});

	return { transformedAdf, isTransformed };
};
