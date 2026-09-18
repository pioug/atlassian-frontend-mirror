import type { IntlShape } from 'react-intl';

import type { ContributorTagModel, TagContributor } from '../../showDiffPluginType';
import { contributorTagMessages } from './messages';

const getContributorName = (
	contributor: TagContributor,
	formatMessage: IntlShape['formatMessage'],
): string => {
	const name = contributor.name?.trim();
	if (name) {
		return name;
	}

	// `agentKind` defaults to `'external'` per the plugin type contract; an unidentified external
	// agent falls back to a generic label rather than rendering a nameless tag.
	if (contributor.kind === 'agent' && (contributor.agentKind ?? 'external') === 'external') {
		return formatMessage(contributorTagMessages.externalAgentName);
	}

	return '';
};

/**
 * Whether the label has to spell out that the contributor is an agent. A sighted user reads that off
 * the `aria-hidden` avatar, so the label is the only other carrier.
 *
 * Excluded: a connected pair, which says it via `changedByConnected`, and an unnamed external agent,
 * whose name `getContributorName` has already resolved to "External agent".
 */
const isUnaccompaniedNamedAgent = (model: ContributorTagModel): boolean =>
	!model.connectedContributor &&
	model.contributor.kind === 'agent' &&
	Boolean(model.contributor.name?.trim());

export type ContributorLabel = {
	/** One sentence crediting everyone the change is attributed to — the tag's announcement. */
	fullLabel: string;
	/** The name the tag paints, which `MAX_TAG_WIDTH` may ellipsise. */
	visibleName: string;
};

/**
 * The two strings a tag's model resolves to. Shared with `getActiveDiffAnnouncement`, so stepping
 * onto a change says the same sentence as the tag pinned to it rather than a copy free to drift.
 */
export const formatContributorLabel = (
	model: ContributorTagModel,
	formatMessage: IntlShape['formatMessage'],
): ContributorLabel => {
	const isPrimaryAgent = model.contributor.kind === 'agent';
	const primaryName = getContributorName(model.contributor, formatMessage);
	const secondaryName = model.connectedContributor
		? getContributorName(model.connectedContributor, formatMessage)
		: '';
	const agentName = isPrimaryAgent ? primaryName : secondaryName;
	const userName = isPrimaryAgent ? secondaryName : primaryName;

	return {
		fullLabel: model.connectedContributor
			? formatMessage(contributorTagMessages.changedByConnected, { agentName, userName })
			: formatMessage(
					isUnaccompaniedNamedAgent(model)
						? contributorTagMessages.changedByAgent
						: contributorTagMessages.changedBy,
					{ name: primaryName },
				),
		// A connected pair only ever shows the agent; the pair is spelled out in `fullLabel`, because
		// the tag is capped at `MAX_TAG_WIDTH` and two names rarely fit inside it.
		visibleName: model.connectedContributor ? agentName || primaryName : primaryName,
	};
};
