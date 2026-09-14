import { type NewTeamWebLink, type TeamContainer } from '../types';

export const isNewTeamWebLink = (
	input: TeamContainer | NewTeamWebLink,
): input is NewTeamWebLink => {
	return 'contentTitle' in input && 'linkUri' in input && !('type' in input) && !('id' in input);
};
