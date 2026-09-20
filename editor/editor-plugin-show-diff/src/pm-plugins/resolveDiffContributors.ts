import type {
	DiffContributor,
	DiffContributorProfile,
	DiffContributors,
	DiffStepAttribution,
	StepWithAttribution,
} from '../showDiffPluginType';
import { getAttributionKey } from './decorations/colorSchemes/attributions';

/** A brand name, so a literal rather than a translated message. */
const ROVO_AGENT_NAME = 'Rovo';

/** `agentType` values that render as "Rovo" rather than as a generic external agent. */
const ROVO_AGENT_TYPES: ReadonlySet<string> = new Set(['convo-ai', 'rovo_chat']);

type ResolvedIdentity = Omit<DiffContributor, 'attribution' | 'connectedTo'>;

/** Known external agent types emitted by Confluence's agent identification service. */
const EXTERNAL_AGENT_PRESENTATIONS: Readonly<
	Record<string, Pick<ResolvedIdentity, 'agentKind' | 'name'>>
> = {
	claude: { agentKind: 'claude', name: 'Claude' },
	codex: { agentKind: 'external', name: 'Codex' },
	vscode: { agentKind: 'external', name: 'VS Code' },
	hermes: { agentKind: 'external', name: 'Hermes' },
	runlayer: { agentKind: 'external', name: 'Runlayer' },
	zed: { agentKind: 'external', name: 'Zed' },
	ampcode: { agentKind: 'external', name: 'Ampcode' },
	antigravity: { agentKind: 'external', name: 'Antigravity' },
	devin_cli: { agentKind: 'external', name: 'Devin CLI' },
	pi_agent: { agentKind: 'external', name: 'Pi Agent' },
};

const hasAgentIdentity = (attribution: DiffStepAttribution): boolean =>
	Boolean(attribution.agentId?.trim() || attribution.agentType?.trim());

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

/** Resolve branding or a profile first, then a known type name or the external-agent fallback. */
const resolveAgent = (
	attribution: DiffStepAttribution,
	profilesByAccountId: Map<string, DiffContributorProfile>,
): ResolvedIdentity => {
	const agentType = attribution.agentType?.trim().toLowerCase();
	const agentPresentation = agentType ? EXTERNAL_AGENT_PRESENTATIONS[agentType] : undefined;

	if (agentPresentation && agentPresentation.agentKind !== 'external') {
		return { ...agentPresentation, kind: 'agent' };
	}

	const agentId = attribution.agentId?.trim();
	const agentProfile = agentId ? profilesByAccountId.get(agentId) : undefined;

	if (agentProfile) {
		return {
			...(agentProfile.agentBrand ? { agentKind: agentProfile.agentBrand } : {}),
			avatarUrl: agentProfile.avatarUrl,
			kind: 'agent',
			name: agentProfile.name,
		};
	}

	// Unknown types keep an empty name for the tag's localised "External agent" label.
	return agentType && ROVO_AGENT_TYPES.has(agentType)
		? { agentKind: 'rovo', kind: 'agent', name: ROVO_AGENT_NAME }
		: agentPresentation
			? { ...agentPresentation, kind: 'agent' }
			: { agentKind: 'external', kind: 'agent', name: '' };
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

		if (hasAgentIdentity(stepAttribution)) {
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
