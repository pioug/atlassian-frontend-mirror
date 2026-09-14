/**
 * Session-bound store for MAUI (remix) editable-text values, keyed by embed,
 * revision, and version. Part of the MAUI reload-free undo/redo (gate
 * `platform_editor_maui_remix_app_id`).
 *
 * Why this lives in `native-embeds-common` rather than the editor plugin: the
 * store is managed by the native-embeds editor plugin from edit and version
 * events, but the value must also be read by `native-embeds-editor-extension`
 * when it renders the embed, to feed the reload-free apply down to the child.
 * The plugin already depends on the
 * extension, so a store physically inside the plugin package could not be read
 * by the extension without a dependency cycle. `native-embeds-common` is the
 * cycle-free package both sides already depend on.
 *
 * The map is a plain module-level singleton: session-lifetime, never serialized
 * to ADF, and intentionally not part of any ProseMirror plugin state (so it
 * carries no undo/redo baggage of its own — undo/redo of the *version pointer*
 * lives in editor history; this map only answers "what were the slot values at
 * version X?").
 */

export interface RemixSlotValue {
	slot: string;
	value: string;
}

/**
 * `localId → (versionId or revisionId → { slot: value })`.
 *
 * Each version and revision holds a full snapshot of the edited slots at that
 * point, so undo and redo can restore its text. Unedited slots are absent.
 */
const slotValuesByEmbed = new Map<string, Map<string, Record<string, string>>>();
const slotValuesByRevisionByEmbed = new Map<string, Map<string, Record<string, string>>>();
const versionByRevisionByEmbed = new Map<string, Map<string, string>>();

const getEmbedMap = (localId: string): Map<string, Record<string, string>> => {
	let perEmbed = slotValuesByEmbed.get(localId);
	if (!perEmbed) {
		perEmbed = new Map<string, Record<string, string>>();
		slotValuesByEmbed.set(localId, perEmbed);
	}
	return perEmbed;
};

const getRevisionMap = (localId: string): Map<string, Record<string, string>> => {
	let perEmbed = slotValuesByRevisionByEmbed.get(localId);
	if (!perEmbed) {
		perEmbed = new Map<string, Record<string, string>>();
		slotValuesByRevisionByEmbed.set(localId, perEmbed);
	}
	return perEmbed;
};

const saveRevisionSnapshot = (
	localId: string,
	revisionId: string,
	snapshot: Record<string, string>,
): void => {
	const savedSnapshot = { ...snapshot };
	getRevisionMap(localId).set(revisionId, savedSnapshot);
	const versionId = versionByRevisionByEmbed.get(localId)?.get(revisionId);
	if (versionId) {
		getEmbedMap(localId).set(versionId, savedSnapshot);
	}
};

export const recordRemixRevisionEdit = ({
	currentVersionId,
	localId,
	previousRevisionId,
	previousValue,
	revisionId,
	slot,
	value,
}: {
	currentVersionId?: string;
	localId: string;
	previousRevisionId?: string;
	previousValue: string;
	revisionId: string;
	slot: string;
	value: string;
}): void => {
	if (!localId || !revisionId || !slot) {
		return;
	}
	const versionSnapshots = getEmbedMap(localId);
	const revisionSnapshots = getRevisionMap(localId);
	const previousRevisionSnapshot = previousRevisionId
		? revisionSnapshots.get(previousRevisionId)
		: undefined;
	const currentVersionSnapshot = currentVersionId
		? versionSnapshots.get(currentVersionId)
		: undefined;
	let baseSnapshot = previousRevisionSnapshot ?? currentVersionSnapshot ?? {};

	if (!(slot in baseSnapshot)) {
		baseSnapshot = { ...baseSnapshot, [slot]: previousValue };
		if (previousRevisionId && previousRevisionId !== revisionId) {
			saveRevisionSnapshot(localId, previousRevisionId, baseSnapshot);
		}
	}
	if (currentVersionId) {
		const snapshot = versionSnapshots.get(currentVersionId) ?? {};
		if (!(slot in snapshot)) {
			versionSnapshots.set(currentVersionId, { ...snapshot, [slot]: previousValue });
		}
	}

	const revisionSnapshot = revisionSnapshots.get(revisionId) ?? baseSnapshot;
	saveRevisionSnapshot(localId, revisionId, { ...revisionSnapshot, [slot]: value });
};

