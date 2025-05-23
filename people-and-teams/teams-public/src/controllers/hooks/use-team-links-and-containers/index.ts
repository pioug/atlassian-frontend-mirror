import { useCallback, useEffect, useMemo } from 'react';

import { type TeamContainer } from '../../../common/types';
import {
	containerToNewWebLink,
	webLinksToContainers,
} from '../../../common/utils/team-web-link-converters';
import { useTeamContainers } from '../use-team-containers';
import { useTeamWebLinks } from '../use-team-web-links';

export type UseTeamLinksAndContainersResult = {
	isLoading: boolean;
	hasError: boolean;
	containersError: boolean;
	webLinksError: boolean;
	webLinksHasLoaded: boolean;
	containersHasLoaded: boolean;
	hasLoaded: boolean;
	teamLinks: TeamContainer[];
	canAddMoreLink: boolean;
	addTeamLink: (container: TeamContainer) => Promise<any>;
	updateTeamLink: (container: TeamContainer, newContainer: TeamContainer) => Promise<any>;
	removeTeamLink: (container: TeamContainer) => Promise<void>;
};

const MAX_LINKS_LIMIT = 10;

export const useTeamLinksAndContainers = (
	teamId: string,
	enableContainers = true,
): UseTeamLinksAndContainersResult => {
	const {
		teamContainers,
		loading: containersLoading,
		hasLoaded: containersHasLoaded,
		error: containersError,
		addTeamContainer,
		unlinkTeamContainers,
	} = useTeamContainers(teamId, enableContainers);

	const [
		{ links, isLoading: webLinksLoading, hasError: webLinksError, hasLoaded: webLinksHasLoaded },
		{ getTeamWebLinks, createTeamWebLink, updateTeamWebLink, removeWebLink },
	] = useTeamWebLinks();

	useEffect(() => {
		getTeamWebLinks(teamId);
	}, [getTeamWebLinks, teamId]);

	const webLinkContainers = useMemo(() => webLinksToContainers(links), [links]);

	const allContainers = useMemo(
		() => [...teamContainers, ...webLinkContainers],
		[teamContainers, webLinkContainers],
	);
	const canAddMoreLink = useMemo(
		() => allContainers.length <= MAX_LINKS_LIMIT,
		[allContainers.length],
	);

	const addTeamLink = useCallback(
		async (container: TeamContainer) => {
			if (container.type === 'WebLink') {
				const webLink = containerToNewWebLink(container);
				return await createTeamWebLink(teamId, webLink);
			} else {
				addTeamContainer(container);
				return Promise.resolve(container);
			}
		},
		[teamId, createTeamWebLink, addTeamContainer],
	);

	const updateTeamLink = useCallback(
		async (container: TeamContainer, newContainer: TeamContainer) => {
			if (container.type === 'WebLink') {
				const webLink = containerToNewWebLink(newContainer);
				return await updateTeamWebLink(teamId, container.id, webLink);
			}
		},
		[teamId, updateTeamWebLink],
	);

	const removeTeamLink = useCallback(
		async (container: TeamContainer) => {
			if (container.type === 'WebLink') {
				await removeWebLink(teamId, container.id);
			} else {
				await unlinkTeamContainers(container.id);
			}
		},
		[teamId, removeWebLink, unlinkTeamContainers],
	);

	return {
		isLoading: containersLoading || webLinksLoading,
		hasError: !!containersError || webLinksError,
		containersError: !!containersError,
		webLinksError,
		containersHasLoaded,
		webLinksHasLoaded,
		hasLoaded: containersHasLoaded && webLinksHasLoaded,
		teamLinks: allContainers,
		canAddMoreLink,
		addTeamLink,
		updateTeamLink,
		removeTeamLink,
	};
};
