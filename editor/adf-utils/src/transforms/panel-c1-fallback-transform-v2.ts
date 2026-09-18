import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { traverse } from '../traverse/traverse';
import type { ADFEntity, EntityParent } from '../types';

// A Legacy Content Macro (LCM) is a Confluence macro stored as an ADF `extension`.
// Its handler renders an editable nested editor, so wrapping an extended child (table,
// expand) in an LCM keeps it visible/editable inside a plain `panel` (which permits
// `extension` children) — unlike `unsupportedBlock`, which only shows a placeholder.
// @see confluence/next/packages/experiment-legacy-content-macro
const LCM_EXTENSION_TYPE = 'com.atlassian.confluence.migration';
const LCM_EXTENSION_KEY = 'legacy-content';
const PANEL_C1_FALLBACK_MARKER = '__platformEditorPanelC1Fallback';

// Parents a wrapped child may be restored into. A plain `panel` doesn't yet allow the
// extended children, but it's the pre-promotion wrapper this transform emits: the shared
// container transform restores the child here, then promotes `panel` -> `panel_c1`.
// Restricting to panel-family parents avoids unwrapping children wrapped elsewhere.
const RESTORE_PARENT_TYPES = new Set(['panel', 'panel_c1']);

// The extended block children unlocked on `panel_c1` over successive nesting scenarios.
// Each is a plain-`panel`-incompatible child that must be LCM-wrapped when the schema
// doesn't support `panel_c1`, and restored when it does.
// - table  (platform_editor_nest_table_in_panel)
// - expand (platform_editor_nest_expand_in_panel)
const PANEL_C1_EXTENDED_CHILD_TYPES = new Set(['table', 'expand']);

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

// Type guard: true when the node is a defined extended child of panel_c1 (table, expand, ...).
// Narrows `node` to `ADFEntity` so callers can safely operate on it.
const isExtendedChild = (node: ADFEntity | undefined): node is ADFEntity =>
	!!node?.type && PANEL_C1_EXTENDED_CHILD_TYPES.has(node.type);

const wrappedNodeIsExtendedChild = (node: ADFEntity): boolean =>
	(isLcm(node) && isExtendedChild(getLcmWrappedNode(node))) ||
	(node.type === 'unsupportedBlock' && isExtendedChild(node.attrs?.originalValue));

const isPanelC1Supported = (schema: Schema): boolean => {
	if (!schema.nodes.panel_c1) {
		return false;
	}

	// The schema must also declare at least one of the extended child node types, otherwise
	// there's nothing to wrap/restore.
	return Array.from(PANEL_C1_EXTENDED_CHILD_TYPES).some((type) => !!schema.nodes[type]);
};

/**
 * Schema-driven fallback for `panel_c1` (a panel that may hold extended children such as
 * `table` or `expand`), mirroring `syncBlockFallbackTransform`. Schemas that do not declare
 * `panel_c1` cannot load documents containing it and would otherwise throw
 * `Unknown node type: panel_c1`.
 *
 * - Unsupported schema: rename `panel_c1` -> `panel` and wrap any extended child (table,
 *   expand) in an LCM `extension` (keeps it visible/editable). Falls back to
 *   `unsupportedBlock` when `extension` is unavailable; no-ops when neither escape
 *   hatch exists.
 * - Supported schema: leave `panel_c1` untouched and restore wrapped children.
 *   Restoration only fires inside a panel parent so children wrapped elsewhere are
 *   left untouched.
 *
 * Generalises the deprecated `panelC1FallbackTransform` (which handled `table` only)
 * to every `panel_c1` extended child. Callers must gate its use behind the
 * `platform_editor_nest_expand_in_panel` experiment so the already-in-production
 * table-in-panel path keeps using the deprecated transform until this is rolled out.
 */
export const panelC1FallbackTransformV2 = (
	schema: Schema,
	adf: ADFEntity,
): {
	isTransformed: boolean;
	transformedAdf: false | ADFEntity;
} => {
	let isTransformed = false;

	const { extension, unsupportedBlock } = schema.nodes;
	const panelC1Supported = isPanelC1Supported(schema);
	const shouldDowngrade = !panelC1Supported;
	const shouldRestore = panelC1Supported;

	const hasRelevantNode = (node: ADFEntity): boolean =>
		(shouldDowngrade && node.type === 'panel_c1') ||
		(shouldRestore && wrappedNodeIsExtendedChild(node)) ||
		(Array.isArray(node.content) && node.content.some((c) => !!c && hasRelevantNode(c)));

	if (!hasRelevantNode(adf)) {
		return { isTransformed, transformedAdf: adf };
	}

	// Prefer the LCM (visible/editable); fall back to a preserved-but-hidden unsupportedBlock.
	const wrapChild = (childNode: ADFEntity): ADFEntity =>
		extension
			? wrapAsLcm(childNode)
			: (unsupportedBlock.createChecked({ originalValue: childNode }).toJSON() as ADFEntity);

	const downgradePanel = (node: ADFEntity): ADFEntity => {
		if (!Array.isArray(node.content)) {
			return node;
		}
		const hasExtendedChild = node.content.some((child) => isExtendedChild(child));
		if (hasExtendedChild && !extension && !unsupportedBlock) {
			return node;
		}
		const content = node.content.map((child) => {
			if (isExtendedChild(child)) {
				isTransformed = true;
				return wrapChild(child);
			}
			return child;
		});
		isTransformed = true;
		return { ...node, type: 'panel', content };
	};

	const restoreWrappedChild = (node: ADFEntity, parent: EntityParent): ADFEntity => {
		if (!RESTORE_PARENT_TYPES.has(parent?.node?.type ?? '')) {
			return node;
		}

		const restored = isLcm(node)
			? getLcmWrappedNode(node)
			: (node.attrs?.originalValue as ADFEntity | undefined);

		if (isExtendedChild(restored)) {
			isTransformed = true;
			return restored;
		}
		return node;
	};

	const transformedAdf = traverse(adf, {
		// Unsupported schema: downgrade to a plain `panel`, wrapping extended children.
		panel_c1: (node) => (shouldDowngrade ? downgradePanel(node) : node),
		// Supported schema: restore children wrapped as an LCM / unsupportedBlock.
		extension: (node, parent) => (shouldRestore ? restoreWrappedChild(node, parent) : node),
		unsupportedBlock: (node, parent) => (shouldRestore ? restoreWrappedChild(node, parent) : node),
	});

	return { transformedAdf, isTransformed };
};
