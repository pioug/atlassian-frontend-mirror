import fetchMock from 'fetch-mock/cjs/client';
import {
  DefaultValue,
  UserType,
  OptionIdentifier,
} from '@atlaskit/user-picker';

import { hydrateDefaultValues } from '../../../service';

import getHydratedUsers from '../../../service/users-client';
import hydrateTeamFromLegion from '../../../service/teams-client';
jest.mock('../../../service/users-client', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock('../../../service/teams-client', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

const PEOPLE = 'people';

const BASE_URL = '';

const defaultUserValues: DefaultValue = [
  {
    id: '1',
    type: 'user',
  },
];

const defaultTeamValues: DefaultValue = [
  {
    id: '10',
    type: 'team',
  },
];

const jiraUsersResponse = {
  values: [
    {
      accountId: '1',
      avatarUrls: {
        '16x16': 'https://avatarurl.com',
      },
      displayName: 'John Smith',
      emailAddress: 'jsmith@atlassian.com',
    },
  ],
};

const confUsersResponse = {
  results: [
    {
      accountId: '1',
      profilePicture: {
        path: 'https://avatarurl.com',
      },
      publicName: 'John Smith',
      email: 'jsmith@atlassian.com',
    },
  ],
};

type UserType = 'user';

const userType: UserType = 'user';

const hydratedUsers = [
  {
    id: '1',
    name: 'John Smith',
    avatarUrl: 'https://avatarurl.com',
    type: userType,
    email: 'jsmith@atlassian.com',
  },
];

const hydratedTeams = [
  {
    id: '10',
    name: 'Edison Team',
    avatarUrl: 'https://avatarurl.com',
    type: 'team',
  },
];

function mockHydrationApi({
  mockJiraUsersResponse,
  mockConfUsersResponse,
}: any) {
  fetchMock.get(
    new RegExp('/rest/api/3/user/bulk*'),
    mockJiraUsersResponse ?? jiraUsersResponse,
  );
  fetchMock.get(
    new RegExp('/wiki/rest/api/user/bulk*'),
    mockConfUsersResponse ?? confUsersResponse,
  );
}

describe('default-value-hydration-client', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  it('should hydrate jira default user', async () => {
    mockHydrationApi({ mockJiraUsersResponse: jiraUsersResponse });

    const hydratedValues = await hydrateDefaultValues(
      BASE_URL,
      defaultUserValues,
      'jira',
    );

    expect(fetchMock.called()).toBeTruthy();
    expect(hydratedValues).toEqual(hydratedUsers);
  });

  it('should hydrate conf default user', async () => {
    mockHydrationApi({
      mockJiraUsersResponse: jiraUsersResponse,
      mockConfUsersResponse: confUsersResponse,
    });

    const hydratedValues = await hydrateDefaultValues(
      BASE_URL,
      defaultUserValues,
      'confluence',
    );

    expect(fetchMock.called()).toBeTruthy();
    expect(hydratedValues).toEqual(hydratedUsers);
  });

  it('should not hydrate if defaultUserValues is already hydrated', async () => {
    mockHydrationApi({ mockJiraUsersResponse: jiraUsersResponse });

    const hydratedValues = await hydrateDefaultValues(
      BASE_URL,
      hydratedUsers,
      'jira',
    );

    expect(fetchMock.called()).toBeFalsy();
    expect(hydratedValues).toEqual(hydratedUsers);
  });

  it('should return Unknown user if the id is not known', async () => {
    mockHydrationApi({ mockJiraUsersResponse: jiraUsersResponse });
    const unknownUser = {
      id: 'idunknown',
      type: userType,
    };

    const results = await hydrateDefaultValues(
      BASE_URL,
      [unknownUser, ...defaultUserValues],
      'jira',
    );

    expect(fetchMock.called()).toBeTruthy();
    //Note the order from defaultUserValues should be preserved despite the order of the returned usersById
    expect(results).toEqual([
      {
        id: 'idunknown',
        type: 'user',
        name: 'Unknown',
      },
      ...hydratedUsers,
    ]);
  });

  it('should not hydrate if empty', async () => {
    mockHydrationApi({ mockJiraUsersResponse: jiraUsersResponse });

    const results = await hydrateDefaultValues(BASE_URL, [], 'jira');

    expect(fetchMock.called()).toBeFalsy();
    expect(results).toEqual([]);
  });

  describe('For non-jira/conf', () => {
    let getHydratedUsersMock = getHydratedUsers as jest.Mock;
    let hydrateTeamFromLegionMock = hydrateTeamFromLegion as jest.Mock;

    const mockPrsClient = (users: DefaultValue) => {
      getHydratedUsersMock.mockReturnValue(
        Promise.resolve(
          (users as OptionIdentifier[]).map((user) => ({
            id: user.id,
            name: 'John Smith',
            avatarUrl: 'https://avatarurl.com',
            type: userType,
            email: 'jsmith@atlassian.com',
          })),
        ),
      );
    };

    const mockLegionClient = (teams: DefaultValue) => {
      (teams as OptionIdentifier[]).forEach((team) => {
        hydrateTeamFromLegionMock.mockReturnValueOnce(
          Promise.resolve({
            id: team.id,
            name: 'Edison Team',
            type: 'team',
            avatarUrl: 'https://avatarurl.com',
          }),
        );
      });
    };

    it('should use the PRS client to hydrate users', async () => {
      mockPrsClient(defaultUserValues);

      const hydratedValues = await hydrateDefaultValues(
        BASE_URL,
        defaultUserValues,
        PEOPLE,
      );

      expect(getHydratedUsersMock).toHaveBeenCalled();
      expect(hydrateTeamFromLegionMock).not.toHaveBeenCalled();
      expect(hydratedValues).toEqual(hydratedUsers);
    });

    it('should use Legion to hydrate teams', async () => {
      mockLegionClient(defaultTeamValues);

      const hydratedValues = await hydrateDefaultValues(
        BASE_URL,
        defaultTeamValues,
        PEOPLE,
      );

      expect(getHydratedUsersMock).not.toHaveBeenCalled();
      expect(hydrateTeamFromLegionMock).toHaveBeenCalled();
      expect(hydratedValues).toEqual(hydratedTeams);
    });

    it('should call Legion once for each team', async () => {
      const defaultValues = [...defaultTeamValues, { id: '11', type: 'team' }];
      mockLegionClient(defaultValues as DefaultValue);
      const expectedResult = [
        ...hydratedTeams,
        {
          ...hydratedTeams[0],
          id: '11',
        },
      ];

      const hydratedValues = await hydrateDefaultValues(
        BASE_URL,
        [...defaultTeamValues, { id: '11', type: 'team' }],
        PEOPLE,
      );

      expect(getHydratedUsersMock).not.toHaveBeenCalled();
      expect(hydrateTeamFromLegionMock).toHaveBeenCalledTimes(2);
      expect(hydratedValues).toEqual(expectedResult);
    });

    it('should use both PRS and Legion to hydrate user-teams', async () => {
      const defaultValues = [...defaultTeamValues, ...defaultUserValues];
      mockLegionClient(defaultTeamValues);
      mockPrsClient(defaultUserValues);
      const expectedResult = [...hydratedTeams, ...hydratedUsers];

      const hydratedValues = await hydrateDefaultValues(
        BASE_URL,
        defaultValues,
        PEOPLE,
      );

      expect(getHydratedUsersMock).toHaveBeenCalled();
      expect(hydrateTeamFromLegionMock).toHaveBeenCalled();
      expect(hydratedValues).toEqual(expectedResult);
    });
  });
});
