import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DiffDescriptor } from '../../showDiffPluginType';

/**
 * Shared prefix for every decoration key produced by the show-diff plugin.
 * All keys derive from this, so the full set of plugin decorations can be
 * identified by this single prefix.
 */
const DIFF_DECORATION_FAMILY = 'diff' as const;

export type DiffDecorationSpec = {
	decorationFamily: typeof DIFF_DECORATION_FAMILY;
	decorationType: DiffDescriptor['type'];
	diffId: string;
	key: string;
	nodeName?: string;
	side?: number;
};

/**
 * The kinds of decoration the show-diff plugin produces. Each value is the
 * leading segment of the generated key, so a decoration's kind can be matched
 * with `key?.startsWith(DiffDecorationKey.inline)` etc.
 */
export const DiffDecorationKey: Readonly<{
	block: `${typeof DIFF_DECORATION_FAMILY}-block`;
	inline: `${typeof DIFF_DECORATION_FAMILY}-inline`;
	widget: `${typeof DIFF_DECORATION_FAMILY}-widget`;
}> = {
	inline: `${DIFF_DECORATION_FAMILY}-inline`,
	block: `${DIFF_DECORATION_FAMILY}-block`,
	widget: `${DIFF_DECORATION_FAMILY}-widget`,
};

/**
 * Builds a decoration key in the form `{type}-{active|inactive}`
 * (e.g. `diff-inline-active`).
 */
export const buildDiffDecorationKey = ({
	decorationKeyPrefix,
	isActive,
	diffId,
}: {
	decorationKeyPrefix: (typeof DiffDecorationKey)[DiffDescriptor['type']];
	diffId?: string;
	isActive?: boolean;
}): string => {
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		return `${decorationKeyPrefix}-${diffId}-${isActive ? 'active' : 'inactive'}`;
	}
	return isActive !== undefined
		? `${decorationKeyPrefix}-${isActive ? 'active' : 'inactive'}`
		: decorationKeyPrefix;
};

export const buildDiffDecorationSpec = ({
	decorationType,
	diffId,
	isActive,
	nodeName,
	side,
}: {
	decorationType: DiffDescriptor['type'];
	diffId: string;
	isActive?: boolean;
	nodeName?: string;
	side?: number;
}): DiffDecorationSpec => ({
	decorationFamily: DIFF_DECORATION_FAMILY,
	decorationType,
	diffId,
	key: buildDiffDecorationKey({
		decorationKeyPrefix: DiffDecorationKey[decorationType],
		diffId,
		isActive,
	}),
	...(nodeName ? { nodeName } : {}),
	...(side !== undefined ? { side } : {}),
});

export const extractDiffDescriptors = (decorations: DecorationSet): DiffDescriptor[] =>
	decorations
		.find(undefined, undefined, (spec) => spec.decorationFamily === 'diff')
		.map(({ spec }: { spec: DiffDecorationSpec }) => {
			return {
				id: spec.diffId,
				type: spec.decorationType,
			};
		});
