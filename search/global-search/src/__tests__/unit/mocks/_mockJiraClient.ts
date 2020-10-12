import { JiraResult } from '../../../model/Result';
import { JiraClient } from '../../../api/JiraClient';

const mockJiraClient = (
  recentPromise: () => Promise<JiraResult[]>,
  canSearchUsersPromise: () => Promise<boolean>,
): JiraClient => ({
  getRecentItems: jest.fn(recentPromise),
  canSearchUsers: jest.fn(canSearchUsersPromise),
});

export const mockErrorJiraClient = (
  error: Error,
  canSearchUsers: boolean = true,
) =>
  mockJiraClient(
    () => Promise.reject(error),
    () => Promise.resolve(canSearchUsers),
  );
export const mockNoResultJiraClient = (canSearchUsers: boolean = true) =>
  mockJiraClient(
    () => Promise.resolve([]),
    () => Promise.resolve(canSearchUsers),
  );
export const mockJiraClientWithData = (
  jiraResults: JiraResult[],
  canSearchUsers: boolean = true,
) =>
  mockJiraClient(
    () => Promise.resolve(jiraResults),
    () => Promise.resolve(canSearchUsers),
  );
