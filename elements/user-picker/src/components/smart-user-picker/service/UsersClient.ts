import { getConfig } from '../config';
import { User, UserType } from '../../../types';

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface UsersRequest {
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

const getUsersById = (request: UsersRequest): Promise<User[]> => {
  const url = `${getConfig().getUsersServiceUrl(request.productKey)}`;

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

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export default getUsersById;
