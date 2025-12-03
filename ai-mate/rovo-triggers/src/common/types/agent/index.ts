import type { PayloadCore } from '../../../types';

export type SolutionDraftAgentUpdatePayload = PayloadCore<'solution-draft-agent-update'> & {
	data: {
		buildId: string;
		draftContent: string;
	};
};
