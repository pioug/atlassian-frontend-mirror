import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { ContributorTagModel, DiffDescriptor, TagContributor } from '../../showDiffPluginType';

import type {
	ResolvedDiffContributor,
	ResolvedDiffContributors,
} from './colorSchemes/attributions';
import { type DiffDecorationSpec, isDiffDecoration, isDiffDecorationSpec } from './decorationKeys';

/**
 * Diff kinds that expose an anchor a tag can be pinned to: `inline` is added/changed content,
 * `widget` is deleted content, `block` a whole changed block node.
 */
const TAGGABLE_DECORATION_TYPES: ReadonlySet<DiffDescriptor['type']> = new Set([
	'block',
	'inline',
	'widget',
]);

/** The connection is an internal key, so it is dropped on the way to the tag. */
const toTagContributor = ({
	connectedToKey: _connectedToKey,
	...tagContributor
}: ResolvedDiffContributor): TagContributor => tagContributor;

type TaggableDecoration = Decoration & { spec: DiffDecorationSpec };

type TagTarget = {
	contributor: ResolvedDiffContributor;
	decoration: TaggableDecoration;
};

/**
 * Whether a deleted-content widget belongs to the same change as an inline decoration. A replacement
 * renders both — the inserted text inline, the deleted text as a widget anchored to one end of that
 * inline range — and the two must not each claim a tag.
 */
const isSameChange = (widget: TaggableDecoration, inline: TaggableDecoration): boolean =>
	widget.spec.attributionKey === inline.spec.attributionKey &&
	widget.from >= inline.from &&
	widget.from <= inline.to;

/**
 * Whether a deleted-content widget is the left-most half of the replacement it belongs to, in which
 * case it keeps the tag so the tag marks where the change begins (EDITOR-8855). `side: -1` paints
 * the deleted content in front of the inserted text; `1` is `deletedDiffPlacement: 'bottom'` /
 * `inlineDeletedDiffPlacement: 'after'`, where the inline half leads instead.
 */
const leadsReplacement = (widget: TaggableDecoration): boolean =>
	fg('confluence_ncs_step_diffing_version_history') && widget.spec.side === -1;

/**
 * Whether `inner` captions the same change as the block decoration `block`, in which case only the
 * block keeps the tag — one tag per block. Containment counts in either direction: a leaf block's
 * highlight spans the wrapper the block sits in. Merely adjacent ranges keep a tag each.
 */
const isSameBlockChange = (inner: TaggableDecoration, block: TaggableDecoration): boolean =>
	inner.spec.attributionKey === block.spec.attributionKey &&
	((block.from <= inner.from && inner.to <= block.to) ||
		(inner.from <= block.from && block.to <= inner.to));

/**
 * Which of two changes in the same range leads, and so is the one a tag captions. Position first,
 * then `side`, since deleted content shares its `from` with the content that replaced it and paints
 * above; then the narrower range, so a change nested in another captions itself.
 */
const byLeadingPosition = (a: TagTarget, b: TagTarget): number =>
	a.decoration.from - b.decoration.from ||
	(a.decoration.spec.side ?? 0) - (b.decoration.spec.side ?? 0) ||
	a.decoration.to - a.decoration.from - (b.decoration.to - b.decoration.from);

/** The targets a navigation range wholly covers, leader first. */
const containedBy = (
	targets: TagTarget[],
	{ from, to }: { from: number; to: number },
): TagTarget[] =>
	targets
		.filter(({ decoration }) => from <= decoration.from && decoration.to <= to)
		.sort(byLeadingPosition);

/**
 * The one tag a navigation step reveals. `spec.isActive` is no use here: it covers everything the
 * group's union range touches, so several tags revealed over each other (EDITOR-8971). Hence
 * containment, and the leading change of what it covers.
 */
const resolveActiveTarget = (
	surviving: TagTarget[],
	activeIndexPos: { from: number; to: number },
): TagTarget | undefined => containedBy(surviving, activeIndexPos)[0];

/**
 * One model per diff decoration whose attribution resolves to a supplied contributor; anything
 * unattributed, untaggable or unresolved is skipped. A replacement's two decorations are collapsed
 * into a single tag, on whichever half renders first — see `isSameChange` and `leadsReplacement`.
 *
 * `activeIndexPos`, when given, reveals exactly one of the tags — see `resolveActiveTarget`.
 * Absent, each tag keeps the active state its own decoration was drawn with.
 *
 * `stops`, when given, is the navigation stop list the step buttons walk
 * (`getScrollableDecorations`). One contributor cannot hold two tags in one stop, since only the
 * leading one would ever be reachable. Absent, every decoration keeps its own tag.
 */
