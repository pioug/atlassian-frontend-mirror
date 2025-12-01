import type { PayloadCore } from '../../../types';

type BaseHandoffPayload = {
	conversationId: string;
};

export type NonAppHandoffPayload = BaseHandoffPayload & {
	type: 'ROVO_AGENT' | 'AUTOMATION_RULE';
	ari?: never;
	buildId: string;
	appBuilderAutoStart?: never;
};

export type AppHandoffPayload = BaseHandoffPayload & {
	type: 'ECOSYSTEM_APP';
	ari: string;
	buildId?: never;
	appBuilderAutoStart: boolean;
};

export type SolutionArchitectHandoffPayload = PayloadCore<'solution-architect-handoff'> & {
	data: NonAppHandoffPayload | AppHandoffPayload;
};

export type SolutionPlanStateUpdatePayload = PayloadCore<'solution-plan-state-updated'>;

export type SolutionArchitectAgentActivationPayload = PayloadCore<
	'solution-architect-agent-activation',
	{
		draftBuildId: string;
	}
>;
