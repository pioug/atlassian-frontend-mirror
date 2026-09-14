import { type EvaluationDetails as NewEvaluationDetails } from '@statsig/js-client';

import { type EvaluationDetails, EvaluationReason } from './compat/types';

const evaluationReasonMappings = Object.entries(EvaluationReason).map<[string, EvaluationReason]>(
	([key, value]) => [key.toLowerCase(), value],
);

export const migrateEvaluationDetails = (details: NewEvaluationDetails): EvaluationDetails => {
	const reasonLower = details.reason.toLowerCase();
	return {
		reason:
			evaluationReasonMappings.find(([key]) => reasonLower.includes(key))?.[1] ??
			EvaluationReason.Unknown,
		time: details.receivedAt ?? Date.now(),
	};
};
