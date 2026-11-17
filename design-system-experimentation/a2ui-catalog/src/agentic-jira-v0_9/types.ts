/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog types file: one inferred props type per component plus the name/instance unions (mirrors `../v0_9/types.ts`). */

/**
 * Inferred prop types for the Agentic Jira v0.9 catalog
 * (`com.atlassian.agentic-jira/v0_9/v1`).
 */

import type { z } from 'zod';

import type {
	MultipleChoiceQuestionsSchema,
	RepositoryPickerSchema,
	ToolApprovalSchema,
} from './schemas';

export type AgenticJiraV09MultipleChoiceQuestionsProps = z.infer<
	typeof MultipleChoiceQuestionsSchema
>;
export type AgenticJiraV09RepositoryPickerProps = z.infer<typeof RepositoryPickerSchema>;
export type AgenticJiraV09ToolApprovalProps = z.infer<typeof ToolApprovalSchema>;

/**
 * One recorded answer inside the `MultipleChoiceQuestions` bound answer
 * record (`Record<questionId, AgenticJiraV09MultipleChoiceAnswer>`).
 */
export type AgenticJiraV09MultipleChoiceAnswer =
	| { type: 'PROVIDED_OPTION'; selectedOptionId: string }
	| { type: 'OTHER_OPTION'; customText: string }
	| { type: 'SKIP' };

/**
 * One recorded decision inside the `ToolApproval` bound decision record
 * (`Record<toolId, AgenticJiraV09ToolDecision>`).
 */
export type AgenticJiraV09ToolDecision = 'ALLOW' | 'REJECT';

/**
 * The selection value `RepositoryPicker` writes to its bound `value` path.
 */
export type AgenticJiraV09RepositorySelection = {
	url: string;
	name: string;
	/** True when the user typed a URL not present in `repositories`. */
	custom?: boolean;
};

/** Discriminated union of the net-new agentic-jira component instances. */
export type AgenticJiraV09ComponentInstance =
	| {
			id: string;
			component: { MultipleChoiceQuestions: AgenticJiraV09MultipleChoiceQuestionsProps };
	  }
	| { id: string; component: { RepositoryPicker: AgenticJiraV09RepositoryPickerProps } }
	| { id: string; component: { ToolApproval: AgenticJiraV09ToolApprovalProps } };

/**
 * Component names registered by this catalog. Further components are
 * added as concrete needs arise.
 */
export type AgenticJiraV09ComponentName =
	| 'MultipleChoiceQuestions'
	| 'RepositoryPicker'
	| 'ToolApproval';