export const extractContributorTags = (
	decorations: DecorationSet,
	contributors: ResolvedDiffContributors | undefined,
	activeIndexPos?: { from: number; to: number },
	stops?: ReadonlyArray<{ from: number; to: number }>,
): ContributorTagModel[] => {
	if (!contributors) {
		return [];
	}

	const targets: TagTarget[] = [];

	for (const decoration of decorations.find(undefined, undefined, isDiffDecorationSpec)) {
		if (!isDiffDecoration(decoration)) {
			continue;
		}

		const { spec } = decoration;
		if (!spec.attributionKey || !TAGGABLE_DECORATION_TYPES.has(spec.decorationType)) {
			continue;
		}

		const contributor = contributors[spec.attributionKey];
		if (!contributor) {
			continue;
		}

		targets.push({ contributor, decoration });
	}

	// Candidate hosts, in the order they outrank each other: block, then leading widget, then inline.
	const inlineTargets = targets.filter(
		({ decoration }) => decoration.spec.decorationType === 'inline',
	);
	const blockTargets = targets.filter(
		({ decoration }) => decoration.spec.decorationType === 'block',
	);
	const widgetTargets = targets.filter(
		({ decoration }) => decoration.spec.decorationType === 'widget',
	);
	const linkedDiffIds = new Map<string, string[]>();
	const folded = new Set<TagTarget>();

	const fold = (host: TagTarget, target: TagTarget): void => {
		folded.add(target);
		const hostDiffId = host.decoration.spec.diffId;
		const targetDiffId = target.decoration.spec.diffId;
		// A target that already hosts folded tags hands them up, so no hover target is orphaned when
		// one host folds into another.
		const inherited = linkedDiffIds.get(targetDiffId) ?? [];
		linkedDiffIds.delete(targetDiffId);
		linkedDiffIds.set(hostDiffId, [
			...(linkedDiffIds.get(hostDiffId) ?? []),
			targetDiffId,
			...inherited,
		]);
	};

	for (const target of targets) {
		const { decorationType } = target.decoration.spec;
		if (decorationType === 'block') {
			continue;
		}

		// A block outranks both other kinds, so it is tried first.
		const block = blockTargets.find(({ decoration }) =>
			isSameBlockChange(target.decoration, decoration),
		);
		if (block) {
			fold(block, target);
			continue;
		}

		if (decorationType === 'inline') {
			// The deleted half renders in front of this one, so that half captions the change.
			const leadingWidget = widgetTargets.find(
				({ decoration }) =>
					leadsReplacement(decoration) && isSameChange(decoration, target.decoration),
			);
			if (leadingWidget) {
				fold(leadingWidget, target);
			}
			continue;
		}

		// A leading widget keeps its own tag; it was folded into above.
		if (leadsReplacement(target.decoration)) {
			continue;
		}

		const host = inlineTargets.find(({ decoration }) =>
			isSameChange(target.decoration, decoration),
		);
		if (host) {
			fold(host, target);
		}
	}

	// One tag per contributor per navigation stop. The folds above only catch a replacement's two
	// halves and a block's own highlights; two of one contributor's changes that merely touch are a
	// single stop (`groupTouchingDecorations`) yet kept a tag each, so the stop's trailing tag was
	// drawn but could never be stepped to (EDITOR-8971). It folds into the leading tag of its
	// contributor, staying a hover target. Contributors are kept apart: a stop spanning two of them
	// still captions each, rather than crediting one for the other's change.
	for (const stop of stops ?? []) {
		const byContributor = new Map<string, TagTarget[]>();
		for (const target of containedBy(
			targets.filter((target) => !folded.has(target)),
			stop,
		)) {
			const key = target.decoration.spec.attributionKey ?? '';
			byContributor.set(key, [...(byContributor.get(key) ?? []), target]);
		}

		for (const [leader, ...trailing] of byContributor.values()) {
			trailing.forEach((target) => fold(leader, target));
		}
	}

	const surviving = targets.filter((target) => !folded.has(target));
	const activeTarget =
		activeIndexPos === undefined ? undefined : resolveActiveTarget(surviving, activeIndexPos);

	return surviving.map((target) => {
		const {
			contributor,
			decoration: { spec },
		} = target;
		const connected = contributor.connectedToKey
			? contributors[contributor.connectedToKey]
			: undefined;
		const connectedContributor = connected ? toTagContributor(connected) : undefined;
		const linked = linkedDiffIds.get(spec.diffId);
		// Only the navigated tag reveals; with no active range, the decoration's own state stands.
		const isActive = activeIndexPos === undefined ? spec.isActive : target === activeTarget;

		return {
			contributor: toTagContributor(contributor),
			diffId: spec.diffId,
			...(connectedContributor ? { connectedContributor } : {}),
			...(spec.colorScheme ? { colorScheme: spec.colorScheme } : {}),
			...(isActive !== undefined ? { isActive } : {}),
			...(spec.isInserted !== undefined ? { isInserted: spec.isInserted } : {}),
			...(linked ? { linkedDiffIds: linked } : {}),
		};
	});
};
