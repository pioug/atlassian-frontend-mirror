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
	RemoveMarkStep,
	RemoveNodeMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

import type { TrackSpammingStepsMetadata } from '../types';

const THRESHOLD = 50; // 50 milliseconds

export type RecentTransactionTimestamp = {
	timestamp: number;
	steps: Step[];
};

export type RecentTransactionTimestamps = Map<string, RecentTransactionTimestamp>;

export type TrackFilteredTransaction = (tr: Transaction) => void;

export const createFilterTransaction = (
	recentTransactionsTimestamps: RecentTransactionTimestamps,
	trackFilteredTransaction: TrackFilteredTransaction,
) => {
	return (tr: Transaction) => {
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
				step instanceof ReplaceAroundStep
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
			if (fg('platform_editor_filter_spamming_transactions')) {
				// Filter transaction
				return false;
			}
		}
		return true; // Allow the transaction
	};
};

// Helper function to create a u ique transaction key
export function generateTransactionKey(tr: Transaction) {
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
		} else if (step instanceof LinkMetaStep) {
			return `from_${step.toJSON().from}_to_${step.toJSON().to}`;
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
