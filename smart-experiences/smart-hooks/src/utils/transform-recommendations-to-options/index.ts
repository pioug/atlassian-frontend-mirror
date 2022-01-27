import { IntlShape } from 'react-intl-next';

import { EntityType, UserSearchItem } from '@atlaskit/smart-common';
import {
  Group,
  GroupType,
  LozengeProps,
  OptionData,
  Team,
  TeamType,
  User,
  UserType,
} from '@atlaskit/user-picker';

import { messages } from '../../messages';

interface ServerUser extends UserSearchItem {
  name: string;
  entityType: EntityType.USER;
  avatarUrl: string;
  email?: string;
  attributes?: Record<string, string>;
}

interface ServerTeam extends UserSearchItem {
  displayName?: string;
  entityType: EntityType.TEAM;
  description?: string;
  largeAvatarImageUrl?: string;
  smallAvatarImageUrl?: string;
  memberCount?: number;
  includesYou?: boolean;
}

interface ServerGroup extends UserSearchItem {
  entityType: EntityType.GROUP;
  attributes?: Record<string, string>;
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
      appearance: 'new',
    };
  }

  return undefined;
};

const transformRecommendation = (
  item: UserSearchItem,
  intl: IntlShape,
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

export default (
  recommendations: UserSearchItem[],
  intl: IntlShape,
): OptionData[] =>
  (recommendations || [])
    .map((item) => transformRecommendation(item, intl))
    .filter((option) => !!option)
    .map((option) => option as OptionData);
