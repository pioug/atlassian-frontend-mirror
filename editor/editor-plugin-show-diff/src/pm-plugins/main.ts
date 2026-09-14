import type { IntlShape } from 'react-intl';

import { toggleExpandRange } from '@atlaskit/editor-common/expand';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type {
	ContributorTagModel,
	DeletedDiffPlacement,
	DiffDescriptor,
	DiffParams,
	DiffStepAttribution,
	DiffType,
	InlineDeletedDiffPlacement,
	RevealOptions,
	ShowDiffPlugin,
	SmartDiffThresholds,
} from '../showDiffPluginType';
import { getActiveDiffAnnouncement } from '../ui/DiffNavigation/announceActiveDiff';

import { calculateDiffDecorations } from './calculateDiff/calculateDiffDecorations';
import type { ResolvedDiffContributors } from './decorations/colorSchemes/attributions';
import type { ContributorTagMountContext } from './decorations/createContributorTagWidget';
import { isDiffDecoration, isDiffDecorationSpec } from './decorations/decorationKeys';
import { enforceCustomStepRegisters } from './enforceCustomStepRegisters';
import { getScrollableDecorations } from './getScrollableDecorations';
import { getDefaultDiffType, isExtendedEnabled } from './isExtendedEnabled';
import { NodeViewSerializer } from './NodeViewSerializer';
import { rebindReveal } from './revealAnimation';
import { scrollToDecoration } from './scrollToDiff';

export const showDiffPluginKey: PluginKey<ShowDiffPluginState> = new PluginKey<ShowDiffPluginState>(
	'showDiffPlugin',
);

export type ShowDiffPluginState = {
	activeIndex?: number;
	activeIndexPos?: { from: number; to: number };
	/** Set via SHOW_DIFF meta, after `normalizeShowDiffParams` has keyed the public list. */
	contributors?: ResolvedDiffContributors;
	/** Resolved per calculation, never set via meta. */
	contributorTags?: ContributorTagModel[];
	decorations: DecorationSet;
	/**
	 * For the `smart` diffType, where node/paragraph-level deleted content is rendered relative to
	 * the new content. Set via SHOW_DIFF meta. Defaults to `'top'`.
	 */
	deletedDiffPlacement?: DeletedDiffPlacement;
	/**
	 * The diff descriptors of the diff decorations currently being displayed.
	 * Only set when `platform_editor_diff_plugin_extended` is on.
	 */
	diffDescriptors?: DiffDescriptor[];
	diffType?: DiffType;
	hideAddedDiffsUnderline?: boolean;
	hideDeletedDiffs?: boolean;
	/**
	 * For the `smart` diffType, where inline-level (and sentence-level) deleted content is rendered
	 * relative to the new content. Set via SHOW_DIFF meta. Defaults to `'before'`. Independent of
	 * `deletedDiffPlacement`.
	 */
	inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
	isDisplayingChanges: boolean;
	isInverted?: boolean;
	originalDoc: PMNode | undefined;
	/**
	 * Reveal choreography for the CURRENT paint only. Set from SHOW_DIFF meta and deliberately not
	 * inherited: a scroll-to-next or an unrelated repaint must not replay the animation.
	 */
	reveal?: RevealOptions;
	/**
	 * When true, the view update handler should scroll to the first decoration
	 * and then reset this flag.
	 */
	scrollIntoView?: boolean;
	showIndicators?: boolean;
	/**
	 * Optional overrides for the `smart` diffType density thresholds. Set via SHOW_DIFF
	 * meta. Only relevant when `diffType === 'smart'`.
	 */
	smartThresholds?: Partial<SmartDiffThresholds>;
	/** Internal attribution derived from the public attributed-step input. */
	stepAttributions?: Array<DiffStepAttribution | undefined>;
	steps: ProseMirrorStep[];
};

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

/**
 * Tags whose diff decoration survived the transaction. A document change can map a decoration away
 * without any `showDiff`/`hideDiff` following it, and a tag left behind has no host to render into.
 * Returns the given array when every tag is still live.
 */
