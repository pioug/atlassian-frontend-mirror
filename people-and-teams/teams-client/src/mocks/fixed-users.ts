import { type TeamsClientUser as User } from '../types/user';

export const fixedUsers = (n = 10): User[] => {
	return [...Array(n)].map(
		(idx): User => ({
			id: `FIXED-USER-ID-${idx}`,
			avatarUrl: `https://avatar.com/${idx}`,
			fullName: `Fixed User Fullname ${idx}`,
			nickname: `fixedUserName_${idx}`,
			title: `Fixed Job Title ${idx}`,
			userType: 'user',
		}),
	);
};
