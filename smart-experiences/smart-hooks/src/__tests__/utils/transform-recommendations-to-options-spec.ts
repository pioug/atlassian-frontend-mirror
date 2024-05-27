import { type IntlShape } from 'react-intl-next';

import { EntityType } from '@atlaskit/smart-common';

import transformRecommendationsToOptions from '../../utils/transform-recommendations-to-options';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl: IntlShape = {
  formatMessage: mockFormatMessage,
  defaultLocale: 'en',
} as unknown as IntlShape;

const mockServerUserWorkspaceMember = {
  id: 'id-user',
  avatarUrl: 'https://avatarurl.com',
  description: 'does things',
  displayName: 'group1',
  name: 'user1',
  entityType: EntityType.USER,
  email: 'user@atlassian.com',
  attributes: {
    workspaceMember: true,
  },
};

const mockServerUserCollaborator = {
  id: 'id-user',
  avatarUrl: 'https://avatarurl.com',
  description: 'does things',
  displayName: 'group1',
  name: 'user1',
  entityType: EntityType.USER,
  email: 'user@atlassian.com',
  attributes: {
    isConfluenceExternalCollaborator: true,
  },
};

const mockServerTeam = {
  id: 'id-team',
  avatarUrl: 'https://avatarurl.com',
  description: 'does things',
  displayName: 'team1',
  name: 'team1',
  teamAri: 'team:ari',
  entityType: EntityType.TEAM,
  largeAvatarImageUrl: 'https://large-avatarurl.com',
  smallAvatarImageUrl: 'https://small-avatarurl.com',
  memberCount: 5,
  includesYou: true,
};

const mockServerGroup = {
  id: 'id-group',
  avatarUrl: 'https://avatarurl.com',
  description: 'does things',
  displayName: 'group1',
  name: 'group1',
  entityType: EntityType.GROUP,
  attributes: {
    workSpaceMember: true,
  },
};

describe('transform recommendations to UserPicker options', () => {
  it('should correctly transform user option workspace member', async () => {
    const options = await transformRecommendationsToOptions(
      [mockServerUserWorkspaceMember],
      mockIntl,
    );

    expect(options).toMatchSnapshot('URS users workspace member');
  });

  it('should correctly transform user option workspace member', async () => {
    const options = await transformRecommendationsToOptions(
      [mockServerUserCollaborator],
      mockIntl,
    );

    expect(options).toMatchSnapshot('URS users collaborator');
  });

  it('should correctly transform team option', async () => {
    const options = await transformRecommendationsToOptions(
      [mockServerTeam],
      mockIntl,
    );

    expect(options).toMatchSnapshot('URS teams');
  });

  it('should correctly transform group option', async () => {
    const options = await transformRecommendationsToOptions(
      [mockServerGroup],
      mockIntl,
    );

    expect(options).toMatchSnapshot('URS groups');
  });

  // it('should correctly transform user option', async () => {});
});
