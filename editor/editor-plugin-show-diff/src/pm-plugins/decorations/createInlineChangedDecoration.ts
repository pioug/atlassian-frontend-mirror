import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { DiffType, RevealOptions } from '../../showDiffPluginType';
import { CONTRIBUTOR_TAG_Z_INDEX } from '../../ui/ContributorTag/buildContributorTagDom';
import { isExtendedEnabled } from '../isExtendedEnabled';
import { isEmptyParagraphSlice } from '../utils/isEmptyParagraphSlice';

import {
	buildAtomicInlineChangedCSSVariables,
	buildDeletedInlineContentStyleExtended,
	buildDeletedInlineStyle,
	buildDeletedInlineStyleStandard,
	buildInsertStyle,
	buildInsertStyleActive,
	buildInsertStyleExtended,
	buildInsertStyleExtendedActive,
	buildInsertStyleExtendedNoUnderline,
	buildInsertStyleExtendedNoUnderlineActive,
} from './colorSchemes/factory';
import { colorSchemeRegistry, getLegacyColorScheme } from './colorSchemes/schemes';
import type { ColorScheme, DiffColorScheme } from './colorSchemes/types';
import { createInlineIndicatorAnchorWidgets } from './createAnchorDecorationWidgets';
import {
	type ContributorTagMountContext,
	createContributorTagWidget,
	isContributorTagWidgetEnabled,
} from './createContributorTagWidget';
import {
	getAtomicInlineNodeClassNameLegacy,
	resolveInlineChangedStyleLegacy,
} from './createInlineChangedDecoration.styles.legacy';
import { buildDiffDecorationSpec } from './decorationKeys';
import { REVEAL_ATTR, resolveRevealStyle } from './revealStyles';
import type { InlineAttrChangeNodeName } from './utils/getAttrChangeRanges';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});

/**
 * Stacks the change's highlight below its contributor tag, so no highlight can slice through a tag:
 * a tag overlays the line *above* its own change, and a highlight already on that line — the tail of
 * this change, or another change entirely — would otherwise paint straight over it.
 *
 * The tag still reads as attached to the change rather than laid on top of it, because it cannot
 * paint over this highlight at all: its bottom edge is pinned to the highlight's top edge and
 * clipped there. See `CONTRIBUTOR_TAG_Z_INDEX`.
 *
 * prosemirror-view places the tag's host widget as a *sibling* of this decoration's span, so
 * painting order is decided by stacking level — and the host is absolutely positioned at
 * `CONTRIBUTOR_TAG_Z_INDEX`. `position: relative` is what makes `z-index` apply to an otherwise
 * static inline box; it adds no offset.
 */
const stackBelowContributorTagStyle = convertToInlineCss({
	position: 'relative',
	zIndex: CONTRIBUTOR_TAG_Z_INDEX - 1,
});

const getColorScheme = (colorScheme: ColorScheme | undefined): DiffColorScheme =>
	colorSchemeRegistry[colorScheme ?? 'standard'];

/**
 * Class names for an atomic inline node decoration (date, emoji, mention, status). Scheme-agnostic
 * — `buildAtomicInlineChangedCSSVariables()` supplies the colour inline on the same element.
 */
const getAtomicInlineNodeClassName = (
	inlineNodeName: InlineAttrChangeNodeName | undefined,
): string => {
	const classNames = ['show-diff-atomic-inline-changed'];

	if (inlineNodeName) {
		classNames.push(`show-diff-atomic-inline-changed-${inlineNodeName}`);
	}

	return classNames.join(' ');
};

/** Inline style for inserted content under the extended diff experience. */
const getExtendedInsertStyle = (
	colors: DiffColorScheme,
	isActive: boolean,
	hideAddedDiffsUnderline: boolean,
): string => {
	if (colors.insertedInlineTreatment === 'underline') {
		// hideAddedDiffsUnderline only targets the 'borderBottom' rule, so it does not apply here.
		return isActive ? buildInsertStyleActive(colors) : buildInsertStyle(colors);
	}

	if (isActive) {
		return hideAddedDiffsUnderline
			? buildInsertStyleExtendedNoUnderlineActive(colors)
			: buildInsertStyleExtendedActive(colors);
	}

	return hideAddedDiffsUnderline
		? buildInsertStyleExtendedNoUnderline(colors)
		: buildInsertStyleExtended(colors);
};

