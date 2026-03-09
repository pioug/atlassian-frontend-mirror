import type { PayloadCore } from '../../../types';

type BaseHandoffPayload = {
	conversationId: string;
};

export type AutomationHandoffPayload = BaseHandoffPayload & {
	type: 'AUTOMATION_RULE';
	ari?: never;
	buildId: string;
	appBuilderAutoStart?: never;
	shouldActivateAgent?: never;
};

export type AgentHandoffPayload = BaseHandoffPayload & {
	type: 'ROVO_AGENT';
	ari?: never;
	buildId: string;
	appBuilderAutoStart?: never;
	shouldActivateAgent?: boolean;
};

export type AppHandoffPayload = BaseHandoffPayload & {
	type: 'ECOSYSTEM_APP';
	ari: string;
	buildId?: never;
	appBuilderAutoStart: boolean;
	shouldActivateAgent?: never;
};

export type SolutionArchitectHandoffPayload = PayloadCore<'solution-architect-handoff'> & {
	data: AutomationHandoffPayload | AppHandoffPayload | AgentHandoffPayload;
};

export type SolutionPlanStateUpdatePayload = PayloadCore<'solution-plan-state-updated'>;

export type SolutionArchitectAgentActivationPayload = PayloadCore<
	'solution-architect-agent-activation',
	{
		draftBuildId: string;
	}
>;

export type StudioAutomationBuildUpdatePayload = PayloadCore<
	'studio-automation-build-updated',
	{ buildId: string }
>;
export type AutomationRuleUpdatePayload = PayloadCore<'automation-rule-update'> & {
	data: { rule: string };
};

export type UpdateAgentConfigurationPayload = PayloadCore<'agent-configuration-update'> & {
	data: {
		ari: string;
	};
};

export type StudioLandingPageRedirectPayload = PayloadCore<'studio-landing-page-redirect'> & {
	data: {
		ari: string;
		prompt: string;
	};
};
