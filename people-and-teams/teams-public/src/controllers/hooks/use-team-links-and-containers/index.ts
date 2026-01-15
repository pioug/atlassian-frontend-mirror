import { useCallback, useEffect, useMemo } from 'react';

import { type NewTeamWebLink, type TeamContainer } from '../../../common/types';
import {
	containerToNewWebLink,
	isNewTeamWebLink,
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
	iconsLoading: boolean;
	iconHasLoaded: boolean;
	addTeamLink: (containerOrWebLink: TeamContainer | NewTeamWebLink) => Promise<any>;
	updateTeamLinkById: (linkId: string, updatedFields: Partial<NewTeamWebLink>) => Promise<any>;
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
		{
			links,
			linkIcons,
			isLoading: webLinksLoading,
			hasError: webLinksError,
			hasLoaded: webLinksHasLoaded,
			iconsLoading,
			iconHasLoaded,
		},
		{ getTeamWebLinks, createTeamWebLink, updateTeamWebLink, removeWebLink },
	] = useTeamWebLinks();

	useEffect(() => {
		getTeamWebLinks(teamId);
	}, [getTeamWebLinks, teamId]);

	const webLinkContainers = useMemo(
		() => webLinksToContainers(links, linkIcons),
		[links, linkIcons],
	);

	const allContainers = useMemo(
		() => [...teamContainers, ...webLinkContainers],
		[teamContainers, webLinkContainers],
	);
	const canAddMoreLink = useMemo(
		() => allContainers.length < MAX_LINKS_LIMIT,
		[allContainers.length],
	);

	const addTeamLink = useCallback(
		async (containerOrWebLink: TeamContainer | NewTeamWebLink) => {
			if (isNewTeamWebLink(containerOrWebLink)) {
				return await createTeamWebLink(teamId, containerOrWebLink);
			} else {
				if (containerOrWebLink.type === 'WebLink') {
					const webLink = containerToNewWebLink(containerOrWebLink);
					return await createTeamWebLink(teamId, webLink);
				} else {
					addTeamContainer(containerOrWebLink);
					return Promise.resolve(containerOrWebLink);
				}
			}
		},
		[teamId, createTeamWebLink, addTeamContainer],
	);

	const updateTeamLinkById = useCallback(
		async (linkId: string, updatedFields: Partial<NewTeamWebLink>) => {
			const container = allContainers.find((link) => link.id === linkId);
			if (!container) {
				return;
			}

			if (container.type === 'WebLink') {
				const currentWebLink = containerToNewWebLink(container);
				const updatedWebLink = { ...currentWebLink, ...updatedFields };
				return await updateTeamWebLink(teamId, linkId, updatedWebLink);
			}
		},
		[teamId, allContainers, updateTeamWebLink],
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
		iconsLoading,
		iconHasLoaded,
		addTeamLink,
		updateTeamLinkById,
		removeTeamLink,
	};
};
