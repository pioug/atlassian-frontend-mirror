import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';
import type { StepJson } from '@atlaskit/editor-common/collab';
import type {
	NextEditorPlugin,
	EditorCommand,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode/limited-mode-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

import type { SmartDiffThresholds as SmartDiffThresholdsInternal } from './pm-plugins/calculateDiff/smart/thresholds';
import type { ColorScheme as ResolvedColorScheme } from './pm-plugins/decorations/colorSchemes/types';

/**
 * `'standard'` (purple insertions, default) and `'traditional'` (green/red) are the two
 * plugin-configured schemes. The remaining accent names are the attribution palette used for
 * per-contributor colouring (`stepsWithAttribution`) — callers of the imperative `showDiff`
 * command (see `PMDiffParams.colorScheme`) can also pass one of these directly to match a
 * specific contributor's colour outside of attribution mode, for example matching a Review
 * moment diff to the streaming highlight of the agent that produced it.
 */
export type ColorScheme = ResolvedColorScheme;

export type DiffType = 'inline' | 'block' | 'step' | 'smart';

/**
 * Attribution for a ProseMirror step.
 *
 * `userId` is the primary actor identity. `agentId` distinguishes multiple agents (or an agent
 * from its user) when they share that user ID, with `agentType` used as a fallback when `agentId`
 * is empty. `wasOffline` preserves additional provenance without affecting identity.
 */
export type DiffStepAttribution = {
	agentId?: string;
	agentType?: string;
	userId?: string;
	wasOffline?: boolean;
};

/** Keeps a step and its attribution coupled through mapping and filtering. */
export type StepWithAttribution<TStep> = {
	step: TStep;
	stepAttribution?: DiffStepAttribution;
};

/** Branded agent presentations supported by contributor tags. */
export type DiffAgentBrand = 'rovo' | 'claude' | 'chatgpt' | 'figma' | 'lovable' | 'replit';
export const DIFF_AGENT_BRANDS: ReadonlySet<DiffAgentBrand> = new Set([
	'rovo',
	'claude',
	'chatgpt',
	'figma',
	'lovable',
	'replit',
]);

/** The brand id `@atlaskit/agent-color` registers each `AgentBrandColorScheme` under. */
type AgentColorBrandId = AgentBrandColorScheme extends `agent-brand-${infer BrandId}`
	? BrandId
	: never;

/**
 * Compile-time-only: fails to build if `DiffAgentBrand` names a brand `@atlaskit/agent-color`
 * hasn't registered a colour scheme for. Catches "added a brand here but forgot the colour"
 * without needing a runtime check. Exported only so the unused check on this module-scope
 * assertion doesn't fire; no consumer needs its value.
 */
export const ASSERT_DIFF_AGENT_BRANDS_ARE_REGISTERED: DiffAgentBrand extends AgentColorBrandId
	? true
	: ['DiffAgentBrand is missing from @atlaskit/agent-color', DiffAgentBrand] = true;

/** A complete identity for one of the accounts named by a step attribution. */
export type DiffContributorProfile = {
	/** Matched against the `userId` and `agentId` on step attributions. */
	accountId: string;
	/** Optional brand for an agent profile, supplied by the host product. */
	agentBrand?: DiffAgentBrand;
	avatarUrl?: string;
	name: string;
};

type DiffContributorKind = 'user' | 'agent';

/** Agent presentation: branded (dedicated icon and reserved participant colour), identified by profile, or a generic external agent. */
type DiffAgentKind = DiffAgentBrand | 'identified' | 'external';

/**
 * A contributor the plugin has resolved from a step attribution and a supplied profile. Internal:
 * never re-exported from an entry point and not reachable from any public type. Same for
 * `DiffContributors`.
 */
export type DiffContributor = {
	/** For `kind: 'agent'`, which presentation to use. Defaults to `'external'`. */
	agentKind?: DiffAgentKind;
	attribution: DiffStepAttribution;
	avatarUrl?: string;
	/** Attribution of the invoking user, so the pair renders as connected. */
	connectedTo?: DiffStepAttribution;
	kind: DiffContributorKind;
	name: string;
};

/** Where two contributors share an identity, the last wins. */
export type DiffContributors = DiffContributor[];

/** A contributor stripped of its attributions, as a tag presents it. Internal. */
export type TagContributor = Omit<DiffContributor, 'attribution' | 'connectedTo'>;

/**
 * Everything a contributor tag renders, resolved by the plugin so the tag UI does no lookups.
 * Declared here rather than beside `extractContributorTags` so the shared state below can name it
 * without importing back out of this file. Internal, like `TagContributor`.
 */
export type ContributorTagModel = {
	colorScheme?: ResolvedColorScheme;
	connectedContributor?: TagContributor;
	contributor: TagContributor;
	diffId: string;
	isActive?: boolean;
	isInserted?: boolean;
	/**
	 * Other decorations of the same change that this one tag captions, so hovering any of them
	 * reveals it. Set when a replacement's deleted-content widget is folded into its inline tag.
	 */
	linkedDiffIds?: string[];
};

/**
 * Where node/paragraph-level deleted content is rendered relative to the new (replacement)
 * content in the `smart` diffType:
 * - `'top'` (default): the deleted content is anchored above the new content.
 * - `'bottom'`: the deleted content is anchored below the new content.
 */
export type DeletedDiffPlacement = 'top' | 'bottom';

/**
 * Where inline-level (and sentence-level) deleted content is rendered relative to the new
 * (replacement) content in the `smart` diffType. This is independent of the node/paragraph-level
 * `deletedDiffPlacement` option:
 * - `'before'` (default): the deleted content is anchored before the new content.
 * - `'after'`: the deleted content is anchored after the new content.
 */
export type InlineDeletedDiffPlacement = 'before' | 'after';

/**
 * A rendered deleted-content widget: the DOM element show-diff renders for a piece of deleted
 * content, together with the document position it is anchored at. Deleted content is rendered as
 * widget decorations rather than document nodes, so this is how consumers recover the element and
 * its position — via the `getDeletedWidgets` action — without reaching into the plugin's internal
 * state.
 */
export type DeletedDiffWidget = {
	element: HTMLElement;
	position: number;
};

// Re-export the canonical `SmartDiffThresholds` declaration (single source of truth) so the
// public plugin types stay in sync with the smart-diff implementation.
export type SmartDiffThresholds = SmartDiffThresholdsInternal;

export type DiffDescriptor = {
	colorScheme?: ColorScheme;
	id: string;
	isInserted?: boolean;
	leftAnchorId?: string;
	type: 'inline' | 'block' | 'widget';
};

/**
 * How the diff is revealed when it is painted.
 *
 * - `phased` — the two-phase choreography used when opening the diff from a clean "new state":
 *   the outgoing state cross-fades to the incoming one while the agent highlight wipes out to the
 *   right, then every highlight wipes back in from the left.
 *
 * Deliberately separate from {@link DiffType}: that describes how changes are computed and grouped,
 * this describes how the result is presented over time. Folding one into the other would make every
 * `DiffType` consumer — version history, track-changes, publish diff — care about presentation.
 */
export type RevealMode = 'phased';

export type RevealOptions = {
	/**
	 * Total length of the choreography. Defaults to `REVEAL_DEFAULT_DURATION_MS`. Exposed because
	 * this is a design-tunable value; it should not be buried in a stylesheet.
	 */
	durationMs?: number;
	mode: RevealMode;
};

export type DiffParams = {
	/**
	 * Color scheme to use for displaying diffs.
	 * 'standard' (default) uses purple for highlighting changes
	 * 'traditional' uses green for additions and red for deletions
	 */
	colorScheme?: ColorScheme;
	originalDoc: JSONDocNode;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: StepJson[];
};

export type PMDiffParams = {
	/**
	 * Overrides the colour scheme for this repaint only. Unset falls back to the plugin's
	 * configured `DiffParams.colorScheme` (ultimately `'standard'`, purple). Persists across
	 * `SCROLL_TO_NEXT`/`SCROLL_TO_PREVIOUS` repaints of the same diff, and resets when the diff
	 * is hidden.
	 */
	colorScheme?: ColorScheme;
	/**
	 * For the `smart` diffType, where node/paragraph-level deleted content is rendered relative to
	 * the new content. Defaults to `'top'`. Ignored for other diff types.
	 */
	deletedDiffPlacement?: DeletedDiffPlacement;
	diffType?: DiffType;
	/**
	 * When true, removes only the dark-purple underline (`border-bottom`) from added/updated
	 * (inserted) diff content, keeping the purple background highlight and all other styling.
	 * Only affects the extended (`smart`) styles. Defaults to `false`, and is a no-op unless the
	 * relevant gate is enabled.
	 */
	hideAddedDiffsUnderline?: boolean;
	hideDeletedDiffs?: boolean;
	/**
	 * For the `smart` diffType, where inline-level (and sentence-level) deleted content is rendered
	 * relative to the new content. Defaults to `'before'`. Independent of `deletedDiffPlacement`
	 * (which controls node/paragraph-level placement). Ignored for other diff types, and a no-op
	 * unless the relevant gate is enabled.
	 */
	inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
	isInverted?: boolean;
	originalDoc: Node;
	/**
	 * How this diff is revealed when painted. Omitted means paint immediately.
	 *
	 * Applies to THIS paint only — it is not inherited by later recalculations, so stepping
	 * through changes or a repaint cannot replay the choreography.
	 */
	reveal?: RevealOptions;
	/**
	 * When true, the editor will scroll to bring the first diff decoration into view
	 * after the diff is shown.
	 */
	scrollIntoView?: boolean;
	/**
	 * Whether to show indicators at the doc margin for the diffs.
	 */
	showIndicators?: boolean;
	/**
	 * Optional overrides for the `smart` diffType density thresholds. Ignored for other
	 * diff types. Partial — omitted fields fall back to defaults.
	 */
	smartThresholds?: Partial<SmartDiffThresholds>;
	/**
	 * Prosemirror steps. This is used to calculate and show the diff in the editor
	 */
	steps: Step[];
};

/**
 * Attributed alternative to `PMDiffParams`. When agent colouring is enabled, changes are grouped
 * by `userId`, with `agentId` used as a tie-breaker.
 */
type PMDiffParamsWithAttribution = Omit<PMDiffParams, 'steps'> & {
	/**
	 * Identities for the accounts named by the attributed steps. Omitted profiles disable
	 * contributor tags without disabling attribution colours. An explicit empty array permits agent fallback tags. When supplied, and the contributor-tag
	 * gate is on, every attributed change the plugin can credit to one of them renders a tag.
	 * Complete entries only: a caller looking identities up (e.g. against a user directory) filters
	 * out the ones it could not resolve rather than passing partial entries through. Omitting an
	 * account is meaningful — a user the plugin cannot name drops every tag, while an agent falls
	 * back to its own presentation.
	 */
	contributorProfiles?: readonly DiffContributorProfile[];
	steps?: never;
	stepsWithAttribution: Array<StepWithAttribution<Step>>;
};

export type ShowDiffParams = PMDiffParams | PMDiffParamsWithAttribution;

export type ShowDiffPlugin = NextEditorPlugin<
	'showDiff',
	{
		actions: {
			/**
			 * The rendered deleted-content widgets currently displayed, optionally restricted to a
			 * document range, ordered by position. This is the safe, read-only way to recover deleted
			 * content's element and position (e.g. to position UI relative to it) without access to the
			 * plugin's internal decoration set. Returns an empty array when no diff is displayed.
			 */
			getDeletedWidgets: (range?: { from: number; to: number }) => DeletedDiffWidget[];
		};
		commands: {
			hideDiff: EditorCommand;
			scrollToNext: EditorCommand;
			scrollToPrevious: EditorCommand;
			showDiff: (config: ShowDiffParams) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<LimitedModePlugin>,
			/** Carries the live-region announcement made when stepping between changes. */
			OptionalPlugin<AccessibilityUtilsPlugin>,
		];
		pluginConfiguration: DiffParams | undefined;
		sharedState: {
			/**
			 * The index of the current diff being viewed.
			 */
			activeIndex?: number;
			/**
			 * The contributor tags to render for the diff currently being displayed. Resolved by the
			 * plugin and consumed by its own contributor-tag UI — `ContributorTagModel` and
			 * `TagContributor` are not exported from any entry point.
			 */
			contributorTags?: ContributorTagModel[];
			/**
			 * The diff descriptors of the diff decorations currently being displayed.
			 */
			diffDescriptors?: DiffDescriptor[];
			/**
			 * Whether the show diff feature is currently displaying changes.
			 * Defaults to false.
			 */
			isDisplayingChanges: boolean;
			/**
			 * The number of changes being displayed
			 */
			numberOfChanges?: number;
			/**
			 * Whether to show indicators at the doc margin for the diffs.
			 */
			showIndicators?: boolean;
		};
	}
>;