/** Inline style for deleted content under the extended diff experience. */
const getExtendedDeletedStyle = (colors: DiffColorScheme, isActive: boolean): string => {
	if (colors.deletedInlineTreatment === 'strikethrough') {
		// Identical in both states — the block decoration carries the active emphasis.
		return buildDeletedInlineStyle(colors, false);
	}

	return (
		buildDeletedInlineStyleStandard(colors, isActive ? 'active' : 'default') +
		buildDeletedInlineContentStyleExtended(colors, isActive)
	);
};

/** Registry-driven inline `style` for a changed-content decoration. */
const resolveInlineChangedStyleRefactored = ({
	colors,
	diffType,
	hideAddedDiffsUnderline,
	isActive,
	isInserted,
}: {
	colors: DiffColorScheme;
	diffType: DiffType | undefined;
	hideAddedDiffsUnderline: boolean;
	isActive: boolean;
	isInserted: boolean;
}): string => {
	if (isExtendedEnabled(diffType)) {
		return isInserted
			? getExtendedInsertStyle(colors, isActive, hideAddedDiffsUnderline)
			: getExtendedDeletedStyle(colors, isActive);
	}

	return isActive ? buildInsertStyleActive(colors) : buildInsertStyle(colors);
};

/**
 * Single gate for the inline `style` string: registry + factory when the refactor is on, the
 * verbatim pre-refactor per-scheme constants when it is off.
 */
const resolveInlineChangedStyle = (args: {
	colors: DiffColorScheme;
	colorScheme: ColorScheme | undefined;
	diffType: DiffType | undefined;
	hideAddedDiffsUnderline: boolean;
	isActive: boolean;
	isInserted: boolean;
}): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? resolveInlineChangedStyleRefactored(args)
		: resolveInlineChangedStyleLegacy({
				...args,
				colorScheme: getLegacyColorScheme(args.colorScheme),
			});

/**
 * Single gate for the atomic-inline-node decoration attributes. The two cohorts differ in the DOM:
 * on, the colour rides on an inline CSS variable and the class list is scheme-agnostic; off, the
 * colour comes from a `-traditional` class and no variable is emitted. Returned together so the
 * class list and style suffix can never be mixed across cohorts.
 */
const resolveAtomicInlineAttrs = (
	inlineNodeName: InlineAttrChangeNodeName | undefined,
	colorScheme: ColorScheme | undefined,
	colors: DiffColorScheme,
): { className: string; styleSuffix: string } =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? {
				className: getAtomicInlineNodeClassName(inlineNodeName),
				styleSuffix: buildAtomicInlineChangedCSSVariables(colors),
			}
		: {
				className: getAtomicInlineNodeClassNameLegacy(
					inlineNodeName,
					getLegacyColorScheme(colorScheme),
				),
				styleSuffix: '',
			};

export const getAtomicInlineChangedAttrs = (
	inlineNodeName: InlineAttrChangeNodeName,
	colorScheme: ColorScheme | undefined,
): { className: string; styleSuffix: string } =>
	resolveAtomicInlineAttrs(inlineNodeName, colorScheme, getColorScheme(colorScheme));

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */

