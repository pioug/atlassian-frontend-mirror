import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import type { CollabEditPlugin } from '../collabEditPluginType';

import { trackLastOrganicChangePluginKey } from './track-last-organic-change';
import { groupSteps, sanitizeStep } from './track-steps';

export type OrganicMetadataAnalytics = {
	endedAt: number;
	isFirstChange: boolean;
	startedAt: number;
	stepTypesAmount: {
		[key: string]: number;
	};
	transactions: number;
};

type OrganicCacheType = {
	endedAt: number;
	isFirstChange: boolean;
	startedAt: number;
	steps: ReadonlyArray<Step>;
	transactions: number;
}[];

// This is essentially a queue of cached events. When the background task runs to send these items then this queue is flushed.
const organicReportingCache: OrganicCacheType = [];

type TrackProps = {
	api: ExtractInjectionAPI<CollabEditPlugin> | undefined;
	newEditorState: EditorState;
	oldEditorState: EditorState;
	onDataProcessed: (data: OrganicMetadataAnalytics[]) => void;
	transactions: Readonly<Transaction[]>;
};

// Every ten seconds we will try to process the step data.
const LOW_PRIORITY_DELAY = 10000;

// See https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/
type Scheduler = {
	postTask: (
		cb: () => void,
		options: {
			delay: number;
			priority: 'background';
		},
	) => Promise<unknown>;
};

export const getScheduler = (
	// Our TypeScript configuration isn't ready for the Scheduler API https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/ (yet)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	obj: any,
): Scheduler | null => {
	if (!obj) {
		return null;
	}

	if ('scheduler' in obj) {
		return obj.scheduler;
	}

	return null;
};

/**
 * Processes the steps metadata from the cache and calls the callback function with the processed data.
 *
 * @param {OrganicCacheType} cache - A cache containing steps metadata.
 * @param {(data: OrganicMetadataAnalytics[]) => void} onDataProcessed - Callback function to be called with the processed data.
 */
const task = (
	cache: OrganicCacheType,
	onDataProcessed: (data: OrganicMetadataAnalytics[]) => void,
) => {
	const data: OrganicMetadataAnalytics[] = [];

	for (const item of cache) {
		const { steps, ...rest } = item;
		// We'll use the same grouping and sanitize logic from the track-steps util
		const stepTypesAmount = groupSteps(steps.map(sanitizeStep));

		data.push({
			...rest,
			stepTypesAmount,
		});
	}

	// clear the cache.
	cache.length = 0;

	if (data.length > 0) {
		onDataProcessed(data);
	}
};

/**
 * Tracks the steps sent by the client by storing them in a cache and scheduling a task to process them. Once the steps are processed, the onDataProcessed callabck will be called.
 *
 * This is a non-critical code. If the browser doesn't support the Scheduler API https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/
 *
 * @param {TrackProps} props - The properties required for tracking steps.
 * @param {ExtractInjectionAPI<CollabEditPlugin> | undefined} props.api - The API for the CollabEdit plugin.
 * @param {EditorState} props.newEditorState - The new editor state.
 * @param {Readonly<Transaction[]>} props.transactions - The transactions that contain the steps.
 * @param {(data: OrganicMetadataAnalytics[]) => void} props.onDataProcessed - Callback function to be called with the processed data.
 */
export const monitorOrganic = ({
	newEditorState,
	oldEditorState,
	transactions,
	onDataProcessed,
}: TrackProps): void => {
	// We can exclude analytic steps since they should never trigger an organic change.
	const newSteps = transactions
		.flatMap((t) => t.steps)
		.filter((step) => !(step instanceof AnalyticsStep));
	const scheduler = getScheduler(window);

	if (!newSteps.length || !scheduler) {
		return;
	}

	// We know that an organic change during startup will trigger a draft sync which will;
	// fire editor edited event ->  confluence/next/packages/editor-features/src/hooks/useDraftSync/useDraftSync.tsx
	// and call triggerUpdate() notifying the BE that user edited the page -> confluence/next/packages/editor-features/src/hooks/useDraftSync/useEditorDraftSyncAction.tsx
	// This can cause a problem with statsig metrics if organic changes are being incorrectly reported, ie an automated change
	// occurs which contributes the user towards editing a page when in fact they didn't edit the page.
	//
	const oldPluginState = trackLastOrganicChangePluginKey.getState(oldEditorState);
	const newPluginState = trackLastOrganicChangePluginKey.getState(newEditorState);

	if (
		newSteps.length &&
		oldPluginState?.lastLocalOrganicBodyChangeAt !== newPluginState?.lastLocalOrganicBodyChangeAt
	) {
		const now = Date.now();
		const isFirstChange = !oldPluginState?.lastLocalOrganicBodyChangeAt;

		// Check if we should compact with the previous entry (within 2 seconds) this means with a possible 10sec delay
		// due to the postTask we could have a potential 5 grouped organic changes listed.
		const shouldCompact =
			organicReportingCache.length > 0 &&
			now - organicReportingCache[organicReportingCache.length - 1].startedAt < 2000;

		if (shouldCompact) {
			// Compact with previous entry
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const prev = organicReportingCache.pop()!; // We know it exists due to shouldCompact check

			// tr.docChanged
			organicReportingCache.push({
				transactions: prev.transactions + 1,
				startedAt: prev.startedAt,
				endedAt: now,
				isFirstChange: prev.isFirstChange || isFirstChange,
				steps: prev.steps.concat(newSteps),
			});
		} else {
			// Add new entry
			organicReportingCache.push({
				transactions: 1,
				startedAt: now,
				endedAt: now,
				isFirstChange,
				steps: newSteps,
			});
		}

		if (organicReportingCache.length === 1) {
			scheduler.postTask(
				() => {
					task(organicReportingCache, onDataProcessed);
				},
				{
					priority: 'background',
					delay: LOW_PRIORITY_DELAY,
				},
			);
		}
	}
};
