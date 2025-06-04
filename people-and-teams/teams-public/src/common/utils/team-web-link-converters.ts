import { type NewTeamWebLink, type TeamContainer, type TeamWebLink } from '../types';

export const containerToNewWebLink = (container: TeamContainer): NewTeamWebLink => {
	return {
		contentTitle: container.name,
		description: '',
		linkUri: container.link || '',
	};
};

export const webLinkToContainer = (link: TeamWebLink): TeamContainer => {
	return {
		id: link.linkId,
		type: 'WebLink',
		name: link.contentTitle,
		icon: null,
		link: link.linkUri,
	};
};

export const webLinksToContainers = (links: TeamWebLink[]): TeamContainer[] => {
	return links.map(webLinkToContainer);
};

export const isNewTeamWebLink = (
	input: TeamContainer | NewTeamWebLink,
): input is NewTeamWebLink => {
	return 'contentTitle' in input && 'linkUri' in input && !('type' in input) && !('id' in input);
};
