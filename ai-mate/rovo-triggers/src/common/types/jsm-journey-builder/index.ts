import type { PayloadCore } from '../../../types';

export type JsmJourneyBuilderAgentAction = {
	actionType: 'CREATE_JOURNEY' | 'UPDATE_JOURNEY' | 'DELETE_JOURNEY';
	journeyId: string;
	success: boolean;
};

export type JsmJourneyBuilderActionsPayload = PayloadCore<
	'jsm-journey-builder-actions',
	{
		invocationId?: string;
		agentActions: JsmJourneyBuilderAgentAction[];
	}
>;
