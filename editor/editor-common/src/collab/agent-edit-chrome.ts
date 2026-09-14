import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

/**
 * Neutral transaction metadata used by agent-edit producers to request the
 * shared post-apply highlight and telepointer owned by editor-plugin-ai.
 */
export const AGENT_EDIT_CHROME_DATA = 'agentEditChromeData';

export const AGENT_EDIT_CHROME_DEFAULT_AUTO_DISMISS_AFTER_MS = 2000;
export const AGENT_EDIT_CHROME_DEFAULT_TELEPOINTER_ENABLED = true;

export type AgentEditChromeRange = {
	from: number;
	to: number;
};

export type AgentEditChromeData = {
	/**
	 * The agent's own id in its source system (e.g. Rovo's fixed agent UUID). Distinct from
	 * `agentIdentityAccountId`: this identifies *which agent*, not an Atlassian identity.
	 */
	agentId?: string;
	/** The Atlassian identity-service account id provisioned for the agent, if any (used to fetch/generate its avatar — see `GeneratedAvatar`). Distinct from `agentId`. */
	agentIdentityAccountId?: string;
	/** Agent display name. Shown for third-party agents, and used as the avatar's accessible label. */
	agentName?: string;
	/**
	 * The agent's `external_config_reference`. Highest-priority avatar input, and what gives
	 * out-of-the-box and third-party agents their own avatar.
	 */
	agentNamedId?: string;
	/** Lifetime of both the highlight and telepointer. Omission uses the shared static default; 0 prevents rendering. */
	autoDismissAfterMs?: number;
	/** Runtime CSS color value. Consumers should pass an ADS token value. */
	highlightBackgroundColor?: string;
	/** Runtime CSS color value. Consumers should pass an ADS token value. */
	highlightBorderColor?: string;
	ranges: AgentEditChromeRange[];
	/**
	 * Which badge treatment the telepointer renders. Mirrors `TelepointerAgentKind` from
	 * editor-plugin-ai's consolidated `TelepointerAvatar` component. Duplicated here as a plain
	 * string union — this package sits below the plugin and cannot import its types.
	 */
	telepointerAgentKind?: 'agent' | 'agent-third-party' | 'fallback' | 'rovo';
	/** Whether to show the telepointer. Omission uses the shared static default. */
	telepointerEnabled?: boolean;
	/** Exact telepointer label; omission uses the shared plugin's localized default. */
	telepointerLabel?: string;
	/** Runtime CSS color value for the telepointer's cursor line. Consumers should pass an ADS token value. */
	telepointerLineColor?: string;
};

export type AgentEditChromeDynamicConfig = {
	autoDismissAfterMs: number;
	telepointerEnabled: boolean;
};

/**
 * Resolves shared dynamic configuration at the producer boundary. The post-apply
 * chrome plugin uses the supplied values and does not read dynamic configuration itself.
 */
export const getAgentEditChromeDynamicConfig = (): AgentEditChromeDynamicConfig => ({
	autoDismissAfterMs: expVal(
		'platform_editor_agent_be_streaming',
		'highlightDurationMs',
		AGENT_EDIT_CHROME_DEFAULT_AUTO_DISMISS_AFTER_MS,
	),
	telepointerEnabled: !expVal(
		'platform_editor_agent_be_streaming',
		'telepointerDisabled',
		!AGENT_EDIT_CHROME_DEFAULT_TELEPOINTER_ENABLED,
	),
});
