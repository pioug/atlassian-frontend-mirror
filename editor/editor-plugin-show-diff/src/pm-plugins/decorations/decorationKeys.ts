import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { DiffDescriptor } from '../../showDiffPluginType';
import type { ColorScheme } from './colorSchemes/types';

/**
 * Decoration families produced by the show-diff plugin.
 * Each family owns its own key space and spec shape.
 */
export const DecorationFamily = {
	diff: 'diff',
	anchor: 'anchor',
	contributorTag: 'contributor-tag',
} as const;

/**
 * Navigation measures the target table header and writes this variable on the
 * editor root immediately before scrolling. Diff decorations inherit it, so
 * native scrolling leaves room for the header without DOM mutation on the
 * ProseMirror-rendered suggestion.
 */
export const SCROLL_TARGET_MARGIN_CSS_PROPERTY = '--ak-editor-diff-additional-margin';
export const scrollMarginTopValue: string = `calc(${token(
	'space.400',
)} + var(${SCROLL_TARGET_MARGIN_CSS_PROPERTY}, 0px))`;
export const scrollMarginTopStyle: string = `scroll-margin-top: ${scrollMarginTopValue};`;

type DecorationFamilyValue = (typeof DecorationFamily)[keyof typeof DecorationFamily];

type BaseDecorationSpec<TFamily extends DecorationFamilyValue> = {
	decorationFamily: TFamily;
	key: string;
	side?: number;
};

export type DiffDecorationSpec = BaseDecorationSpec<typeof DecorationFamily.diff> & {
	attributionKey?: string;
	colorScheme?: ColorScheme;
	decorationType: DiffDescriptor['type'];
	diffId: string;
	/**
	 * The change currently stepped to. Needed on the spec because `activeIndex` indexes the filtered,
	 * re-sorted scrollable decorations, not `diffDescriptors`.
	 */
	isActive?: boolean;
	/**
	 * Carried rather than derived from `decorationType`, because an inverted diff swaps which side is
	 * the inserted one.
	 */
	isInserted?: boolean;
	leftAnchorId?: string;
	nodeName?: string;
	/**
	 * The decoration to scroll to, when it is not the one carrying this spec: the member of a merged
	 * navigation group that paints first. Deleted content is a widget shown above the added content
	 * it replaces, and only that widget's own DOM can be scrolled to — resolving the group's `from`
	 * position lands on the added content painted after it. Set by `getScrollableDecorations`,
	 * consumed by `scrollToDiff`; never present on a decoration in the plugin's `DecorationSet`.
	 */
	scrollTarget?: Decoration;
};

export const AnchorTypeKey = {
	from: 'from',
	to: 'to',
	left: 'left',
	docMargin: 'doc-margin',
	/** The decorated block itself, which its contributor tag positions against. */
	tag: 'tag',
} as const;

export type InlineAnchorType = Exclude<
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

/**
 * The host widget one contributor tag renders into. Its own family, so the tag never reaches the
 * consumers that read diff decorations — change counting, navigation and `getDeletedWidgets`.
 */
export type ContributorTagDecorationSpec = BaseDecorationSpec<
	typeof DecorationFamily.contributorTag
> & {
	diffId: string;
};

export type ShowDiffDecorationSpec =
	| DiffDecorationSpec
	| AnchorDecorationSpec
	| ContributorTagDecorationSpec;

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

export const AnchorDocMarginKey: `${typeof DecorationFamily.anchor}-${typeof AnchorTypeKey.docMargin}` = `${DecorationFamily.anchor}-${AnchorTypeKey.docMargin}`;

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
 * Builds a diff decoration key. The key includes the `diffId` so independently
 * rendered decorations for the same type remain distinguishable.
 */
export const buildDiffDecorationKey = ({
	decorationKeyPrefix,
	isActive,
	diffId,
}: {
	decorationKeyPrefix: (typeof DiffDecorationKey)[DiffDescriptor['type']];
	diffId?: string;
	isActive?: boolean;
}): string => `${decorationKeyPrefix}-${diffId}-${isActive ? 'active' : 'inactive'}`;

export const buildDiffDecorationSpec = ({
	attributionKey,
	colorScheme,
	decorationType,
	diffId,
	isActive,
	isInserted,
	leftAnchorId,
	nodeName,
	side,
}: {
	attributionKey?: string;
	colorScheme?: ColorScheme;
	decorationType: DiffDescriptor['type'];
	diffId: string;
	isActive?: boolean;
	isInserted?: boolean;
	leftAnchorId?: string;
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
	...(attributionKey ? { attributionKey } : {}),
	// Active state is only needed by contributor tags, so keep it alongside an attribution key.
	...(attributionKey && isActive !== undefined ? { isActive } : {}),
	...(isInserted !== undefined ? { isInserted } : {}),
	...(leftAnchorId ? { leftAnchorId } : {}),
	...(colorScheme ? { colorScheme } : {}),
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

export const buildContributorTagDecorationSpec = (
	diffId: string,
): ContributorTagDecorationSpec => ({
	decorationFamily: DecorationFamily.contributorTag,
	diffId,
	// Stable across recalculations, so ProseMirror keeps the host element the tag is portalled into.
	key: `${DecorationFamily.contributorTag}-${diffId}`,
});

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
				...(spec.colorScheme ? { colorScheme: spec.colorScheme } : {}),
				id: spec.diffId,
				...(spec.leftAnchorId ? { leftAnchorId: spec.leftAnchorId } : {}),
				...(spec.isInserted !== undefined ? { isInserted: spec.isInserted } : {}),
				type: spec.decorationType,
			};
		});
