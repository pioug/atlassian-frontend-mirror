// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Plugin, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type {
	Step as ProseMirrorStep,
	Transform as ProseMirrorTransform,
} from '@atlaskit/editor-prosemirror/transform';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { mapStep } from './movedContent';

export class Rebaseable {
	constructor(
		readonly step: ProseMirrorStep,
		readonly inverted: ProseMirrorStep,
		readonly origin: ProseMirrorTransform,
	) {}
}

export function rebaseSteps(
	steps: readonly Rebaseable[],
	over: readonly ProseMirrorStep[],
	transform: ProseMirrorTransform,
) {
	for (let i = steps.length - 1; i >= 0; i--) {
		transform.step(steps[i].inverted);
	}
	for (let i = 0; i < over.length; i++) {
		transform.step(over[i]);
	}
	const result = [];
	for (let i = 0, mapFrom = steps.length; i < steps.length; i++) {
		const mapped = steps[i].step.map(transform.mapping.slice(mapFrom));

		const movedStep = editorExperiment('platform_editor_offline_editing_web', true)
			? mapStep(steps, transform, i, mapped)
			: undefined;

		mapFrom--;
		if (mapped && !transform.maybeStep(mapped).failed) {
			// Open ticket for setMirror https://github.com/ProseMirror/prosemirror/issues/869
			// @ts-expect-error
			transform.mapping.setMirror(mapFrom, transform.steps.length - 1);
			result.push(
				new Rebaseable(
					mapped,
					mapped.invert(transform.docs[transform.docs.length - 1]),
					steps[i].origin,
				),
			);
		}

		// If the step is a "move" step - apply the additional step
		if (editorExperiment('platform_editor_offline_editing_web', true)) {
			if (movedStep && !transform.maybeStep(movedStep).failed) {
				result.push(
					new Rebaseable(
						movedStep,
						movedStep.invert(transform.docs[transform.docs.length - 1]),
						transform,
					),
				);
			}
		}
	}
	return result;
}

// This state field accumulates changes that have to be sent to the
// central authority in the collaborating group and makes it possible
// to integrate changes made by peers into our local document. It is
// defined by the plugin, and will be available as the `collab` field
// in the resulting editor state.
class CollabState {
	constructor(
		// The version number of the last update received from the central
		// authority. Starts at 0 or the value of the `version` property
		// in the option object, for the editor's value when the option
		// was enabled.
		readonly version: number,
		// The local steps that havent been successfully sent to the
		// server yet.
		readonly unconfirmed: readonly Rebaseable[],
	) {}
}

function unconfirmedFrom(transform: ProseMirrorTransform) {
	const result = [];
	for (let i = 0; i < transform.steps.length; i++) {
		result.push(
			new Rebaseable(transform.steps[i], transform.steps[i].invert(transform.docs[i]), transform),
		);
	}
	return result;
}

const collabKey = new PluginKey<CollabState>('collab');

type CollabConfig = {
	/// This client's ID, used to distinguish its changes from those of
	/// other clients. Defaults to a random 32-bit number.
	clientID?: number | string | null;

	// Allow the client to apply a transform to unconfirmed steps
	transformUnconfirmed?: (steps: Rebaseable[]) => Rebaseable[];

	/// The starting version number of the collaborative editing.
	/// Defaults to 0.
	version?: number;
};