export const createInlineChangedDecoration = ({
	attributionKey,
	change,
	colorScheme,
	isActive = false,
	isInserted = true,
	isAtomicInlineNode = false,
	shouldHideDeleted = false,
	showContributorTags = false,
	showIndicators = false,
	doc,
	diffType,
	hideAddedDiffsUnderline = false,
	inlineNodeName,
	hasDeletedWidget = false,
	isDeletedWidgetBelow = false,
	reveal,
	tagMountContext,
}: {
	attributionKey?: string;
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc?: PMNode;
	hasDeletedWidget?: boolean;
	hideAddedDiffsUnderline?: boolean;
	inlineNodeName?: InlineAttrChangeNodeName;
	isActive?: boolean;
	isAtomicInlineNode?: boolean;
	isDeletedWidgetBelow?: boolean;
	isInserted?: boolean;
	reveal?: RevealOptions;
	shouldHideDeleted?: boolean;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
}): Decoration[] => {
	// Derived from the range so it survives a recalculation: stepping to the next/previous change
	// rebuilds decorations without touching the doc, and a fresh id would change the React key and the
	// tag host's key, remounting every tag mid-step. Random ids are kept when tags are off.
	const diffId = showContributorTags ? `inline-${change.fromB}-${change.toB}` : crypto.randomUUID();

	// Match the rendered shape: whitespace text is eligible, while an empty paragraph is structural
	// content with no tag host.
	const canTagChange =
		showContributorTags &&
		!!doc &&
		isExtendedEnabled(diffType) &&
		isContributorTagWidgetEnabled() &&
		!isEmptyParagraphSlice(doc.slice(change.fromB, change.toB));

	if (shouldHideDeleted) {
		return [
			Decoration.inline(
				change.fromB,
				change.toB,
				{ style: displayNoneStyle },
				buildDiffDecorationSpec({
					// No attribution: this decoration paints nothing and emits no tag host, so a tag
					// resolved from it would have nowhere to render.
					colorScheme,
					decorationType: 'inline',
					diffId,
					isActive,
					isInserted,
				}),
			),
		];
	}

	const colors = getColorScheme(colorScheme);

	// The reveal withholds the static highlight so the wipe has something to reveal, so it supplies
	// the whole style rather than adding to the usual one. Extended pipeline only — the AI review
	// surface is the only consumer, and the non-extended styles have no background to wipe.
	const revealed = isExtendedEnabled(diffType)
		? resolveRevealStyle({ colorScheme, hideAddedDiffsUnderline, isActive, isInserted, reveal })
		: undefined;

	const style =
		revealed?.style ??
		resolveInlineChangedStyle({
			colors,
			colorScheme,
			diffType,
			hideAddedDiffsUnderline,
			isActive,
			isInserted,
		});

	const isAtomicInlineInsertion = isAtomicInlineNode && isInserted;
	const atomicInlineAttrs = isAtomicInlineInsertion
		? resolveAtomicInlineAttrs(inlineNodeName, colorScheme, colors)
		: undefined;

	// Built from the raw change range, not the indicator anchors resolved below: a tag lines up with
	// the changed text, while the bar's anchors are held on a block boundary when a deleted widget
	// renders beside them.
	//
	// Built up here, ahead of where it is pushed, so the highlight's stacking below keys off whether a
	// tag exists rather than re-deriving the condition and risking disagreement.
	const tagWidget =
		canTagChange && doc
			? createContributorTagWidget({
					doc,
					from: change.fromB,
					to: change.toB,
					diffId,
					mountContext: tagMountContext,
				})
			: undefined;

	const inlineStyle = [
		style,
		atomicInlineAttrs?.styleSuffix,
		tagWidget ? stackBelowContributorTagStyle : undefined,
	]
		.filter(Boolean)
		.join('');

	const decorations = [
		Decoration.inline(
			change.fromB,
			change.toB,
			{
				style: inlineStyle,
				...(atomicInlineAttrs && {
					class: atomicInlineAttrs.className,
				}),
				...(revealed && { [REVEAL_ATTR]: revealed.role }),
				'data-testid': 'show-diff-changed-decoration',
				// Lets the contributor tag find its highlight on hover.
				...(showContributorTags && { 'data-diff-id': diffId }),
			},
			buildDiffDecorationSpec({
				attributionKey: canTagChange ? attributionKey : undefined,
				colorScheme,
				decorationType: 'inline',
				diffId,
				isActive,
				isInserted,
			}),
		),
	];

	if (showIndicators && doc && isExtendedEnabled(diffType)) {
		// For paragraphs, fromB/toB land on the outer block
		// boundary. Adjust anchor widgets into inline content so the indicator
		// bar doesn't extend into the preceding block's margin.
		// Skip when the deleted-content widget is rendered — the anchor must
		// stay at the boundary to keep the indicator continuous.
		//
		// The widget only pins the end of the range it is anchored to. It sits at `change.fromB`
		// by default, but `deletedDiffPlacement: 'bottom'` / `inlineDeletedDiffPlacement: 'after'`
		// move it to `change.toB` so the deleted content reads after the added content. In that
		// case the `from` anchor has no widget beside it any more and must be adjusted inward
		// again, otherwise the over-long indicator bar that CCI-18224 fixed comes back.
		let anchorFrom = change.fromB;
		let anchorTo = change.toB;
		if (!hasDeletedWidget || isDeletedWidgetBelow) {
			const $from = doc.resolve(anchorFrom);
			if (!$from.parent.inlineContent && $from.nodeAfter?.isTextblock) {
				anchorFrom = anchorFrom + 1;
			}
		}
		if (!hasDeletedWidget) {
			const $to = doc.resolve(anchorTo);
			if (!$to.parent.inlineContent && $to.nodeBefore?.isTextblock) {
				anchorTo = anchorTo - 1;
			}
		}
		decorations.push(
			...createInlineIndicatorAnchorWidgets({ doc, from: anchorFrom, to: anchorTo, diffId }),
		);
	}

	// Pushed after the indicator anchors so the decoration order is unchanged — see `tagWidget` above
	// for why it is built before them.
	if (tagWidget) {
		decorations.push(tagWidget);
	}

	return decorations;
};
