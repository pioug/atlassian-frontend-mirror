/**
 * Action Group: evaluation
 *
 * Batch evaluation events — dataset CRUD, job lifecycle, and validation UI events
 * fired from the shared `agent-evaluation` package.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `EvaluationEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

type EvalAttributesBase = {
	objectType?: string;
	objectId?: string;
	containerType?: string;
	containerId?: string;
	actionSubjectId?: string;
};

type BatchEvaluationDatasetSource = 'csvUpload' | 'liveConversations';

type BatchEvaluationDatasetCreateFailedReason =
	// Live conversations
	| 'recordingDisabled'
	| 'noReviewPermission'
	| 'noRecordedConversations'
	| 'noOpeningMessages'
	// CSV upload
	| 'tooManyQuestions'
	| 'multiTurnNotEnabled'
	| 'noValidRows'
	| 'blankPrompt'
	| 'blankExpectedResponse'
	| 'other';

type AgentRubricUpdateFailedReason = 'forbidden' | 'invalid' | 'other';

export type EvaluationEventPayload =
	| ({
			// Dataset created - https://data-portal.internal.atlassian.com/analytics/registry/95585
			actionSubject: 'batchEvaluationDataset';
			action: 'created';
			attributes: {
				totalQuestions: number;
				datasetSource?: BatchEvaluationDatasetSource;
				datasetType?: string;
			};
	  } & EvalAttributesBase)
	| ({
			// Dataset creation failed or blocked - https://data-portal.internal.atlassian.com/analytics/registry/113715
			actionSubject: 'batchEvaluationDataset';
			action: 'createFailed';
			attributes: {
				datasetSource: BatchEvaluationDatasetSource;
				reason: BatchEvaluationDatasetCreateFailedReason;
			};
	  } & EvalAttributesBase)
	| ({
			// Job created - https://data-portal.internal.atlassian.com/analytics/registry/95438
			actionSubject: 'batchEvaluationJob';
			action: 'created';
			attributes: {
				// Not known for re-runs from evaluation history
				datasetSize?: number;
				isDraftAgent?: boolean;
				judgeMode: string | undefined;
				datasetId?: string;
				datasetType?: string | null;
				judgeConfigId?: string;
				trigger?: 'runForm' | 'rerun';
			};
	  } & EvalAttributesBase)
	| ({
			// Dataset deleted - https://data-portal.internal.atlassian.com/analytics/registry/95583
			actionSubject: 'batchEvaluationDataset';
			action: 'deleted';
			attributes: {};
	  } & EvalAttributesBase)
	| ({
			// Question deleted - https://data-portal.internal.atlassian.com/analytics/registry/95584
			actionSubject: 'batchEvaluationDatasetQuestion';
			action: 'deleted';
			attributes: {};
	  } & EvalAttributesBase)
	| ({
			// Results modal viewed - https://data-portal.internal.atlassian.com/analytics/registry/95440
			actionSubject: 'evalResultsModal';
			action: 'viewed';
			attributes: {
				trigger: 'row_action' | 'flag_action';
				judgeMode?: string | null;
			};
	  } & EvalAttributesBase)
	| ({
			// Job completed - https://data-portal.internal.atlassian.com/analytics/registry/95439
			actionSubject: 'batchEvaluationJob';
			action: 'completed';
			attributes: {
				status: string | null;
				durationMs: number | null;
				datasetSize: number | null | undefined;
				judgeMode?: string | null;
			};
	  } & EvalAttributesBase)
	| ({
			// Agent rubric viewed - https://data-portal.internal.atlassian.com/analytics/registry/114361
			actionSubject: 'agentRubric';
			action: 'viewed';
			attributes: {
				trigger: 'tab' | 'runForm';
				isDefaultRubric: boolean;
				canEdit: boolean;
			};
	  } & EvalAttributesBase)
	| ({
			// Agent rubric updated - https://data-portal.internal.atlassian.com/analytics/registry/114362
			actionSubject: 'agentRubric';
			action: 'updated';
			attributes: {
				wasDefaultRubric: boolean;
			};
	  } & EvalAttributesBase)
	| ({
			// Agent rubric update failed - https://data-portal.internal.atlassian.com/analytics/registry/114363
			actionSubject: 'agentRubric';
			action: 'updateFailed';
			attributes: {
				reason: AgentRubricUpdateFailedReason;
			};
	  } & EvalAttributesBase);
