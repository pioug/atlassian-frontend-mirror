import {
	type ExternalUser,
	ExternalUserType,
	type Group,
	GroupType,
	type LozengeProps,
	type OptionData,
	type Team,
	type TeamMember,
	TeamType,
	type User,
	UserType,
} from '@atlaskit/user-picker';
import { type IntlShape } from 'react-intl-next';
import { messages } from '../i18n';
import type { UserEntityType } from '../types';
import { EntityType } from '../types';

interface ServerItem {
	id: string;
	name?: string;
	entityType: EntityType;
	avatarUrl: string;
	description?: string;
	teamAri?: string;
	displayName?: string;
	title?: string;
}

interface ServerUser extends ServerItem {
	name: string;
	entityType: EntityType.USER;
	userType?: UserEntityType;
	avatarUrl: string;
	email?: string;
	attributes?: Record<string, string>;
	nonLicensedUser?: boolean;
}

interface ServerTeam extends ServerItem {
	displayName?: string;
	entityType: EntityType.TEAM;
	description?: string;
	largeAvatarImageUrl?: string;
	smallAvatarImageUrl?: string;
	memberCount?: number;
	members?: TeamMember[];
	includesYou?: boolean;
	verified?: boolean;
}

interface ServerGroup extends ServerItem {
	entityType: EntityType.GROUP;
	attributes?: Record<string, string>;
}

interface ServerResponse {
	recommendedUsers: ServerItem[];
	intl: IntlShape;
}

const getLozenzeProperties = (
	entity: ServerUser | ServerGroup,
	intl: IntlShape,
): string | LozengeProps | undefined => {
	if (entity.attributes?.workspaceMember) {
		return intl.formatMessage(messages.memberLozengeText);
	}

	if (entity.attributes?.isConfluenceExternalCollaborator) {
		const lozengeTooltipMessage =
			entity.entityType === EntityType.GROUP
				? messages.guestGroupLozengeTooltip
				: messages.guestUserLozengeTooltip;
		return {
			text: intl.formatMessage(messages.guestLozengeText),
			tooltip: intl.formatMessage(lozengeTooltipMessage),
			appearance: 'default',
		};
	}

	return undefined;
};

const transformUser = (
	item: ServerItem,
	intl: IntlShape,
): User | ExternalUser | Team | Group | void => {
	const type = item.entityType;

	if (type === EntityType.USER) {
		const user = item as ServerUser;

		const lozenge = getLozenzeProperties(user, intl);

		return {
			id: user.id,
			type: user.nonLicensedUser ? ExternalUserType : UserType,
			userType: user.userType,
			avatarUrl: user.avatarUrl,
			name: user.name,
			email: user.email,
			title: user.title,
			lozenge: lozenge,
			tooltip: user.name,
			isExternal: Boolean(user.nonLicensedUser),
			sources: user.nonLicensedUser ? ['other-atlassian'] : undefined,
		};
	}

	if (type === EntityType.TEAM) {
		const team = item as ServerTeam;

		return {
			id: team.id,
			type: TeamType,
			description: team.description || '',
			name: team.displayName || '',
			memberCount: team.memberCount,
			members: team.members,
			includesYou: team.includesYou,
			avatarUrl: team.largeAvatarImageUrl || team.smallAvatarImageUrl,
			tooltip: team.displayName,
			verified: team.verified,
		};
	}

	if (type === EntityType.GROUP) {
		const group = item as ServerGroup;

		const lozenge = getLozenzeProperties(group, intl);

		return {
			id: group.id,
			type: GroupType,
			name: group.name || '',
			lozenge: lozenge,
		};
	}

	return;
};

export const transformUsers = (serverResponse: ServerResponse, intl: IntlShape): OptionData[] =>
	(serverResponse.recommendedUsers || [])
		.map((item) => transformUser(item, intl))
		.filter((user) => !!user)
		.map((user) => user as OptionData);