/**
 * Record the single edit that produced a new version, extending the incremental
 * per-version snapshots.
 *
 * - `prevVersionId` snapshot is seeded with the slot's `previousValue` (once, if
 *   not already known) so that undoing back to it restores the pre-edit text.
 * - `newVersionId` snapshot = the previous snapshot with the edited slot set to
 *   its new `value`.
 *
 * All fields except `newVersionId` are best-effort: with no `slot`/`value` the
 * new version simply inherits the previous snapshot; with no `prevVersionId`
 * (e.g. the embed had no stored version yet) the base snapshot is not seeded.
 */
export const recordRemixSlotValues = ({
	localId,
	prevVersionId,
	newVersionId,
	slot,
	previousValue,
	value,
}: {
	localId: string;
	newVersionId: string;
	previousValue?: string;
	prevVersionId?: string;
	slot?: string;
	value?: string;
}): void => {
	if (!localId || !newVersionId) {
		return;
	}
	const perEmbed = getEmbedMap(localId);

	let prevSnapshot = (prevVersionId && perEmbed.get(prevVersionId)) || {};
	if (prevVersionId && slot && previousValue !== undefined && !(slot in prevSnapshot)) {
		// Seed the pre-edit value on the previous version once, so undo restores it.
		prevSnapshot = { ...prevSnapshot, [slot]: previousValue };
		perEmbed.set(prevVersionId, prevSnapshot);
	}

	const newSnapshot =
		slot && value !== undefined ? { ...prevSnapshot, [slot]: value } : { ...prevSnapshot };
	perEmbed.set(newVersionId, newSnapshot);
};

export const seedRemixSlotValue = (
	localId: string,
	versionId: string,
	slot: string,
	value: string,
): void => {
	if (!localId || !versionId || !slot) {
		return;
	}
	const perEmbed = getEmbedMap(localId);
	const snapshot = perEmbed.get(versionId) ?? {};
	if (slot in snapshot) {
		return;
	}
	perEmbed.set(versionId, { ...snapshot, [slot]: value });
};

/**
 * Return the full slot snapshot for a version as an array, or `undefined` when
 * nothing is recorded for that embed/version (e.g. the base version before any
 * edit, or a version created in another session).
 */
export const getRemixSlotValues = (
	localId: string | undefined,
	versionId: string | undefined,
): RemixSlotValue[] | undefined => {
	if (!localId || !versionId) {
		return undefined;
	}
	const snapshot = slotValuesByEmbed.get(localId)?.get(versionId);
	if (!snapshot) {
		return undefined;
	}
	return Object.entries(snapshot).map(([slot, value]) => ({ slot, value }));
};

export const recordRemixRevisionVersion = (
	localId: string,
	revisionId: string,
	versionId: string,
): void => {
	if (!localId || !revisionId || !versionId) {
		return;
	}
	let versions = versionByRevisionByEmbed.get(localId);
	if (!versions) {
		versions = new Map<string, string>();
		versionByRevisionByEmbed.set(localId, versions);
	}
	versions.set(revisionId, versionId);
	const snapshot = slotValuesByRevisionByEmbed.get(localId)?.get(revisionId);
	if (snapshot) {
		getEmbedMap(localId).set(versionId, { ...snapshot });
	}
};

export const getRemixVersionForRevision = (
	localId: string | undefined,
	revisionId: string | undefined,
): string | undefined => {
	if (!localId || !revisionId) {
		return undefined;
	}
	return versionByRevisionByEmbed.get(localId)?.get(revisionId);
};

/** Test-only: clear the whole store. */
export const resetRemixSlotStore = (): void => {
	slotValuesByEmbed.clear();
	slotValuesByRevisionByEmbed.clear();
	versionByRevisionByEmbed.clear();
};
