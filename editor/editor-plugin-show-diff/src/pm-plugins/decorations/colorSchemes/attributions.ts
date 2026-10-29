import type { Change } from 'prosemirror-changeset';

import { getThirdPartyAgentColor } from '@atlaskit/agent-color/get-third-party-agent-color';
import { getParticipantColor } from '@atlaskit/editor-shared-styles/utils';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	DIFF_AGENT_BRANDS,
	type DiffAgentBrand,
	type DiffContributors,
	type DiffStepAttribution,
	type TagContributor,
} from '../../../showDiffPluginType';
import { PARTICIPANT_COLOR_SCHEMES, type AdsAccentColor, type ColorScheme } from './types';

export type DiffAttributionSpanData = DiffStepAttribution & {
	stepIndex: number;
};

type AttributionIdentity = {
	colorSeed: string;
	key: string;
};

/** A contributor with both of its identities collapsed to internal attribution keys. */
export type ResolvedDiffContributor = TagContributor & {
	connectedToKey?: string;
};

/** Contributors addressed by attribution key. The key format is internal. */
export type ResolvedDiffContributors = Record<string, ResolvedDiffContributor>;

/** Maps the shared 18-slot telepointer palette onto the ten bolder diff colours. */
const HASHED_PARTICIPANT_COLOR_SCHEMES = [
	...PARTICIPANT_COLOR_SCHEMES,
	'blue',
	'red',
	'orange',
	'yellow',
	'green',
	'teal',
	'purple',
	'magenta',
] as const satisfies readonly AdsAccentColor[];

/**
 * Red means "deleted" in both public schemes, so it never identifies an actor. Reserving it here
 * covers every path into an attribution colour; `createAttributionColorMap` is the only caller, and
 * it is gated on `confluence_ncs_step_diffing_version_history` plus
 * `platform_editor_show_diff_color_scheme_refactor`.
 */
const RESERVED_ATTRIBUTION_COLORS: ReadonlySet<AdsAccentColor> = new Set(['red']);

const isAssignable = (color: AdsAccentColor): boolean => !RESERVED_ATTRIBUTION_COLORS.has(color);

/** Projects a telepointer slot onto its diff hue, advancing past a hue reserved for deletion. */
const getSlotColor = (index: number): AdsAccentColor | undefined => {
	for (let offset = 0; offset < HASHED_PARTICIPANT_COLOR_SCHEMES.length; offset++) {
		const color =
			HASHED_PARTICIPANT_COLOR_SCHEMES[(index + offset) % HASHED_PARTICIPANT_COLOR_SCHEMES.length];
		if (color && isAssignable(color)) {
			return color;
		}
	}

	return undefined;
};

const getAvailableColor = (
	hashedColor: AdsAccentColor,
	allocatedColors: Set<AdsAccentColor>,
): AdsAccentColor => {
	const startIndex = PARTICIPANT_COLOR_SCHEMES.indexOf(hashedColor);

	for (let offset = 0; offset < PARTICIPANT_COLOR_SCHEMES.length; offset++) {
		const color =
			PARTICIPANT_COLOR_SCHEMES[(startIndex + offset) % PARTICIPANT_COLOR_SCHEMES.length];
		if (color && isAssignable(color) && !allocatedColors.has(color)) {
			return color;
		}
	}

	// Every assignable hue is taken, so a duplicate is unavoidable — but never the reserved hue.
	return isAssignable(hashedColor)
		? hashedColor
		: (PARTICIPANT_COLOR_SCHEMES.find(isAssignable) ?? hashedColor);
};

/** Account IDs supply both the lookup key and participant colour seed. */
const getAttributionIdentity = (
	attribution: DiffStepAttribution | undefined,
): AttributionIdentity | undefined => {
	const userId = attribution?.userId?.trim();
	const agentId = attribution?.agentId?.trim();
	const colorSeed = agentId || userId;

	return colorSeed ? { colorSeed, key: `user:${userId ?? ''}|agent:${agentId ?? ''}` } : undefined;
};

/** `userId` is primary; `agentId` separates agents sharing that user. */
export const getAttributionKey = (
	attribution: DiffStepAttribution | undefined,
): string | undefined => getAttributionIdentity(attribution)?.key;

const isDiffAgentBrand = (
	agentBrand: TagContributor['agentKind'] | undefined,
): agentBrand is DiffAgentBrand =>
	agentBrand !== undefined && DIFF_AGENT_BRANDS.has(agentBrand as DiffAgentBrand);

/**
 * Public contributor list to internal key-addressed record. A contributor whose attribution carries
 * no identity is dropped, since it could never match a step. Later entries win.
 */
export const resolveContributors = (
	contributors: DiffContributors | undefined,
): ResolvedDiffContributors | undefined => {
	if (!contributors?.length) {
		return undefined;
	}

	const resolved: ResolvedDiffContributors = {};

	for (const { attribution, connectedTo, ...tagContributor } of contributors) {
		const key = getAttributionKey(attribution);
		if (!key) {
			continue;
		}

		const connectedToKey = connectedTo ? getAttributionKey(connectedTo) : undefined;
		resolved[key] = {
			...tagContributor,
			...(connectedToKey ? { connectedToKey } : {}),
		};
	}

	return Object.keys(resolved).length > 0 ? resolved : undefined;
};

export const areAttributionColorGatesEnabled = (): boolean =>
	fg('confluence_ncs_step_diffing_version_history') &&
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor');

export const isAttributionColoringEnabled = (
	stepAttributions: Array<DiffStepAttribution | undefined> | undefined,
): boolean => {
	if (!areAttributionColorGatesEnabled() || !stepAttributions?.length) {
		return false;
	}

	// Colour whenever a step names an identifiable actor; a single actor still surfaces its
	// participant colour. Only bail when nothing is attributable, so the attributed changeset is
	// not built for a diff with no identities to colour.
	return stepAttributions.some((attribution) => getAttributionKey(attribution) !== undefined);
};

