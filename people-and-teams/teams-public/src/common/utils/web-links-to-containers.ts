import { type TeamContainer, type TeamWebLink } from '../types';
import type { TeamLinkIconData } from './team-web-link-converters';
import { webLinkToContainer } from './web-link-to-container';

export const webLinksToContainers = (
	links: TeamWebLink[],
	linkIcons: TeamLinkIconData[] = [],
): TeamContainer[] => {
	return links.map((link) => {
		const iconData = linkIcons.find((icon) => icon.linkUrl === link.linkUri);
		return webLinkToContainer(link, iconData);
	});
};
