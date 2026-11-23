import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { replaceStickyState } from './commands';
import { pluginKey } from './plugin-key';
import type { RowStickyState, StickyPluginState } from './types';

/**
 * Reports whether a header row's legacy (`position: fixed`) sticky header is engaged.
 *
 * Each live header row owns its own entry. The sticky plugin state is rebuilt from the live
 * entries as a whole snapshot, so a row that is destroyed, cleaned up or re-created can never
 * leave a stale "sticky" entry behind.
 */
export type StickyStateReporter = {
	reportStuck: (top: number, padding: number) => void;
	reportUnstuck: () => void;
};

type StuckRow = {
	getPos: () => number | undefined;
	padding: number;
	top: number;
};

type StuckRowRegistry = {
	isFlushQueued: boolean;
	rows: Map<StickyStateReporter, StuckRow>;
};

const unreportedOffset = { top: 0, padding: 0 };

const registries = new WeakMap<EditorView, StuckRowRegistry>();

const getRegistry = (view: EditorView): StuckRowRegistry => {
	let registry = registries.get(view);
	if (!registry) {
		registry = { isFlushQueued: false, rows: new Map() };
		registries.set(view, registry);
	}
	return registry;
};

const getLivePos = (getPos: () => number | undefined): number | undefined => {
	try {
		const pos = getPos();
		return typeof pos === 'number' && Number.isFinite(pos) ? pos : undefined;
	} catch {
		// getPos can throw or return stale values for a node view that is being torn down
		return undefined;
	}
};

const buildSnapshot = (registry: StuckRowRegistry): StickyPluginState => {
	const snapshot: StickyPluginState = [];
	registry.rows.forEach((row) => {
		const pos = getLivePos(row.getPos);
		if (pos !== undefined) {
			snapshot.push({ pos, sticky: true, top: row.top, padding: row.padding });
		}
	});
	return snapshot.sort((a, b) => a.pos - b.pos);
};

const isSameRowState = (a: RowStickyState, b: RowStickyState): boolean =>
	a.pos === b.pos && a.top === b.top && a.padding === b.padding;

const isSameSnapshot = (current: StickyPluginState, next: StickyPluginState): boolean => {
	const currentSticky = current.filter((row) => row.sticky).sort((a, b) => a.pos - b.pos);
	return (
		currentSticky.length === next.length &&
		currentSticky.every((row, index) => isSameRowState(row, next[index]))
	);
};

/**
 * Dispatching from node view `destroy()` or from inside a plugin state event is unsafe, so
 * changes are collected synchronously and written in one transaction after the current update.
 */
const scheduleFlush = (view: EditorView, registry: StuckRowRegistry) => {
	if (registry.isFlushQueued) {
		return;
	}
	registry.isFlushQueued = true;

	queueMicrotask(() => {
		registry.isFlushQueued = false;
		if (view.isDestroyed) {
			return;
		}

		const snapshot = buildSnapshot(registry);
		if (isSameSnapshot(pluginKey.getState(view.state) ?? [], snapshot)) {
			return;
		}

		replaceStickyState(snapshot)(view.state, view.dispatch, view);
	});
};

const createRegistryStickyStateReporter = (
	view: EditorView,
	getPos: () => number | undefined,
): StickyStateReporter => {
	const registry = getRegistry(view);

	const reporter: StickyStateReporter = {
		reportStuck: (top, padding) => {
			// Matches the existing row logic: an unreported row counts as offset 0/0, so a first
			// report of 0/0 is skipped. Hosts whose scroller starts at y=0 would otherwise pin
			// the numbered column at its static position.
			const current = registry.rows.get(reporter) ?? unreportedOffset;
			if (current.top === top && current.padding === padding) {
				return;
			}

			registry.rows.set(reporter, { getPos, top, padding });
			scheduleFlush(view, registry);
		},
		reportUnstuck: () => {
			if (registry.rows.delete(reporter)) {
				scheduleFlush(view, registry);
			}
		},
	};

	return reporter;
};

/**
 * Picks how a header row reports its legacy sticky state. This is the only experiment check.
 *
 * @returns the registry-backed reporter for the experiment's test cohort, or `null` so the
 * caller keeps its existing per-row dispatch logic.
 */
export const createStickyStateReporter = (
	view: EditorView,
	getPos: () => number | undefined,
): StickyStateReporter | null => {
	if (!isExperimentEnabled('platform_editor_table_stale_sticky_header')) {
		return null;
	}
	return createRegistryStickyStateReporter(view, getPos);
};