/**
 * Shares the colours' gates, but with a lower bar: colouring needs two actors to tell apart, whereas
 * a tag only has to name one.
 */
export const isContributorTagsEnabled = (
	stepAttributions: Array<DiffStepAttribution | undefined> | undefined,
	contributors: ResolvedDiffContributors | undefined,
): boolean =>
	areAttributionColorGatesEnabled() &&
	Boolean(stepAttributions?.some((attribution) => getAttributionKey(attribution) !== undefined)) &&
	contributors !== undefined &&
	Object.keys(contributors).length > 0;

const getAttributionParticipantColor = (
	attribution: DiffStepAttribution | undefined,
	identity: AttributionIdentity,
	contributors: ResolvedDiffContributors | undefined,
): ReturnType<typeof getParticipantColor> => {
	const contributor = contributors?.[identity.key];
	const brand = isDiffAgentBrand(contributor?.agentKind) ? contributor?.agentKind : undefined;
	const agentName =
		brand ??
		getThirdPartyAgentColor({
			agentNamedId: attribution?.agentNamedId,
			agentName: contributor?.name,
		})?.name ??
		(attribution?.agentId?.trim() ? contributor?.name || 'Agent' : undefined);

	return getParticipantColor(
		identity.colorSeed,
		agentName,
		// Keep an explicitly resolved brand consistent with the contributor's icon.
		brand ? undefined : attribution?.agentNamedId,
	);
};

export const createAttributionColorMap = (
	stepAttributions: Array<DiffStepAttribution | undefined>,
	contributors?: ResolvedDiffContributors,
): Map<string, AdsAccentColor> => {
	const colors = new Map<string, AdsAccentColor>();
	const allocatedColors = new Set<AdsAccentColor>();

	// Reserve shared brand colours before hashing other actors, regardless of step order. A brand
	// slot is pinned deliberately, so it is taken verbatim rather than through `getSlotColor`.
	for (const attribution of stepAttributions) {
		const identity = getAttributionIdentity(attribution);
		if (!identity) {
			continue;
		}
		const { index, isFixed } = getAttributionParticipantColor(attribution, identity, contributors);
		const color = HASHED_PARTICIPANT_COLOR_SCHEMES[index];
		if (isFixed && color) {
			colors.set(identity.key, color);
			allocatedColors.add(color);
		}
	}

	for (const attribution of stepAttributions) {
		const identity = getAttributionIdentity(attribution);

		if (!identity || colors.has(identity.key)) {
			continue;
		}

		const { index } = getAttributionParticipantColor(attribution, identity, contributors);
		const hashedColor = getSlotColor(index);
		if (!hashedColor) {
			continue;
		}

		const participantColorScheme = getAvailableColor(hashedColor, allocatedColors);

		colors.set(identity.key, participantColorScheme);
		allocatedColors.add(participantColorScheme);
	}

	return colors;
};

const getLatestAttribution = (changes: Change[]): DiffAttributionSpanData | undefined => {
	const data = changes
		.flatMap((change) => [...change.deleted, ...change.inserted])
		.map((span) => span.data)
		.filter(
			(value): value is DiffAttributionSpanData =>
				typeof value === 'object' &&
				value !== null &&
				'stepIndex' in value &&
				typeof value.stepIndex === 'number',
		);

	return data.reduce<DiffAttributionSpanData | undefined>(
		(latest, attribution) =>
			!latest || attribution.stepIndex > latest.stepIndex ? attribution : latest,
		undefined,
	);
};

const rangesOverlap = (fromA: number, toA: number, fromB: number, toB: number): boolean =>
	fromA < toB && fromB < toA;

const changesOverlap = (change: Change, attributedChange: Change): boolean => {
	const insertedOverlap =
		change.inserted.length > 0 &&
		attributedChange.inserted.length > 0 &&
		rangesOverlap(change.fromB, change.toB, attributedChange.fromB, attributedChange.toB);
	const deletedOverlap =
		change.deleted.length > 0 &&
		attributedChange.deleted.length > 0 &&
		rangesOverlap(change.fromA, change.toA, attributedChange.fromA, attributedChange.toA);

	return insertedOverlap || deletedOverlap;
};

const getAttributionKeyForChanges = (changes: Change[]): string | undefined =>
	getAttributionKey(getLatestAttribution(changes));

/**
 * Preserve overlap attribution outside Confluence version history. Within version history, a
 * recovery step's keyless spans must not inherit an overlapping NCS step's actor.
 */
export const getAttributionKeyForChange = (
	change: Change,
	attributedChanges: Change[],
): string | undefined => {
	const directKey = getAttributionKeyForChanges([change]);
	return (
		directKey ??
		(fg('confluence_ncs_step_diffing_version_history')
			? undefined
			: getAttributionKeyForChanges(
					attributedChanges.filter((attributedChange) => changesOverlap(change, attributedChange)),
				))
	);
};

export const getColorSchemeForChange = (
	change: Change,
	attributedChanges: Change[],
	attributionColors: Map<string, AdsAccentColor>,
	// Widened from `PublicColorScheme` so a caller of the imperative `showDiff` command (see
	// `PMDiffParams.colorScheme`) can also request a specific accent as the base for unattributed
	// changes — an attributed change still wins via `attributionColors`.
	fallback: ColorScheme | undefined,
): ColorScheme | undefined => {
	const key = getAttributionKeyForChange(change, attributedChanges);
	return key ? (attributionColors.get(key) ?? fallback) : fallback;
};
