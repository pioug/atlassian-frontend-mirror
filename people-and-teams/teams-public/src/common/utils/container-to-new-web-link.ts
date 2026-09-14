import { type NewTeamWebLink, type TeamContainer } from '../types';

export const containerToNewWebLink = (container: TeamContainer): NewTeamWebLink => {
	return {
		contentTitle: container.name,
		description: '',
		linkUri: container.link || '',
	};
};
