import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';
import { getThirdPartyAgentColor } from '@atlaskit/agent-color/get-third-party-agent-color';

import type {
	DiffAgentBrand,
	DiffContributor,
	DiffContributorProfile,
	DiffContributors,
	DiffStepAttribution,
	StepWithAttribution,
} from '../showDiffPluginType';
import { getAttributionKey } from './decorations/colorSchemes/attributions';

type ResolvedIdentity = Omit<DiffContributor, 'attribution' | 'connectedTo'>;

/** `@atlaskit/agent-color` brands show-diff renders with a dedicated presentation. */
const SHOW_DIFF_AGENT_BRANDS: Readonly<Partial<Record<AgentBrandColorScheme, DiffAgentBrand>>> = {
	'agent-brand-claude': 'claude',
	'agent-brand-chatgpt': 'chatgpt',
	'agent-brand-figma': 'figma',
	'agent-brand-lovable': 'lovable',
	'agent-brand-replit': 'replit',
	'agent-brand-rovo': 'rovo',
	'agent-brand-amplitude': 'amplitude',
	'agent-brand-cortex': 'cortex',
	'agent-brand-databricks': 'databricks',
	'agent-brand-gemini': 'gemini',
	'agent-brand-manus': 'manus',
	'agent-brand-slack': 'slack',
	'agent-brand-antigravity': 'antigravity',
	'agent-brand-copilot': 'copilot',
};

const toProfilesByAccountId = (
	profiles: readonly DiffContributorProfile[] | undefined,
): Map<string, DiffContributorProfile> => {
	const profilesByAccountId = new Map<string, DiffContributorProfile>();

	profiles?.forEach((profile) => {
		// Trimmed to match how attribution ids are keyed, so the two sides compare like for like.
		const accountId = profile.accountId.trim();
		if (accountId && !profilesByAccountId.has(accountId)) {
			profilesByAccountId.set(accountId, profile);
		}
	});

	return profilesByAccountId;
};

const resolveUser = (
	userId: string,
	profilesByAccountId: Map<string, DiffContributorProfile>,
): ResolvedIdentity | undefined => {
	const profile = profilesByAccountId.get(userId);

	return profile ? { avatarUrl: profile.avatarUrl, kind: 'user', name: profile.name } : undefined;
};

/** Resolve branding from named metadata or the account profile. */
const resolveAgent = (
	attribution: DiffStepAttribution,
	profilesByAccountId: Map<string, DiffContributorProfile>,
): ResolvedIdentity => {
	const agentId = attribution.agentId?.trim();
	const agentProfile = agentId ? profilesByAccountId.get(agentId) : undefined;

	const brand = getThirdPartyAgentColor({
		agentNamedId: attribution.agentNamedId,
		agentName: agentProfile?.name,
	});
	const agentBrand =
		agentProfile?.agentBrand ?? (brand ? SHOW_DIFF_AGENT_BRANDS[brand.scheme] : undefined);

	if (agentProfile || agentBrand) {
		return {
			...(agentBrand ? { agentKind: agentBrand } : {}),
			avatarUrl: agentProfile?.avatarUrl,
			kind: 'agent',
			name: agentProfile?.name ?? brand?.name ?? '',
		};
	}

	return { agentKind: 'external', kind: 'agent', name: '' };
};

/**
 * One contributor per distinct actor behind the attributed steps, resolved against the identities
 * the consumer supplied. An actor the consumer cannot name is skipped rather than dropping the whole
 * list: tags are per change, so its changes keep their diff colour and simply carry no tag, while
 * the actors that *are* named stay credited. Returns `undefined` only when nothing resolves at all.
 */
export const resolveDiffContributors = <TStep>(
	stepsWithAttribution: Array<StepWithAttribution<TStep>>,
	profiles: readonly DiffContributorProfile[] | undefined,
): DiffContributors | undefined => {
	// Profiles opt callers into contributor tags; attribution alone still supplies diff colours.
	if (profiles === undefined) {
		return undefined;
	}

	const profilesByAccountId = toProfilesByAccountId(profiles);
	const contributors: DiffContributor[] = [];
	/** Keyed as the plugin keys changes, so no two entries can collapse onto one another. */
	const creditedActors = new Set<string>();

	for (const { stepAttribution } of stepsWithAttribution) {
		// An attribution naming nobody (e.g. one carrying only `wasOffline`) has nobody to credit.
		const actor = stepAttribution ? getAttributionKey(stepAttribution) : undefined;
		if (!stepAttribution || !actor || creditedActors.has(actor)) {
			continue;
		}

		const userId = stepAttribution.userId?.trim();

		if (stepAttribution.agentId?.trim()) {
			const agent = resolveAgent(stepAttribution, profilesByAccountId);

			if (!userId) {
				// Agent mode: the agent acted on its own, so it is credited on its own.
				contributors.push({ ...agent, attribution: stepAttribution });
				creditedActors.add(actor);
				continue;
			}

			// User-invoked agent: credit both actors and link the agent back to the invoking user.
			const invokingUser: DiffStepAttribution = { userId };
			const user = resolveUser(userId, profilesByAccountId);

			// Skipped if the invoking user's own step already credited them.
			const invokingUserActor = getAttributionKey(invokingUser);
			if (user && invokingUserActor && !creditedActors.has(invokingUserActor)) {
				contributors.push({ ...user, attribution: invokingUser });
				creditedActors.add(invokingUserActor);
			}

			// The agent is always nameable, so it is credited even when its invoker is not — but
			// without the connection, which would point at a contributor that was never created.
			contributors.push({
				...agent,
				attribution: stepAttribution,
				...(user ? { connectedTo: invokingUser } : {}),
			});
			creditedActors.add(actor);
			continue;
		}

		const user = userId ? resolveUser(userId, profilesByAccountId) : undefined;

		if (!user) {
			// Unnamed, and a user has no generic fallback label, so this actor's changes go untagged.
			continue;
		}

		contributors.push({ ...user, attribution: stepAttribution });
		creditedActors.add(actor);
	}

	return contributors.length > 0 ? contributors : undefined;
};
