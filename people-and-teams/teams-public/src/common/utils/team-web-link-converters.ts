import { type NewTeamWebLink, type TeamContainer, type TeamWebLink } from '../types';

export interface TeamLinkIconData {
	linkUrl?: string;
	iconUrl?: string;
	productName?: string;
}

export const containerToNewWebLink = (container: TeamContainer): NewTeamWebLink => {
	return {
		contentTitle: container.name,
		description: '',
		linkUri: container.link || '',
	};
};

export const webLinkToContainer = (
	link: TeamWebLink,
	iconData?: TeamLinkIconData,
): TeamContainer => {
	return {
		id: link.linkId,
		type: 'WebLink',
		name: link.contentTitle,
		icon: iconData?.iconUrl || null,
		link: link.linkUri,
	};
};

export const webLinksToContainers = (
	links: TeamWebLink[],
	linkIcons: TeamLinkIconData[] = [],
): TeamContainer[] => {
	return links.map((link) => {
		const iconData = linkIcons.find((icon) => icon.linkUrl === link.linkUri);
		return webLinkToContainer(link, iconData);
	});
};

export const isNewTeamWebLink = (
	input: TeamContainer | NewTeamWebLink,
): input is NewTeamWebLink => {
	return 'contentTitle' in input && 'linkUri' in input && !('type' in input) && !('id' in input);
};
