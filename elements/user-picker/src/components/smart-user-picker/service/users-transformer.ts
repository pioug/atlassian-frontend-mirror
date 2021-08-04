import {
  User,
  Team,
  Group,
  TeamType,
  UserType,
  LozengeProps,
  GroupType,
  OptionData,
} from '../../../types';
import { messages } from '../../i18n';
import { InjectedIntl } from 'react-intl';

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
  attributes?: Record<string, string>;
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
  attributes?: Record<string, string>;
}

interface ServerResponse {
  recommendedUsers: ServerItem[];
  intl: InjectedIntl;
}

enum EntityType {
  USER = 'USER',
  TEAM = 'TEAM',
  GROUP = 'GROUP',
}

const getLozenzeProperties = (
  entity: ServerUser | ServerGroup,
  intl: InjectedIntl,
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
      appearance: 'new',
    };
  }

  return undefined;
};

const transformUser = (
  item: ServerItem,
  intl: InjectedIntl,
): User | Team | Group | void => {
  const type = item.entityType;

  if (type === EntityType.USER) {
    const user = item as ServerUser;

    const lozenge = getLozenzeProperties(user, intl);

    return {
      id: user.id,
      type: UserType,
      avatarUrl: user.avatarUrl,
      name: user.name,
      email: user.email,
      lozenge: lozenge,
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

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export const transformUsers = (
  serverResponse: ServerResponse,
  intl: InjectedIntl,
): OptionData[] =>
  (serverResponse.recommendedUsers || [])
    .map((item) => transformUser(item, intl))
    .filter((user) => !!user)
    .map((user) => user as OptionData);
