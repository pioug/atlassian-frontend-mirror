import type { AgentManagedExtensionPluginOptions } from '@atlassian/editor-plugin-agent-managed-extension';

interface Props {
	options?: {
		cloudId?: string;
		contentType?: string;
		/**
		 * Optional override of the extension type used for newly inserted
		 * agent-managed bodied extensions.
		 *
		 * Defaults to `com.atlassian.confluence.macro.core`.
		 */
		extensionType?: string;
	};
}

/**
 * Plugin options for the agent-managed extension (block) plugin
 *
 * @param options - configuration to be provided into the plugin
 * @param options.options - (optional) nested plugin configuration
 */
export function agentManagedExtensionPluginOptions({
	options,
}: Props): AgentManagedExtensionPluginOptions {
	return {
		cloudId: options?.cloudId,
		contentType: options?.contentType,
		extensionType: options?.extensionType,
	};
}
