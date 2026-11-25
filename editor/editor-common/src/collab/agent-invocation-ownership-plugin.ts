import { SafePlugin } from '../safe-plugin';
import {
	AGENT_INVOCATION_OWNERSHIP_TTL_MS,
	AGENT_INVOCATION_REGISTRATION_META,
	agentInvocationOwnershipKey,
	type AgentInvocationRegistration,
	type AgentInvocationRegistrations,
} from './agent-invocation';

export const createAgentInvocationOwnershipPlugin = (): SafePlugin<AgentInvocationRegistrations> =>
	new SafePlugin<AgentInvocationRegistrations>({
		key: agentInvocationOwnershipKey,
		state: {
			init: () => new Map(),
			apply: (tr, previous) => {
				const registration = tr.getMeta(AGENT_INVOCATION_REGISTRATION_META) as
					| AgentInvocationRegistration
					| undefined;
				if (!registration) {
					return previous;
				}

				const next = new Map(
					[...previous].filter(
						([, entry]) =>
							registration.registeredAt < entry.registeredAt + AGENT_INVOCATION_OWNERSHIP_TTL_MS,
					),
				);
				const existing = next.get(registration.invocationId);
				next.set(
					registration.invocationId,
					existing
						? { ...existing, editSource: existing.editSource ?? registration.editSource }
						: registration,
				);
				return next;
			},
		},
	});