/// Creates a plugin that enables the collaborative editing framework
/// for the editor.
export function collab(config: CollabConfig = {}): Plugin {
	const conf: Required<Omit<CollabConfig, 'transformUnconfirmed'>> = {
		version: config.version || 0,
		clientID:
			// eslint-disable-next-line eqeqeq
			// generate a temporary id as clientId when it is null or undefined
			// prefix temp-pc- indicates prosemirror-collab
			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			config.clientID == null || !config.clientID ? `temp-pc-${uuidv4()}` : config.clientID,
	};
	const transformUnconfirmed = config.transformUnconfirmed ?? ((steps) => steps);

	return new Plugin<CollabState>({
		key: collabKey,

		state: {
			init: () => new CollabState(conf.version, []),
			apply(tr, collab) {
				const newState = tr.getMeta(collabKey);
				if (newState) {
					if (
						editorExperiment('platform_editor_offline_editing_web', true) ||
						expValEquals('platform_editor_enable_single_player_step_merging', 'isEnabled', true)
					) {
						return new CollabState(newState.version, transformUnconfirmed(newState.unconfirmed));
					} else {
						return newState;
					}
				}
				if (tr.docChanged) {
					return new CollabState(
						collab.version,
						transformUnconfirmed(
							collab.unconfirmed.concat(unconfirmedFrom(tr as ProseMirrorTransform)),
						),
					);
				}
				return collab;
			},
		},

		config: conf,

		// This is used to notify the history plugin to not merge steps,
		// so that the history can be rebased.
		historyPreserveItems: true,
	});
}

/**
 * Get the document before the unconfirmed steps were applied.
 * This is used to facilitate tab syncing across multiple tabs while offline, by returning the document before the unconfirmed steps were
 * applied we can ensure each tab starts from the same doc.
 * @param state The editor state
 * @returns The document before the unconfirmed steps were applied
 */
export function getDocBeforeUnconfirmedSteps(state: EditorState) {
	const tr = state.tr;
	const { version, unconfirmed } = collabKey.getState(state) ?? {};

	if (version === undefined || !unconfirmed) {
		return tr.doc;
	}

	// undo unconfirmed steps
	for (let i = unconfirmed.length - 1; i >= 0; i--) {
		tr.step(unconfirmed[i].inverted);
	}

	return tr.doc;
}

/**
 * Sync the document, version and unconfirmed steps from another source.
 * This is used to facilitate tab syncing across multiple tabs while offline, because we no longer have access to the central authority.
 *
 * @param state The editor state
 * @param version the version number of the last update received from the central authority
 * @param docJSON the document corresponding with the version
 * @param unconfirmedSteps the unconfirmed steps that havent been successfully sent to the server yet
 * @returns A transaction that represents the new state of the editor after receiving the new steps, doc and version
 */
export function syncFromAnotherSource(
	state: EditorState,
	version: number,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	docJSON: any,
	unconfirmedSteps: readonly ProseMirrorStep[],
): Transaction {
	const tr = state.tr;
	const doc = state.schema.nodeFromJSON(docJSON);

	const { from, to } = tr.selection;

	tr.replaceWith(0, state.doc.content.size, doc);

	// apply new unconfirmed steps to doc
	for (let i = 0; i < unconfirmedSteps.length; i++) {
		tr.step(unconfirmedSteps[i]);
	}

	const offset = 1; // offset by 1 to account for the initial replace step
	const newUnconfirmed = tr.steps.slice(offset).map((step, i) => {
		const index = i + offset;
		const doc = tr.docs[index];
		return new Rebaseable(step, step.invert(doc), tr);
	});

	// Because we are replacing the entire document from 0 to end, the selection mapping is incorrect.
	// For now, the best we can do is set the selection to the original positions. Otherwise, it will move to the end of the doc on every change.
	tr.setSelection(
		TextSelection.create(
			tr.doc,
			Math.min(from, tr.doc.content.size),
			Math.min(to, tr.doc.content.size),
		),
	);

	return tr
		.setMeta('addToHistory', false)
		.setMeta(collabKey, new CollabState(version, newUnconfirmed));
}

