import { type TeamContainer, type TeamWebLink } from '../types';
import type { TeamLinkIconData } from './team-web-link-converters';

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
