import {
  type DefaultValue,
  type OptionData,
  type OptionIdentifier,
  type User,
  UserType,
  type Team,
} from '@atlaskit/user-picker';

import { config } from '../config';
import getHydratedUsersFromPrs from './users-client';
import hydrateTeamFromLegion from './teams-client';
import { UNKNOWN } from './constants';

export interface UsersRequest {
  baseUrl: string | undefined;
  accountIds: string[];
  productKey: 'jira' | 'confluence';
}

interface JiraUserResponse {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraUserItem[];
}

interface JiraUserItem {
  accountId: string;
  emailAddress: string;
  avatarUrls: {
    [key: string]: string;
  };
  displayName: string;
}

interface ConfluenceUserResponse {
  limit: number;
  start: number;
  size: number;
  results: ConfluenceUserItem[];
}

interface ProfilePicture {
  path: string;
}

interface ConfluenceUserItem {
  accountId: string;
  email: string;
  profilePicture: ProfilePicture;
  publicName: string;
}

const getHydratedUsersFromProducts = (
  request: UsersRequest,
): Promise<User[]> => {
  const url = `${config.getUsersServiceUrl(
    request.productKey,
    request.baseUrl,
  )}`;
  let params = new URLSearchParams();
  request.accountIds.map((id) => params.append('accountId', id));
  params.append('maxResults', '2000');
  return fetch(`${url}?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling users service, statusCode=${response.status}, statusText=${response.statusText}`,
      });
    })
    .then(
      request.productKey === 'jira'
        ? transformJiraUsers
        : transformConfluenceUsers,
    );
};

const transformJiraUsers = (userResponse: JiraUserResponse): User[] =>
  userResponse.values
    .map(transformJiraUser)
    .filter((user) => !!user)
    .map((user) => user as User);

const transformJiraUser = (item: JiraUserItem): User | null => {
  if (!item) {
    return null;
  }
  return {
    id: item.accountId,
    type: UserType,
    avatarUrl: item.avatarUrls ? item.avatarUrls['16x16'] : '',
    name: item.displayName,
    email: item.emailAddress,
  };
};

const transformConfluenceUsers = (
  userResponse: ConfluenceUserResponse,
): User[] =>
  userResponse.results
    .map(transformConfluenceUser)
    .filter((user) => !!user)
    .map((user) => user as User);

const transformConfluenceUser = (item: ConfluenceUserItem): User | null => {
  if (!item) {
    return null;
  }
  return {
    id: item.accountId,
    type: UserType,
    avatarUrl: item.profilePicture ? item.profilePicture.path : '',
    name: item.publicName,
    email: item.email,
  };
};

const sortResults = (
  options: OptionData[],
  sortIds: OptionIdentifier[],
): OptionData[] => {
  const resultsMap = new Map<string, OptionData>(
    options.map(
      (option) => [option && option.id, option] as [string, OptionData],
    ),
  );

  return sortIds.map((option) => {
    const user = resultsMap.get(option.id);
    if (user) {
      return user;
    }

    return {
      id: option.id,
      type: option.type,
      name: UNKNOWN,
    };
  });
};

const isOptionData = (
  option: OptionData | OptionIdentifier,
): option is OptionData => {
  return (option as OptionData).name !== undefined;
};

const hydrateTeamIds = async (
  baseUrl: string | undefined,
  values: OptionIdentifier[],
): Promise<Team[]> => {
  if (values.length === 0) {
    return [];
  }
  const legionPromises = values.map((value) =>
    hydrateTeamFromLegion({ baseUrl, id: value.id }),
  );
  return await Promise.all(legionPromises);
};

const hydrateAccountIds = async (
  baseUrl: string | undefined,
  productKey: string,
  values: OptionIdentifier[],
): Promise<OptionData[]> => {
  if (values.length === 0) {
    return [];
  }
  const accountIds = values.map((val: OptionIdentifier) => val.id);

  //if we are not jira or confluence then use PRS platform hydration
  return productKey === 'jira' || productKey === 'confluence'
    ? await getHydratedUsersFromProducts({
        baseUrl,
        productKey,
        accountIds,
      })
    : await getHydratedUsersFromPrs(baseUrl, accountIds);
};

async function hydrateDefaultValues(
  baseUrl: string | undefined,
  value: DefaultValue,
  productKey: string,
): Promise<DefaultValue> {
  //return if no value
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return [];
  }

  const values: OptionData[] | OptionIdentifier[] = Array.isArray(value)
    ? value
    : [value];

  // return if all hydrated
  if (!values.some((val) => !isOptionData(val))) {
    return value;
  }

  const [hydratedUsers, hydratedTeams] = await Promise.all([
    hydrateAccountIds(
      baseUrl,
      productKey,
      values.filter((val) => !isOptionData(val) && val.type === 'user'),
    ),
    hydrateTeamIds(
      baseUrl,
      values.filter((val) => !isOptionData(val) && val.type === 'team'),
    ),
  ]);

  const hydratedOptions = values
    .filter((val) => isOptionData(val))
    .map((val) => val as OptionData)
    .concat(hydratedUsers)
    .concat(hydratedTeams);

  return sortResults(hydratedOptions, values);
}

export default hydrateDefaultValues;
