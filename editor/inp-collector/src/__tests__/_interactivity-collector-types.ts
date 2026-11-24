/**
 * Type tests of the collector: compiled by the package's type check and never run, since the
 * leading underscore keeps Jest off them. A `@ts-expect-error` that stops failing fails the check.
 */
import { InteractivityCollector } from '../collector/interactivity-collector';
import type { InterimReason, SessionKeys } from '../collector/types';

type SessionMode = 'editing' | 'reading';

declare function readObjectId(): string | undefined;
declare function readSessionMode(): SessionMode | undefined;

/** A collector. */
export function typesOfACollector(): void {
	const collector = new InteractivityCollector({
		regions: ['editor', 'toolbar'],
		endReasons: ['navigation', 'unmount'],
		sessionKeys: { objectId: readObjectId(), mode: readSessionMode() },
		onError: () => {},
		emit: ({ reason, regions, sessionKeys }) => {
			const snapshotReason: InterimReason | 'navigation' | 'unmount' = reason;
			const editor = regions.editor.all;
			const mode: SessionMode | undefined = sessionKeys.mode;
			void [snapshotReason, editor, mode];

			// @ts-expect-error a region the collector was not created with
			void regions.sidebar;
			// @ts-expect-error a session key the collector was not created with
			void sessionKeys.spaceId;
		},
	});

	collector.region('toolbar');
	// @ts-expect-error a region the collector was not created with
	collector.region('sidebar');

	collector.setSessionKeys({ values: { mode: 'reading' }, endReason: 'navigation' });
	// @ts-expect-error a session key the collector was not created with
	collector.setSessionKeys({ values: { spaceId: 'space-1' }, endReason: 'navigation' });
	// @ts-expect-error a value the session key does not take
	collector.setSessionKeys({ values: { mode: 'presenting' }, endReason: 'navigation' });
	// @ts-expect-error an end reason the collector was not created with
	collector.setSessionKeys({ values: { mode: 'reading' }, endReason: 'redirect' });

	collector.stop({ endReason: 'unmount' });
	// @ts-expect-error an end reason the collector was not created with
	collector.stop({ endReason: 'redirect' });
	// @ts-expect-error a reason the collector takes interim snapshots with
	collector.stop({ endReason: 'timer' });
}

/** Reserved end reasons. */
export function typesOfReservedEndReasons(): void {
	new InteractivityCollector({
		regions: [],
		// @ts-expect-error a snapshot's `reason` would not tell whether the session ended
		endReasons: ['navigation', 'timer'],
		sessionKeys: {},
		onError: () => {},
		emit: () => {},
	});
}

/** A collector without regions. */
export function typesOfACollectorWithoutRegions(): void {
	const collector = new InteractivityCollector({
		regions: [],
		endReasons: ['unmount'],
		sessionKeys: {},
		onError: () => {},
		emit: () => {},
	});

	// @ts-expect-error it has no regions
	collector.region('editor');
}

/** A collector without error reporting. */
export function typesOfACollectorWithoutErrorReporting(): void {
	// @ts-expect-error what the collector could not do would go unnoticed
	new InteractivityCollector({
		regions: [],
		endReasons: ['unmount'],
		sessionKeys: {},
		emit: () => {},
	});
}

/** Names known only at runtime. */
export function typesOfNamesKnownOnlyAtRuntime(
	regions: string[],
	endReasons: string[],
	sessionKeys: SessionKeys,
): void {
	new InteractivityCollector({
		// @ts-expect-error any string would pass as a region
		regions,
		endReasons: ['unmount'],
		sessionKeys: {},
		onError: () => {},
		emit: () => {},
	});
	new InteractivityCollector({
		regions: [],
		// @ts-expect-error any string would pass as an end reason
		endReasons,
		sessionKeys: {},
		onError: () => {},
		emit: () => {},
	});
	new InteractivityCollector({
		regions: [],
		endReasons: ['unmount'],
		// @ts-expect-error any string would pass as a session key
		sessionKeys,
		onError: () => {},
		emit: () => {},
	});
}

/** Names written out as `as const` lists. */
export function typesOfConstLists(): void {
	const collector = new InteractivityCollector({
		regions: ['editor'] as const,
		endReasons: ['unmount'] as const,
		sessionKeys: {},
		onError: () => {},
		emit: () => {},
	});

	collector.region('editor');
	collector.stop({ endReason: 'unmount' });
}
