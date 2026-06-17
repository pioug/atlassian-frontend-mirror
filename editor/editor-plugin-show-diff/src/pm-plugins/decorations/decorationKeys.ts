import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DiffDescriptor } from '../../showDiffPluginType';

/**
 * Decoration families produced by the show-diff plugin.
 * Each family owns its own key space and spec shape.
 */
export const DecorationFamily = {
	diff: 'diff',
	anchor: 'anchor',
} as const;

type DecorationFamilyValue = (typeof DecorationFamily)[keyof typeof DecorationFamily];

type BaseDecorationSpec<TFamily extends DecorationFamilyValue> = {
	decorationFamily: TFamily;
	key: string;
	side?: number;
};

export type DiffDecorationSpec = BaseDecorationSpec<typeof DecorationFamily.diff> & {
	decorationType: DiffDescriptor['type'];
	diffId: string;
	nodeName?: string;
};

export const AnchorTypeKey = {
	from: 'from',
	to: 'to',
	left: 'left',
	docMargin: 'doc-margin',
} as const;

type InlineAnchorType = Exclude<
	(typeof AnchorTypeKey)[keyof typeof AnchorTypeKey],
	typeof AnchorTypeKey.docMargin
>;

export type AnchorDecorationSpec =
	| (BaseDecorationSpec<typeof DecorationFamily.anchor> & {
			anchorType: typeof AnchorTypeKey.docMargin;
	  })
	| (BaseDecorationSpec<typeof DecorationFamily.anchor> & {
			anchorType: InlineAnchorType;
			diffId: string;
	  });

export type ShowDiffDecorationSpec = DiffDecorationSpec | AnchorDecorationSpec;

/**
 * The diff-decoration kinds produced by the show-diff plugin. Each value is
 * the leading segment of the generated key, so a diff decoration's kind can be
 * matched with `key?.startsWith(DiffDecorationKey.inline)` etc.
 */
export const DiffDecorationKey: Readonly<{
	block: `${typeof DecorationFamily.diff}-block`;
	inline: `${typeof DecorationFamily.diff}-inline`;
	widget: `${typeof DecorationFamily.diff}-widget`;
}> = {
	inline: `${DecorationFamily.diff}-inline`,
	block: `${DecorationFamily.diff}-block`,
	widget: `${DecorationFamily.diff}-widget`,
};

export const AnchorDocMarginKey: `${typeof DecorationFamily.anchor}-${typeof AnchorTypeKey.docMargin}` =
	`${DecorationFamily.anchor}-${AnchorTypeKey.docMargin}`;

export const buildAnchorDecorationKey = ({
	diffId,
	anchorType,
}: {
	anchorType?: InlineAnchorType;
	diffId: string;
}): string => {
	return `${DecorationFamily.anchor}-${diffId}${anchorType ? `-${anchorType}` : ''}`;
};

/**
 * Builds a diff decoration key. The extended experience includes the `diffId`
 * in the key so independently rendered decorations for the same type remain
 * distinguishable.
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
	decorationFamily: DecorationFamily.diff,
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

export function buildAnchorDecorationSpec(args: {
	anchorType: typeof AnchorTypeKey.docMargin;
	side?: number;
}): AnchorDecorationSpec;
export function buildAnchorDecorationSpec(args: {
	anchorType: InlineAnchorType;
	diffId: string;
	side?: number;
}): AnchorDecorationSpec;
export function buildAnchorDecorationSpec({
	anchorType,
	diffId,
	side,
}: {
	anchorType: (typeof AnchorTypeKey)[keyof typeof AnchorTypeKey];
	diffId?: string;
	side?: number;
}): AnchorDecorationSpec {
	if (anchorType === AnchorTypeKey.docMargin) {
		return {
			decorationFamily: DecorationFamily.anchor,
			anchorType,
			key: AnchorDocMarginKey,
			...(side !== undefined ? { side } : {}),
		};
	}

	if (!diffId) {
		throw new Error(`diffId is required for anchor type "${anchorType}"`);
	}

	return {
		decorationFamily: DecorationFamily.anchor,
		anchorType,
		diffId,
		key: buildAnchorDecorationKey({ diffId, anchorType }),
		...(side !== undefined ? { side } : {}),
	};
}

export const isDiffDecorationSpec = (spec: unknown): spec is DiffDecorationSpec =>
	Boolean(
		spec &&
			typeof spec === 'object' &&
			'decorationFamily' in spec &&
			spec.decorationFamily === DecorationFamily.diff,
	);

export const isAnchorDecorationSpec = (spec: unknown): spec is AnchorDecorationSpec =>
	Boolean(
		spec &&
			typeof spec === 'object' &&
			'decorationFamily' in spec &&
			spec.decorationFamily === DecorationFamily.anchor,
	);

export const isDiffDecoration = (
	decoration: Decoration,
): decoration is Decoration & { spec: DiffDecorationSpec } => isDiffDecorationSpec(decoration.spec);

export const extractDiffDescriptors = (decorations: DecorationSet): DiffDescriptor[] =>
	decorations
		.find(undefined, undefined, isDiffDecorationSpec)
		.filter(isDiffDecoration)
		.map(({ spec }) => {
			return {
				id: spec.diffId,
				type: spec.decorationType,
			};
		});
