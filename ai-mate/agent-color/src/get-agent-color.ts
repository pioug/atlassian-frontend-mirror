export type AgentColor = 'yellow' | 'purple' | 'lime' | 'blue';

export type GetAgentColorProps = {
	agentId?: string;
	agentIdentityAccountId?: string | null;
	agentNamedId?: string;
};

const AGENT_COLOR_ORDER: readonly AgentColor[] = ['yellow', 'purple', 'lime', 'blue'];

const NAMED_AGENT_COLORS: Readonly<Record<string, AgentColor>> = {
	autodev_template_unit_test_creator: 'lime',
	autodev_template_migration_config_changer_agent: 'lime',
	autodev_template_vulnerable_dependency_updater_agent: 'lime',
	autodev_template_code_standardizer_agent: 'lime',
	autodev_template_code_observer_agent: 'lime',
	autodev_template_code_accessibility_checker_agent: 'lime',
	autodev_code_documentation_writer_agent: 'lime',
	autodev_feature_flag_cleaner_agent: 'lime',
	decision_director_agent: 'lime',
	planner_agent: 'purple',
	tech_writer_agent: 'blue',
	user_manual_writer_agent: 'yellow',
	product_requirements_expert_agent: 'yellow',
	issue_organizer_agent: 'lime',
	ops_guide_agent: 'yellow',
	discovery_and_feedback_agent: 'lime',
	jira_workflow_builder_agent: 'blue',
	itops_rca_agent: 'yellow',
	jira_trial_guide_agent: 'blue',
	daily_brief_agent: 'yellow',
	jira_admin_agent: 'blue',
	jsm_rovo_service_agent: 'yellow',
	mcp_amplitude_agent: 'blue',
	mcp_amplitude_agent_v2: 'blue',
	mcp_box_agent: 'blue',
	mcp_canva_agent: 'blue',
	mcp_figma_agent: 'blue',
	mcp_hubspot_agent: 'blue',
	mcp_intercom_agent: 'blue',
	mcp_gamma_agent: 'blue',
	mcp_lovable_agent: 'blue',
	mcp_replit_agent: 'blue',
	rovo_agent: 'blue',
	jira_work_agent: 'blue',
	jira_intelligent_triage_agent: 'blue',
	jira_coding_agent: 'blue',
};

/**
 * Selects the stable palette Agent Studio uses for an agent. A named agent takes precedence;
 * otherwise the identity account ID, then the agent ID, determines the palette.
 */
export const getAgentColor = ({
	agentId,
	agentNamedId,
	agentIdentityAccountId,
}: GetAgentColorProps): AgentColor => {
	const namedAgentColor = agentNamedId ? NAMED_AGENT_COLORS[agentNamedId] : undefined;
	if (namedAgentColor) {
		return namedAgentColor;
	}

	const id = agentIdentityAccountId || agentId;
	const parsedId = Number.parseInt(id?.slice(-8).replace(/[-:]/gu, '') ?? '', 16);
	const stableAgentId = Number.isNaN(parsedId) ? 0 : parsedId;

	return AGENT_COLOR_ORDER[stableAgentId % AGENT_COLOR_ORDER.length] ?? 'yellow';
};
