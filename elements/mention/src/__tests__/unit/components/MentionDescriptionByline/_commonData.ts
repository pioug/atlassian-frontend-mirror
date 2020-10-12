import {
  MentionDescription,
  UserAccessLevel,
  UserType,
} from '../../../../types';

export const userMention: MentionDescription = {
  id: '12345',
  avatarUrl: 'www.example.com/image.png',
  nickname: 'Test User',
  accessLevel: UserAccessLevel[UserAccessLevel.CONTAINER],
  userType: UserType[UserType.APP],
};

export const teamMention: MentionDescription = {
  id: '12345',
  avatarUrl: 'www.example.com/image.png',
  name: 'Test team',
  accessLevel: UserAccessLevel[UserAccessLevel.CONTAINER],
  userType: UserType[UserType.TEAM],
  context: {
    members: [
      {
        id: 'user-1234',
        name: 'Test User',
      },
    ],
    includesYou: true,
    memberCount: 5,
    teamLink: '/wiki/people/team/12345',
  },
};
