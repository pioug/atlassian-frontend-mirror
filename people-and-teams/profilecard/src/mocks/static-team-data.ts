import { type Team } from '../types';
import { avatarImages, descriptions, memberNames, names, sampleImage } from './team-data';

export function staticTeamData({
	headerImage = 'None',
	displayName = 'Short',
	members: memberCount = 1,
	description = 'Long',
	isVerified = false,
}: {
	headerImage?: 'None' | 'Picture';
	displayName?: 'Short' | 'Medium' | 'Long' | 'Overlong';
	members?: number;
	description?: 'None' | 'Short' | 'Medium' | 'Long' | 'Overlong';
	isVerified?: boolean;
}): Team {
	return {
		id: 'team-id',
		largeHeaderImageUrl: headerImage === 'Picture' ? sampleImage : undefined,
		displayName: names[displayName] || names.Short,
		members: memberNames
			.map((name, index) => ({
				id: index.toString(),
				avatarUrl: avatarImages[index % avatarImages.length],
				fullName: name,
			}))
			.slice(0, memberCount),
		description: description ? descriptions[description] : descriptions.Long,
		isVerified,
	};
}
