import {
  User,
  Team,
  Group,
  TeamType,
  UserType,
  GroupType,
  OptionData,
} from '../../../types';

interface ServerItem {
  id: string;
  name?: string;
  entityType: EntityType;
  avatarUrl: string;
  description?: string;
  teamAri?: string;
  displayName?: string;
}

interface ServerUser extends ServerItem {
  name: string;
  entityType: EntityType.USER;
  avatarUrl: string;
  email?: string;
}

interface ServerTeam extends ServerItem {
  displayName?: string;
  entityType: EntityType.TEAM;
  description?: string;
  largeAvatarImageUrl?: string;
  smallAvatarImageUrl?: string;
  memberCount?: number;
  includesYou?: boolean;
}

interface ServerGroup extends ServerItem {
  entityType: EntityType.GROUP;
}

interface ServerResponse {
  recommendedUsers: ServerItem[];
}

enum EntityType {
  USER = 'USER',
  TEAM = 'TEAM',
  GROUP = 'GROUP',
}

const transformUser = (item: ServerItem): User | Team | Group | void => {
  const type = item.entityType;

  if (type === EntityType.USER) {
    const user = item as ServerUser;
    return {
      id: user.id,
      type: UserType,
      avatarUrl: user.avatarUrl,
      name: user.name,
      email: user.email,
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
      includesYou: team.includesYou,
      avatarUrl: team.largeAvatarImageUrl || team.smallAvatarImageUrl,
    };
  }

  if (type === EntityType.GROUP) {
    const group = item as ServerGroup;
    return {
      id: group.id,
      type: GroupType,
      name: group.name || '',
    };
  }

  return;
};

export const transformUsers = (serverResponse: ServerResponse): OptionData[] =>
  (serverResponse.recommendedUsers || [])
    .map(transformUser)
    .filter(user => !!user)
    .map(user => user as OptionData);