/// Create a transaction that represents a set of new steps received from
/// the authority. Applying this transaction moves the state forward to
/// adjust to the authority's view of the document.
export function receiveTransaction(
	state: EditorState,
	steps: readonly ProseMirrorStep[],
	clientIDs: readonly (string | number)[],
	options: {
		/// When enabled (the default is `false`), if the current
		/// selection is a [text selection](#state.TextSelection), its
		/// sides are mapped with a negative bias for this transaction, so
		/// that content inserted at the cursor ends up after the cursor.
		/// Users usually prefer this, but it isn't done by default for
		/// reasons of backwards compatibility.
		mapSelectionBackward?: boolean;
	} = {},
) {
	// Pushes a set of steps (received from the central authority) into
	// the editor state (which should have the collab plugin enabled).
	// Will recognize its own changes, and confirm unconfirmed steps as
	// appropriate. Remaining unconfirmed steps will be rebased over
	// remote steps.
	const collabState = collabKey.getState(state);
	const version = (collabState?.version || 0) + steps.length;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion,  @typescript-eslint/no-explicit-any
	const ourID: string | number = (collabKey.get(state)!.spec as any).config.clientID;

	// Find out which prefix of the steps originated with us
	let ours = 0;
	// eslint-disable-next-line eqeqeq
	while (ours < clientIDs.length && clientIDs[ours] == ourID) {
		++ours;
	}
	let unconfirmed = collabState?.unconfirmed.slice(ours) || [];
	steps = ours ? steps.slice(ours) : steps;

	// If all steps originated with us, we're done.
	if (!steps.length) {
		return state.tr.setMeta(collabKey, new CollabState(version, unconfirmed));
	}

	const nUnconfirmed = unconfirmed.length;
	const tr = state.tr;
	if (nUnconfirmed) {
		unconfirmed = rebaseSteps(unconfirmed, steps, tr);
	} else {
		for (let i = 0; i < steps.length; i++) {
			tr.step(steps[i]);
		}
		unconfirmed = [];
	}

	const newCollabState = new CollabState(version, unconfirmed);
	if (options && options.mapSelectionBackward && state.selection instanceof TextSelection) {
		tr.setSelection(
			new TextSelection(
				tr.doc.resolve(tr.mapping.map(state.selection.anchor, -1)),
				tr.doc.resolve(tr.mapping.map(state.selection.head, -1)),
			),
		);
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(tr as any).updated &= ~1;
	}
	return tr
		.setMeta('rebased', nUnconfirmed)
		.setMeta('rebasedData', {
			unconfirmedSteps: collabState?.unconfirmed.slice(ours) || [],
			remoteSteps: steps,
			stepsAfterRebase: unconfirmed,
			versionBefore: version,
		})
		.setMeta('addToHistory', false)
		.setMeta(collabKey, newCollabState);
}

/// Provides data describing the editor's unconfirmed steps, which need
/// to be sent to the central authority. Returns null when there is
/// nothing to send.
///
/// `origins` holds the _original_ transactions that produced each
/// steps. This can be useful for looking up time stamps and other
/// metadata for the steps, but note that the steps may have been
/// rebased, whereas the origin transactions are still the old,
/// unchanged objects.
export function sendableSteps(state: EditorState): {
	clientID: number | string;
	origins: readonly Transaction[];
	steps: readonly ProseMirrorStep[];
	version: number;
} | null {
	const collabState = collabKey.getState(state);

	if (!collabState) {
		return null;
	}

	// eslint-disable-next-line eqeqeq
	if (collabState.unconfirmed.length == 0) {
		return null;
	}
	return {
		version: collabState.version,
		steps: collabState.unconfirmed.map((s) => s.step),
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
		clientID: (collabKey.get(state)!.spec as any).config.clientID,
		get origins() {
			return (
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(this as any)._origins ||
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((this as any)._origins = collabState?.unconfirmed.map((s) => s.origin))
			);
		},
	};
}

/// Get the collab state which would holds the version up to which the collab plugin has synced with the central authority.
/// Override getVersion to getCollabState to gain the benefit on analytics / monitoring in collab-provider
/// Override PR: https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/142331/overview
export function getCollabState(state: EditorState): CollabState | undefined {
	return collabKey.getState(state);
}
