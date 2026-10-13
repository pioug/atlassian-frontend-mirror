import React, { useState, type ComponentProps } from 'react';

import { IntlProvider } from 'react-intl';

import { RovoAgentSelector } from '@atlaskit/rovo-agent-selector/rovo-agent-selector';
import type { AgentOption } from '@atlaskit/rovo-agent-selector/types';

type SelectorFragmentReference = ComponentProps<typeof RovoAgentSelector>['fragmentReference'];

type TenantAgentSelectionProps = {
	/** Agent selection loaded by the host for this tenant, or null when no agent is configured. */
	initialSelectedAgent?: AgentOption | null;
	/** Relay fragment reference from the host query, under its authenticated Relay environment. */
	fragmentReference: SelectorFragmentReference;
	/** Current tenant cloud ID; it must match the tenant used by the Relay query. */
	cloudId: string;
	/** Optional host persistence seam. This callback receives the user's actual selection. */
	onSelectionChange?: (agent: AgentOption | null) => void;
};

/**
 * Keeps the selector value in host form state while using the component's tenant-scoped Relay data.
 *
 * The host must pass a fragment reference produced by a Relay query that spreads the selector's
 * fragment for the same `cloudId`, inside its authenticated Relay environment. The selector asks
 * for editable agents; provide only a saved selection that belongs to that tenant and is allowed
 * by the host's current authorization policy. Do not construct fake agent IDs for this prop.
 */
export default function TenantAgentSelection({
	initialSelectedAgent,
	fragmentReference,
	cloudId,
	onSelectionChange,
}: TenantAgentSelectionProps): React.JSX.Element {
	const [selectedAgent, setSelectedAgent] = useState<AgentOption | null>(
		initialSelectedAgent ?? null,
	);
	const [statusMessage, setStatusMessage] = useState('');

	const handleChange = (agent: AgentOption | null) => {
		setSelectedAgent(agent);
		setStatusMessage(agent ? `Selected ${agent.label}.` : 'Agent selection cleared.');
		onSelectionChange?.(agent);
	};

	return (
		<IntlProvider locale="en">
			<div>
				<RovoAgentSelector
					fragmentReference={fragmentReference}
					cloudId={cloudId}
					selectedAgent={selectedAgent}
					onChange={handleChange}
				/>
				{statusMessage && <p role="status">{statusMessage}</p>}
			</div>
		</IntlProvider>
	);
}
