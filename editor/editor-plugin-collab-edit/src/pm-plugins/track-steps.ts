import { AnalyticsStep, SetAttrsStep, BatchAttrsStep } from '@atlaskit/adf-schema/steps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	AddMarkStep,
	AddNodeMarkStep,
	AttrStep,
	DocAttrStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
} from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { sendableSteps } from '@atlaskit/prosemirror-collab';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { CollabEditPlugin } from '../collabEditPluginType';

import { updateNcsSessionStepMetrics } from './track-step-metrics';

function groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
	// Check group by exists, and that it's a function. If so, use the native browser code
	if ('groupBy' in Object && typeof Object.groupBy === 'function') {
		// @ts-ignore TS2322 - Type 'Partial<Record<string, T[]>>' is not assignable to type 'Record<string, T[]>'.
		return Object.groupBy(array, keyGetter);
	}

	// Fallback to custom implementation
	const map: Record<string, T[]> = {};
	array.forEach((item) => {
		const key = keyGetter(item);
		if (!map[key]) {
			map[key] = [];
		}
		map[key].push(item);
	});
	return map;
}

export type SanitizedStep = {
	attr?: string;
	markType?: string;
	stepType: string;
};

export type StepMetadataAnalytics = {
	endedAt: number;
	startedAt: number;
	stepTypesAmount: {
		[key: string]: number;
	};
};

/**
 * Sanitizes a given ProseMirror step by extracting its type and non-UCG relevant attributes.
 *
 * @param {Step} step - The ProseMirror step to be sanitized.
 * @returns {SanitizedStep} - The sanitized step with only necessary information.
 *
 * @example
 * ```
 * const step = new AttrStep(10, 'colwidth', [123, 451] );
 * const sanitized = sanitizeStep(step);
 *
 * // Output: { stepType: 'attr', attr: 'example' }
 * ```
 */
export const sanitizeStep = (step: Step): SanitizedStep => {
	const serializedStep = step.toJSON();
	const sanitizedStep: SanitizedStep = {
		stepType: serializedStep.stepType,
	};

	if (step instanceof AttrStep || step instanceof DocAttrStep) {
		sanitizedStep.attr = step.attr;
	} else if (step instanceof SetAttrsStep) {
		// Combines all attrs keys separated by _ to one single string
		sanitizedStep.attr = Object.keys(step.attrs).sort().join('_');
	} else if (
		step instanceof AddMarkStep ||
		step instanceof RemoveMarkStep ||
		step instanceof RemoveNodeMarkStep ||
		step instanceof AddNodeMarkStep
	) {
		sanitizedStep.markType = step.mark.type.name;
	} else if (step instanceof BatchAttrsStep) {
		const batched = step.data.map(
			({ nodeType, attrs }) => `${nodeType}_${Object.keys(attrs).sort().join('_')}`,
		);
		sanitizedStep.attr = batched.sort().join('_');
	}

	return sanitizedStep;
};

/**
 * Groups sanitized steps by their type and counts their occurrences.
 *
 * @param {SanitizedStep[]} sanitizedSteps - An array of sanitized steps.
 * @returns {Record<string, number>} - An object where keys are step types and values are their counts.
 *
 * @example
 * ```
 * const input = [
 *   { stepType: 'attr', attr: 'colwidth' },
 *   { stepType: 'mark', markType: 'bold' },
 *   { stepType: 'attr', attr: 'colwidth' }
 * ];
 *
 * const grouped = groupSteps(input);
 * // Output: { 'attr_example': 2, 'mark_bold': 1 }
 * ```
 */
export const groupSteps = (sanitizedSteps: SanitizedStep[]): Record<string, number> => {
	const grouped = groupBy(sanitizedSteps, (e) => Object.values(e).join('_'));

	return Object.entries(grouped).reduce(
		(acc, [key, value]) => {
			acc[key] = Array.isArray(value) ? value.length : 0;
			return acc;
		},
		{} as Record<string, number>,
	);
};

/**
 * Processes the steps metadata from the cache and calls the callback function with the processed data.
 *
 * @param {CacheType} cache - A cache containing steps metadata.
 * @param {(data: StepMetadataAnalytics[]) => void} onTrackDataProcessed - Callback function to be called with the processed data.
 */
export const task = (
	cache: CacheType,
	onTrackDataProcessed: (data: StepMetadataAnalytics[]) => void,
): void => {
	const stepsMetadata: StepMetadataAnalytics[] = [];

	for (const entry of cache.values()) {
		const { startedAt, endedAt, steps } = entry;

		const stepTypesAmount = groupSteps(steps.map(sanitizeStep));

		stepsMetadata.push({
			startedAt,
			endedAt,
			stepTypesAmount,
		});
	}

	cache.clear();

	if (stepsMetadata.length > 0) {
		onTrackDataProcessed(stepsMetadata);
	}
};

export type CacheType = Map<
	number,
	{
		endedAt: number;
		startedAt: number;
		steps: ReadonlyArray<Step>;
	}
>;
const stepsSentCache: CacheType = new Map();

type TrackProps = {
	api: ExtractInjectionAPI<CollabEditPlugin> | undefined;
	newEditorState: EditorState;
	onTrackDataProcessed: (data: StepMetadataAnalytics[]) => void;
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
const getScheduler = (
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
 * Tracks the steps sent by the client by storing them in a cache and scheduling a task to process them. Once the steps are processed, the onTrackDataProcessed callabck will be called.
 *
 * This is a non-critical code. If the browser doesn't support the Scheduler API https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/
 *
 * @param {TrackProps} props - The properties required for tracking steps.
 * @param {ExtractInjectionAPI<CollabEditPlugin> | undefined} props.api - The API for the CollabEdit plugin.
 * @param {EditorState} props.newEditorState - The new editor state.
 * @param {Readonly<Transaction[]>} props.transactions - The transactions that contain the steps.
 * @param {(data: StepMetadataAnalytics[]) => void} props.onTrackDataProcessed - Callback function to be called with the processed data.
 */
export const track = ({
	api,
	newEditorState,
	transactions,
	onTrackDataProcessed,
}: TrackProps): void => {
	const newSteps = transactions.flatMap((t) => t.steps);
	const collabState = sendableSteps(newEditorState);
	const scheduler = getScheduler(window);

	if (!newSteps.length || !scheduler || !collabState) {
		return;
	}

	const { version } = collabState;
	const buffer = stepsSentCache.get(version);
	const startedAt = buffer?.startedAt || Date.now();
	const endedAt = Date.now();
	const steps = (buffer?.steps || []).concat(newSteps);

	stepsSentCache.set(version, {
		startedAt,
		endedAt,
		steps,
	});

	updateNcsSessionStepMetrics({
		api,
		steps: editorExperiment('platform_editor_reduce_noisy_steps_ncs', true)
			? newSteps.filter((step) => !(step instanceof AnalyticsStep))
			: newSteps,
	});

	scheduler.postTask(
		() => {
			task(stepsSentCache, onTrackDataProcessed);
		},
		{
			priority: 'background',
			delay: LOW_PRIORITY_DELAY,
		},
	);
};
