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

export type AIGeneratingAction =
	| { mediaId: string; type: 'SET_GENERATING' }
	| { mediaId: string; type: 'CLEAR_GENERATING' }
	| { type: 'CLEAR_ALL' };

interface AIGeneratingDecorationState {
	/** The decoration set applied to the editor view */
	decorationSet: DecorationSet;
	/** Set of media node IDs currently in AI-generating state */
	generatingMediaIds: Set<string>;
}

const AI_GENERATING_DECORATION_TYPE = 'ai-generating';

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a DecorationSet containing a Decoration.node for every media node
 * whose `id` is in the given set.
 */
function buildDecorationSet(doc: EditorState['doc'], mediaIds: Set<string>): DecorationSet {
	if (mediaIds.size === 0) {
		return DecorationSet.empty;
	}

	const decorations: Decoration[] = [];

	doc.descendants((node, pos) => {
		if (node.type.name === 'media' && mediaIds.has(node.attrs.id)) {
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
export function setAIGeneratingMeta(tr: Transaction, mediaId: string): Transaction {
	return tr
		.setMeta(aiGeneratingDecorationPluginKey, {
			type: 'SET_GENERATING',
			mediaId,
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
					generatingMediaIds: new Set(),
					decorationSet: DecorationSet.empty,
				};
			},

			apply(tr, pluginState, _oldState, newState): AIGeneratingDecorationState {
				// Disabled when gate/experiment off — drop decorations.
				if (!fg('cc-maui-phase-2') || !expValEquals('cc-maui-experiment', 'isEnabled', true)) {
					if (pluginState.generatingMediaIds.size > 0) {
						return {
							generatingMediaIds: new Set(),
							decorationSet: DecorationSet.empty,
						};
					}
					return pluginState;
				}

				const meta: AIGeneratingAction | undefined = tr.getMeta(aiGeneratingDecorationPluginKey);

				if (meta) {
					switch (meta.type) {
						case 'SET_GENERATING': {
							const ids = new Set(pluginState.generatingMediaIds);
							ids.add(meta.mediaId);
							return {
								generatingMediaIds: ids,
								decorationSet: buildDecorationSet(newState.doc, ids),
							};
						}

						case 'CLEAR_GENERATING': {
							const ids = new Set(pluginState.generatingMediaIds);
							ids.delete(meta.mediaId);
							return {
								generatingMediaIds: ids,
								decorationSet: buildDecorationSet(newState.doc, ids),
							};
						}

						case 'CLEAR_ALL':
							return {
								generatingMediaIds: new Set(),
								decorationSet: DecorationSet.empty,
							};
					}
				}

				// Map decorations through document changes so positions stay in sync
				if (tr.docChanged && pluginState.decorationSet !== DecorationSet.empty) {
					try {
						return {
							...pluginState,
							decorationSet: pluginState.decorationSet.map(tr.mapping, newState.doc),
						};
					} catch {
						// Collaborative editing edge case — reset
						return {
							generatingMediaIds: new Set(),
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
