import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * ProseMirror plugin that manages AI-generating decorations on media nodes.
 *
 * Instead of storing transient `__isAIGenerating` attributes in the ADF schema
 * (which pollutes the document model and undo history), this plugin uses
 * ProseMirror decorations — a view-layer-only mechanism that never affects the
 * document content, serialization, or undo/redo stack.
 */

// ── Plugin Key ──────────────────────────────────────────────────────────────

export const aiGeneratingDecorationPluginKey: PluginKey = new PluginKey('aiGeneratingDecoration');

// ── Types ───────────────────────────────────────────────────────────────────

export type AIGeneratingSource = 'cwr' | 'maui';

export type AIGeneratingAction =
	| { mediaId: string; source?: AIGeneratingSource; type: 'SET_GENERATING' }
	| { mediaId: string; type: 'CLEAR_GENERATING' }
	| { type: 'CLEAR_ALL' };

interface AIGeneratingDecorationState {
	/** The decoration set applied to the editor view */
	decorationSet: DecorationSet;
	/** Map of media node IDs currently in AI-generating state to their source */
	generatingMediaIds: Map<string, AIGeneratingSource>;
}

const AI_GENERATING_DECORATION_TYPE = 'ai-generating';

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a DecorationSet containing a Decoration.node for every media node
 * targeted by the given set.
 *
 * Targets are matched by `localId` first (the mediaSingle wrapper's or the media
 * node's own) so that duplicate copies of the same image — which share a media
 * file `id` — don't all get decorated; only the node the user acted on lights
 * up. Falls back to the media file `id` for the CWR flow and for any node that
 * has no localId yet.
 */
function buildDecorationSet(
	doc: EditorState['doc'],
	targetIds: Map<string, AIGeneratingSource>,
): DecorationSet {
	if (targetIds.size === 0) {
		return DecorationSet.empty;
	}

	const decorations: Decoration[] = [];

	doc.descendants((node, pos, parent) => {
		if (node.type.name !== 'media') {
			return;
		}

		const wrapperLocalId = parent?.attrs?.localId;
		const matches =
			(wrapperLocalId && targetIds.has(wrapperLocalId)) ||
			(node.attrs.localId && targetIds.has(node.attrs.localId)) ||
			targetIds.has(node.attrs.id);

		if (matches) {
			decorations.push(
				Decoration.node(
					pos,
					pos + node.nodeSize,
					{}, // no DOM attrs needed — the NodeView reads the decoration spec
					{ type: AI_GENERATING_DECORATION_TYPE, mediaId: node.attrs.id },
				),
			);
		}
	});

	return DecorationSet.create(doc, decorations);
}

// ── Public utilities ────────────────────────────────────────────────────────

/**
 * Returns `true` if the given decorations array contains an AI-generating
 * decoration. Call this from a NodeView's `update()` / `viewShouldUpdate()`
 * to determine whether to render the AI border.
 */
export function hasAIGeneratingDecoration(decorations: readonly Decoration[]): boolean {
	return decorations.some((d) => d.spec.type === AI_GENERATING_DECORATION_TYPE);
}

/**
 * Dispatch a transaction that sets the AI-generating decoration on a media
 * node identified by `mediaId`.
 *
 * Usage from the editor bridge:
 * ```
 * editorAPI.core.actions.execute(({ tr }) =>
 *   setAIGeneratingMeta(tr, mediaId),
 * );
 * ```
 */
export function setAIGeneratingMeta(
	tr: Transaction,
	mediaId: string,
	source?: AIGeneratingSource,
): Transaction {
	return tr
		.setMeta(aiGeneratingDecorationPluginKey, {
			type: 'SET_GENERATING',
			mediaId,
			source,
		} satisfies AIGeneratingAction)
		.setMeta('addToHistory', false);
}

/**
 * Dispatch a transaction that clears the AI-generating decoration for a
 * specific media node.
 */
export function clearAIGeneratingMeta(tr: Transaction, mediaId: string): Transaction {
	return tr
		.setMeta(aiGeneratingDecorationPluginKey, {
			type: 'CLEAR_GENERATING',
			mediaId,
		} satisfies AIGeneratingAction)
		.setMeta('addToHistory', false);
}

// ── Plugin ──────────────────────────────────────────────────────────────────

/** Creates the ProseMirror plugin that manages AI-generating decorations on media nodes. */
export function createAIGeneratingDecorationPlugin(): SafePlugin {
	return new SafePlugin({
		key: aiGeneratingDecorationPluginKey,

		state: {
			init(): AIGeneratingDecorationState {
				return {
					generatingMediaIds: new Map(),
					decorationSet: DecorationSet.empty,
				};
			},

			apply(tr, pluginState, _oldState, newState): AIGeneratingDecorationState {
				// Disabled when gate/experiment off — drop decorations.
				if (!fg('cc-maui-phase-2') || !expValEquals('cc-maui-experiment', 'isEnabled', true)) {
					if (pluginState.generatingMediaIds.size > 0) {
						return {
							generatingMediaIds: new Map(),
							decorationSet: DecorationSet.empty,
						};
					}
					return pluginState;
				}

				const meta: AIGeneratingAction | undefined = tr.getMeta(aiGeneratingDecorationPluginKey);

				if (meta) {
					switch (meta.type) {
						case 'SET_GENERATING': {
							const ids = new Map(pluginState.generatingMediaIds);
							ids.set(meta.mediaId, meta.source ?? 'maui');
							const hasCwrIds =
								expValEquals(
									'aifc_page_create_with_rovo_include_infographics',
									'isEnabled',
									true,
								) && [...ids.values()].some((s) => s === 'cwr');
							const newDecoSet = buildDecorationSet(newState.doc, ids);

							if (hasCwrIds && newDecoSet.find().length === 0 && ids.size > 0) {
								// CWR fallback — keep existing decorations during transient doc absence
								return { generatingMediaIds: ids, decorationSet: pluginState.decorationSet };
							}
							return { generatingMediaIds: ids, decorationSet: newDecoSet };
						}

						case 'CLEAR_GENERATING': {
							const ids = new Map(pluginState.generatingMediaIds);
							ids.delete(meta.mediaId);

							const hasCwrIds =
								expValEquals(
									'aifc_page_create_with_rovo_include_infographics',
									'isEnabled',
									true,
								) && [...ids.values()].some((s) => s === 'cwr');
							const newDecoSet = buildDecorationSet(newState.doc, ids);

							if (hasCwrIds && newDecoSet.find().length === 0) {
								// CWR fallback — keep existing decorations during transient doc absence
								return { generatingMediaIds: ids, decorationSet: pluginState.decorationSet };
							}
							return { generatingMediaIds: ids, decorationSet: newDecoSet };
						}

						case 'CLEAR_ALL':
							return {
								generatingMediaIds: new Map(),
								decorationSet: DecorationSet.empty,
							};
					}
				}

				// CWR path
				// Rebuild decorations from scratch because CWR streaming replaces the
				// entire document on every chunk and map() drops decorations whose
				// positions can't be mapped.
				const hasCwrIds =
					expValEquals('aifc_page_create_with_rovo_include_infographics', 'isEnabled', true) &&
					[...pluginState.generatingMediaIds.values()].some((s) => s === 'cwr');
				if (tr.docChanged && hasCwrIds) {
					const rebuilt = buildDecorationSet(newState.doc, pluginState.generatingMediaIds);
					const prevCount = pluginState.decorationSet.find().length;
					const newCount = rebuilt.find().length;

					// Prevents flickering that results from updating during transient
					// doc replacements (when nodes are briefly absent)
					if (newCount !== prevCount && newCount >= pluginState.generatingMediaIds.size) {
						return {
							...pluginState,
							decorationSet: rebuilt,
						};
					}
					return pluginState;
				}

				// Remix path
				// Map decorations through document changes so positions stay in sync
				if (tr.docChanged && pluginState.decorationSet !== DecorationSet.empty) {
					try {
						return {
							...pluginState,
							decorationSet: pluginState.decorationSet.map(tr.mapping, newState.doc),
						};
					} catch {
						return {
							generatingMediaIds: new Map(),
							decorationSet: DecorationSet.empty,
						};
					}
				}

				return pluginState;
			},
		},

		props: {
			decorations(state) {
				return (
					aiGeneratingDecorationPluginKey.getState(state)?.decorationSet ?? DecorationSet.empty
				);
			},
		},
	});
}
