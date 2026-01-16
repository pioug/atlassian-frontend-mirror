import {
	AnalyticsStep,
	InsertTypeAheadStep,
	LinkMetaStep,
	SetAttrsStep,
} from '@atlaskit/adf-schema/steps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	AddMarkStep,
	AddNodeMarkStep,
	AttrStep,
	DocAttrStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';

import type { TrackSpammingStepsMetadata } from '../types';

const THRESHOLD = 50; // 50 milliseconds

export type RecentTransactionTimestamp = {
	steps: Step[];
	timestamp: number;
};

export type RecentTransactionTimestamps = Map<string, RecentTransactionTimestamp>;

export type TrackFilteredTransaction = (tr: Transaction) => void;
export type SanitizedFilteredStep = {
	attr?: string;
	markType?: string;
	stepInstance?: string;
	stepType: string;
};

/**
 * Sanitizes a given ProseMirror step by extracting its type and non-UCG relevant attributes.
 *
 * @param {Step} step - The ProseMirror step to be sanitized.
 * @returns {SanitizedFilteredStep} - The sanitized step with only necessary information.
 *
 * @example
 * ```
 * const step = new AttrStep(10, 'colwidth', [123, 451] );
 * const sanitized = sanitizeFilteredStep(step);
 *
 * // Output: { stepType: 'attr', stepInstance: 'AttrStep', attr: 'example' }
 * ```
 */
export const sanitizeFilteredStep = (step: Step): SanitizedFilteredStep => {
	const serializedStep = step.toJSON();
	const sanitizedStep: SanitizedFilteredStep = {
		stepType: serializedStep.stepType,
		stepInstance: 'unknown',
	};

	if (step instanceof AttrStep) {
		sanitizedStep.attr = step.attr;
		sanitizedStep.stepInstance = 'AttrStep';
	} else if (step instanceof DocAttrStep) {
		sanitizedStep.attr = step.attr;
		sanitizedStep.stepInstance = 'DocAttrStep';
	} else if (step instanceof SetAttrsStep) {
		// Combines all attrs keys separated by _ to one single string
		sanitizedStep.attr = Object.keys(step.attrs).sort().join('_');
		sanitizedStep.stepInstance = 'SetAttrsStep';
	} else if (step instanceof AddMarkStep) {
		sanitizedStep.markType = step.mark.type.name;
		sanitizedStep.stepInstance = 'AddMarkStep';
	} else if (step instanceof RemoveMarkStep) {
		sanitizedStep.markType = step.mark.type.name;
		sanitizedStep.stepInstance = 'RemoveMarkStep';
	} else if (step instanceof RemoveNodeMarkStep) {
		sanitizedStep.markType = step.mark.type.name;
		sanitizedStep.stepInstance = 'RemoveNodeMarkStep';
	} else if (step instanceof AddNodeMarkStep) {
		sanitizedStep.markType = step.mark.type.name;
		sanitizedStep.stepInstance = 'AddNodeMarkStep';
	} else if (step instanceof ReplaceStep) {
		sanitizedStep.stepInstance = 'ReplaceStep';
	} else if (step instanceof ReplaceAroundStep) {
		sanitizedStep.stepInstance = 'ReplaceAroundStep';
	} else if (step instanceof AnalyticsStep) {
		sanitizedStep.stepInstance = 'AnalyticsStep';
	} else if (step instanceof InsertTypeAheadStep) {
		sanitizedStep.stepInstance = 'InsertTypeAheadStep';
	} else if (step instanceof LinkMetaStep) {
		sanitizedStep.stepInstance = 'LinkMetaStep';
	}

	return sanitizedStep;
};

export const createFilterTransaction = (
	recentTransactionsTimestamps: RecentTransactionTimestamps,
	trackFilteredTransaction: TrackFilteredTransaction,
) => {
	return (tr: Transaction): boolean => {
		if (Boolean(tr.getMeta('appendTransaction'))) {
			return true;
		}

		const isRemote = Boolean(tr.getMeta('isRemote'));

		if (isRemote) {
			return true;
		}

		const containsExcludedSteps = tr.steps.some((step) => {
			return (
				step instanceof AnalyticsStep ||
				step instanceof ReplaceStep ||
				step instanceof ReplaceAroundStep ||
				step instanceof LinkMetaStep
			);
		});

		if (containsExcludedSteps) {
			return true;
		}

		if (tr.docChanged && tr.doc.eq(tr.before)) {
			const transactionKey = generateTransactionKey(tr);

			if (!transactionKey) {
				return true;
			}

			//Clean up tracked transactions when time over threshold
			recentTransactionsTimestamps.forEach((value, key) => {
				if (tr.time - value.timestamp > THRESHOLD) {
					// Delete tracked transaction when over threshold
					recentTransactionsTimestamps.delete(key);
				}
			});

			const lastTransactionEntry = recentTransactionsTimestamps.get(transactionKey);
			if (!lastTransactionEntry) {
				// If no timestamp exists for the given transaction, allow transaction and add an entry
				recentTransactionsTimestamps.set(transactionKey, { timestamp: tr.time, steps: tr.steps });
				return true;
			}

			// Track analytics for the filtered transaction
			trackFilteredTransaction(tr);

			// Filter transaction
			return false;
		}
		return true; // Allow the transaction
	};
};

// Helper function to create a u ique transaction key
export function generateTransactionKey(tr: Transaction): string {
	const stepPositions = tr.steps.map((step) => {
		if (
			step instanceof RemoveNodeMarkStep ||
			step instanceof AddNodeMarkStep ||
			step instanceof SetAttrsStep ||
			step instanceof AttrStep
		) {
			if (step.pos !== undefined) {
				return `${step.pos}`;
			}
		} else if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
			return `from_${step.from}_to_${step.to}`;
		} else if (step instanceof InsertTypeAheadStep) {
			return `insertTypeAheadStep`;
		}
		return '';
	});
	if (stepPositions.some((step) => Boolean(step))) {
		return stepPositions.join('_');
	}
	return '';
}

export const trackSpammingStepsPluginKey = new PluginKey<TrackSpammingStepsMetadata>(
	'trackAndFilterSpammingStepsPluginKey',
);

export const createPlugin = (trackFilteredTransaction: TrackFilteredTransaction) => {
	const recentTransactionsTimestamps = new Map<string, RecentTransactionTimestamp>();
	return new SafePlugin<TrackSpammingStepsMetadata>({
		key: trackSpammingStepsPluginKey,
		filterTransaction: createFilterTransaction(
			recentTransactionsTimestamps,
			trackFilteredTransaction,
		),
	});
};
