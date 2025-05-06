import { type UserType } from '../../../types/user';

type userTypeOptions = {
	isBot?: boolean;
	appType?: string | null;
};

export function toUserType({ isBot, appType }: userTypeOptions): UserType {
	// Note, the order of these checks is important
	if (appType?.toLocaleLowerCase() === 'agent') {
		return 'agent';
	}

	if (isBot) {
		return 'bot';
	}

	return 'user';
}
