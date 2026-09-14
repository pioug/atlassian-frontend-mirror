import type { ApiClientResponse, ProfileCardClientData } from '../types';

/**
 * Transform response from GraphQL
 * - Prefix `timestring` with `remoteWeekdayString` depending on `remoteWeekdayIndex`
 * - Remove properties which will be not used later
 * @ignore
 * @param  {object} response
 * @return {object}
 */
export const modifyResponse = (response: ApiClientResponse): ProfileCardClientData => {
	const data = {
		...response.User,
	};

	const localWeekdayIndex = new Date().getDay().toString();

	if (data.remoteWeekdayIndex && data.remoteWeekdayIndex !== localWeekdayIndex) {
		data.remoteTimeString = `${data.remoteWeekdayString} ${data.remoteTimeString}`;
	}

	return {
		isBot: data.isBot,
		isCurrentUser: data.isCurrentUser,
		status: data.status,
		statusModifiedDate: data.statusModifiedDate || undefined,
		avatarUrl: data.avatarUrl || undefined,
		email: data.email || undefined,
		fullName: data.fullName || undefined,
		location: data.location || undefined,
		meta: data.meta || undefined,
		nickname: data.nickname || undefined,
		companyName: data.companyName || undefined,
		timestring: data.remoteTimeString || undefined,
		accountType: data.accountType || undefined,
	};
};