const dropOrphanedContributorTags = (
	contributorTags: ContributorTagModel[] | undefined,
	decorations: DecorationSet,
): ContributorTagModel[] | undefined => {
	if (!contributorTags?.length) {
		return contributorTags;
	}

	const liveDiffIds = new Set(
		decorations
			.find(undefined, undefined, isDiffDecorationSpec)
			.filter(isDiffDecoration)
			.map(({ spec }) => spec.diffId),
	);
	const liveTags = contributorTags.filter(({ diffId }) => liveDiffIds.has(diffId));

	return liveTags.length === contributorTags.length ? contributorTags : liveTags;
};

export const createPlugin = (
	config: DiffParams | undefined,
	getIntl: () => IntlShape,
	api: ExtractInjectionAPI<ShowDiffPlugin> | undefined,
	// Called with the editor view on mount (and `undefined` on destroy) so plugin actions can read
	// the current state. Lets the `getDeletedWidgets` action reach live decorations without exposing
	// the plugin key.
	onEditorView?: (editorView: EditorView | undefined) => void,
): SafePlugin<ShowDiffPluginState> => {
	enforceCustomStepRegisters();

	const nodeViewSerializer = new NodeViewSerializer({});
	const setNodeViewSerializer = (editorView: EditorView) => {
		nodeViewSerializer.init({ editorView });
	};

	/**
	 * This editor's own content root. The contributor tags scope every DOM lookup to it, so they take
	 * it from the view the plugin was mounted on rather than resolving `.ProseMirror` by class name
	 * from a decoration — a class this package does not own, and one whose nearest match is the wrong
	 * editor whenever editors are nested. A getter because the view arrives with the ProseMirror view
	 * lifecycle, which decorations are calculated independently of.
	 */
	let currentEditorView: EditorView | undefined;
	const tagMountContext: ContributorTagMountContext = {
		api,
		getEditorRoot: () => currentEditorView?.dom ?? null,
		getIntl,
	};

	return new SafePlugin<ShowDiffPluginState>({
		key: showDiffPluginKey,
		state: {
			init(_: EditorStateConfig, _state: EditorState) {
				// We do initial setup after we setup the editor view
				const defaultDiffType = getDefaultDiffType();
				return {
					steps: [],
					stepAttributions: [],
					originalDoc: undefined,
					decorations: DecorationSet.empty,
					isDisplayingChanges: false,
					...(isExtendedEnabled(defaultDiffType)
						? {
								isInverted: false,
								diffType: defaultDiffType,
								hideDeletedDiffs: false,
								hideAddedDiffsUnderline: false,
								showIndicators: false,
								diffDescriptors: [],
							}
						: {}),
				};
			},
			apply: (
				tr: ReadonlyTransaction,
				currentPluginState: ShowDiffPluginState,
				oldState: EditorState,
				newState: EditorState,
			) => {
				const meta = tr.getMeta(showDiffPluginKey);
				let newPluginState = currentPluginState;

				if (meta) {
					if (meta?.action === 'SHOW_DIFF' || meta?.action === 'REVEAL_COMPLETE') {
						// REVEAL_COMPLETE repaints with the reveal dropped, so the decorations render their
						// ordinary resting style. Without it the reveal stays in state indefinitely and the
						// next unrelated repaint re-emits the hidden, zero-width highlight with no animation
						// left to bring it in — the highlight simply vanishes.
						newPluginState =
							meta.action === 'REVEAL_COMPLETE'
								? { ...currentPluginState, reveal: undefined }
								: {
										...currentPluginState,
										...meta,
										isDisplayingChanges: true,
										activeIndex: undefined,
										// Explicit rather than left to the spread: an absent key in `meta` would let
										// the previous paint's choreography leak into this one, so closing the diff
										// would animate too.
										reveal: meta.reveal,
									};
						// Calculate and store decorations in state
						const { contributorTags, decorations, diffDescriptors } = calculateDiffDecorations({
							state: newState,
							pluginState: newPluginState,
							nodeViewSerializer,
							colorScheme: config?.colorScheme,
							intl: getIntl(),
							activeIndexPos: newPluginState.activeIndexPos,
							api,
							tagMountContext,
							...(isExtendedEnabled(newPluginState?.diffType)
								? {
										isInverted: newPluginState?.isInverted,
										diffType: newPluginState?.diffType,
										hideDeletedDiffs: newPluginState?.hideDeletedDiffs,
										hideAddedDiffsUnderline: newPluginState?.hideAddedDiffsUnderline,
										showIndicators: newPluginState?.showIndicators,
										smartThresholds: newPluginState?.smartThresholds,
										deletedDiffPlacement: newPluginState?.deletedDiffPlacement,
										inlineDeletedDiffPlacement: newPluginState?.inlineDeletedDiffPlacement,
										// SHOW_DIFF only. The scroll-to-next recalculation further down deliberately
										// omits this so stepping through changes cannot replay the choreography.
										reveal: newPluginState?.reveal,
									}
								: {}),
						});
						// Update the decorations and their ids
						newPluginState.decorations = decorations;
						newPluginState.contributorTags = contributorTags;
						if (isExtendedEnabled(newPluginState?.diffType)) {
							newPluginState.diffDescriptors = diffDescriptors;
						}
					} else if (meta?.action === 'HIDE_DIFF') {
						newPluginState = {
							...currentPluginState,
							...meta,
							decorations: DecorationSet.empty,
							isDisplayingChanges: false,
							activeIndex: undefined,
							contributorTags: [],
							reveal: undefined,
							/**
							 * Reset isInverted & diffType state when hiding diffs
							 * Otherwise this should persist for the diff-showing session
							 */
							...(isExtendedEnabled(currentPluginState.diffType)
								? {
										isInverted: false,
										diffType: getDefaultDiffType(),
										hideDeletedDiffs: false,
										hideAddedDiffsUnderline: false,
										diffDescriptors: [],
									}
								: {}),
						};
					} else if (meta?.action === 'SCROLL_TO_NEXT' || meta?.action === 'SCROLL_TO_PREVIOUS') {
						// Update the active index in plugin state and recalculate decorations
						const decorations = getScrollableDecorations(
							currentPluginState.decorations,
							newState.doc,
							newPluginState?.diffType,
						);

						if (decorations.length > 0) {
							// Initialize to -1 if undefined so that the first "next" scroll takes us to index 0 (first change).
							// This allows the UI to start with no selection and only highlight on first user interaction.
							let nextIndex = currentPluginState.activeIndex ?? -1;
							if (meta.action === 'SCROLL_TO_NEXT') {
								nextIndex = (nextIndex + 1) % decorations.length;
							} else {
								// Handle scrolling backwards from the uninitialized state.
								// If at -1 (no selection), wrap to the last decoration.
								if (nextIndex === -1) {
									nextIndex = decorations.length - 1;
								} else {
									nextIndex = (nextIndex - 1 + decorations.length) % decorations.length;
								}
							}
							const activeDecoration = decorations[nextIndex];
							newPluginState = {
								...currentPluginState,
								activeIndex: nextIndex,
								activeIndexPos: activeDecoration
									? { from: activeDecoration.from, to: activeDecoration.to }
									: undefined,
							};
							// Recalculate decorations with the new active index
							const {
								contributorTags: updatedContributorTags,
								decorations: updatedDecorations,
								diffDescriptors: updatedDiffDescriptors,
							} = calculateDiffDecorations({
								state: newState,
								pluginState: newPluginState,
								nodeViewSerializer,
								colorScheme: config?.colorScheme,
								intl: getIntl(),
								activeIndexPos: newPluginState.activeIndexPos,
								api,
								tagMountContext,
								...(isExtendedEnabled(newPluginState.diffType)
									? {
											isInverted: newPluginState.isInverted,
											diffType: newPluginState.diffType,
											hideDeletedDiffs: newPluginState.hideDeletedDiffs,
											hideAddedDiffsUnderline: newPluginState.hideAddedDiffsUnderline,
											showIndicators: newPluginState.showIndicators,
											smartThresholds: newPluginState.smartThresholds,
											deletedDiffPlacement: newPluginState.deletedDiffPlacement,
											inlineDeletedDiffPlacement: newPluginState.inlineDeletedDiffPlacement,
										}
									: {}),
							});
							newPluginState.decorations = updatedDecorations;
							newPluginState.contributorTags = updatedContributorTags;
							if (isExtendedEnabled(newPluginState.diffType)) {
								newPluginState.diffDescriptors = updatedDiffDescriptors;
							}
						}
					} else {
						newPluginState = { ...currentPluginState, ...meta };
					}
				}

				const mappedDecorations = newPluginState.decorations.map(tr.mapping, tr.doc);

				const nextState: ShowDiffPluginState = {
					...newPluginState,
					decorations: mappedDecorations,
				};

				if (tr.docChanged) {
					nextState.contributorTags = dropOrphanedContributorTags(
						newPluginState.contributorTags,
						mappedDecorations,
					);
				}

				return nextState;
			},
		},
		view(editorView: EditorView) {
			setNodeViewSerializer(editorView);
			currentEditorView = editorView;
			onEditorView?.(editorView);
			let isFirst = true;
			let previousActiveIndex: number | undefined;
			let cancelPendingScrollToDecoration: (() => void) | null = null;
			return {
				update(view: EditorView) {
					// If we're using configuration to show diffs we initialise here once we setup the editor view
					if (config?.originalDoc && config?.steps && config.steps.length > 0 && isFirst) {
						isFirst = false;

						view.dispatch(
							view.state.tr.setMeta(showDiffPluginKey, {
								action: 'SHOW_DIFF',
								steps: config.steps.map((step) =>
									ProseMirrorStep.fromJSON(view.state.schema, step),
								),
								originalDoc: processRawValue(view.state.schema, config.originalDoc),
							}),
						);
					}

					const pluginState = showDiffPluginKey.getState(view.state);

					// A repaint rebuilds inline decorations, destroying any animation bound to them, so
					// an in-flight reveal has to be re-attached to the new nodes. No-op when idle.
					rebindReveal(view, view.dom);

					// Scroll to the first decoration when scrollIntoView was requested.
					// Use the same filtered/position-sorted list as the active-index path
					// so "first" reliably means the topmost scrollable diff in the document.
					if (pluginState?.scrollIntoView && isExtendedEnabled(pluginState?.diffType)) {
						cancelPendingScrollToDecoration?.();
						cancelPendingScrollToDecoration = scrollToDecoration(
							view,
							getScrollableDecorations(
								pluginState.decorations,
								view.state.doc,
								pluginState?.diffType,
							),
						);

						// Reset the flag so we don't scroll again on subsequent updates
						view.dispatch(
							view.state.tr.setMeta(showDiffPluginKey, {
								scrollIntoView: false,
							}),
						);
					}

					// Check for any potential scroll side-effects
					const activeIndexChanged =
						pluginState?.activeIndex !== undefined &&
						pluginState.activeIndex !== previousActiveIndex;
					previousActiveIndex = pluginState?.activeIndex;

					if (pluginState?.activeIndex !== undefined && activeIndexChanged) {
						cancelPendingScrollToDecoration?.();
						const scrollableDecorations = getScrollableDecorations(
							pluginState.decorations,
							view.state.doc,
							pluginState?.diffType,
						);
						const activeDecoration = scrollableDecorations[pluginState.activeIndex];
						if (activeDecoration) {
							// EDITOR-7926: use editor-common's command instead of the expand plugin API to
							// avoid a circular dependency; expand picks up the meta if loaded (no-op if not).
							api?.core.actions.execute(
								toggleExpandRange(activeDecoration.from, activeDecoration.to, true),
							);
						}
						cancelPendingScrollToDecoration = scrollToDecoration(
							view,
							scrollableDecorations,
							pluginState.activeIndex,
						);

						// Stepping only scrolls — no focus moves and no content changes — so without this a
						// screen-reader user gets silence. Announced through the live region rather than by
						// focusing the change, since the "next change" control has to stay focused to be
						// pressed again. After the scroll above, so the announcement never precedes it.
						if (isExtendedEnabled(pluginState?.diffType)) {
							const announcement = getActiveDiffAnnouncement({
								activeIndex: pluginState.activeIndex,
								contributorTags: pluginState.contributorTags,
								decorations: scrollableDecorations,
								intl: getIntl(),
							});
							if (announcement) {
								api?.accessibilityUtils?.actions.ariaNotify(announcement);
							}
						}
					}
				},
				destroy() {
					cancelPendingScrollToDecoration?.();
					cancelPendingScrollToDecoration = null;
					currentEditorView = undefined;
					onEditorView?.(undefined);
				},
			};
		},
		props: {
			decorations: (state: EditorState) => {
				const pluginState = showDiffPluginKey.getState(state);
				return pluginState?.decorations;
			},
		},
	});
};
