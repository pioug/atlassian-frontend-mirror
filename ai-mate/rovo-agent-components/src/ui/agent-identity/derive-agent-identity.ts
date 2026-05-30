/**
 * Shared identity-derivation helper used by AgentInputHat (above the prompt
 * input) and AgentResponseHat (above an assistant message). Both components
 * need to translate raw agent identity props into the inputs that AgentAvatar
 * expects, plus an accessible/visible name pair, with the same fallback
 * semantics. Centralising the logic here avoids drift between the two hats —
 * historically every change to one needed a paired change to the other.
 */

import { fg } from '@atlaskit/platform-feature-flags';

import { isAgentCreatorType } from '../../common/utils/is-agent-creator-type';
import { isForgeAgentByCreatorType } from '../../common/utils/is-forge-agent';

/** Raw identity input — typically a subset of `Agent` or `message.author`. */
export type AgentIdentityInput = {
	/** Specialist agent id. Falsy/empty/whitespace = default Rovo turn. */
	agentId?: string;
	agentName?: string;
	agentNamedId?: string;
	agentIdentityAccountId?: string;
	imageUrl?: string;
	/**
	 * Raw backend `creator_type` (e.g. "FORGE", "REMOTE_A2A"). Validated via
	 * `isAgentCreatorType` internally so callers don't need an unsafe cast.
	 * Ignored when `isForgeAgent` is provided explicitly.
	 */
	creatorType?: string;
	/** Pre-resolved Forge/REMOTE_A2A flag. Takes precedence over `creatorType`. */
	isForgeAgent?: boolean;
	forgeAgentIconUrl?: string;
	/** Localized fallback used when the default Rovo path renders text. */
	defaultName: string;
};

/** Derived props ready to forward to AgentAvatar + the visible name slot. */
export type DerivedAgentIdentity = {
	/** True when either UUID id or named id selects the specialist path. */
	hasSpecialistIdentity: boolean;
	/** Non-empty UUID agentId when available; undefined for namedId-only specialists. */
	specialistAgentId: string | undefined;
	/** Visible label to render in the hat's text slot, or undefined to omit. */
	visibleName: string | undefined;
	/** Always-non-empty accessible label for the avatar. */
	accessibleName: string;
	/** Props to spread onto AgentAvatar — only meaningful on the specialist path. */
	avatarProps: {
		agentId: string | undefined;
		agentNamedId: string | undefined;
		agentIdentityAccountId: string | undefined;
		imageUrl: string | undefined;
		isForgeAgent: boolean | undefined;
		forgeAgentIconUrl: string | undefined;
	};
};

/**
 * Derive `AgentAvatar` inputs and visible/accessible labels from raw identity.
 *
 * Behaviour:
 *  - Specialist path (`agentId` or `agentNamedId` is a non-empty string):
 *    visible text is the supplied `agentName`, omitted entirely if absent (no
 *    "Rovo" text next to a specialist avatar). Accessible label falls back to
 *    the UUID id, then named id, so the avatar is never announced as "Rovo".
 *  - Default Rovo path (no `agentId` or `agentNamedId`): visible and accessible
 *    labels are the localized default name (typically "Rovo").
 *  - Forge identity props are gated internally via `rovo_agent_support_a2a_avatar`
 *    so callers don't have to.
 */
export function deriveAgentIdentity({
	agentId,
	agentName,
	agentNamedId,
	agentIdentityAccountId,
	imageUrl,
	creatorType,
	isForgeAgent: isForgeAgentOverride,
	forgeAgentIconUrl,
	defaultName,
}: AgentIdentityInput): DerivedAgentIdentity {
	const trimmedAgentId = typeof agentId === 'string' ? agentId.trim() : undefined;
	const specialistAgentId =
		trimmedAgentId && trimmedAgentId.length > 0 ? trimmedAgentId : undefined;
	const trimmedAgentNamedId = typeof agentNamedId === 'string' ? agentNamedId.trim() : undefined;
	const specialistAgentNamedId =
		trimmedAgentNamedId && trimmedAgentNamedId.length > 0 ? trimmedAgentNamedId : undefined;
	const specialistIdentity = specialistAgentId ?? specialistAgentNamedId;

	const trimmedAgentName = agentName?.trim();
	const visibleName = specialistIdentity ? trimmedAgentName || undefined : defaultName;
	const accessibleName = specialistIdentity ? trimmedAgentName || specialistIdentity : defaultName;

	const a2aGateOn = fg('rovo_agent_support_a2a_avatar');

	// Prefer the explicit override; otherwise validate creatorType via the
	// type guard so the call site doesn't need an unsafe cast.
	const isForgeAgent =
		isForgeAgentOverride !== undefined
			? isForgeAgentOverride
			: creatorType && isAgentCreatorType(creatorType)
				? isForgeAgentByCreatorType(creatorType)
				: undefined;

	return {
		hasSpecialistIdentity: Boolean(specialistIdentity),
		specialistAgentId,
		visibleName,
		accessibleName,
		avatarProps: {
			agentId: specialistAgentId,
			agentNamedId: specialistAgentNamedId,
			agentIdentityAccountId,
			imageUrl,
			isForgeAgent: a2aGateOn ? isForgeAgent : undefined,
			forgeAgentIconUrl: a2aGateOn ? forgeAgentIconUrl : undefined,
		},
	};
}
