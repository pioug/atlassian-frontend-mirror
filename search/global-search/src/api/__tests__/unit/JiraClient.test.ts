import { utils } from '@atlaskit/util-service-support';

import JiraClientImpl, { JiraClient } from '../../JiraClient';
import {
  JiraRecentResponse,
  TransformedResponse,
} from '../../../../example-helpers/mocks/jiraRecentResponseData';
import { jiraRecentResponseWithAttributes } from '../../../../example-helpers/mocks/jiraRecentResponseDataWithAttributes';
import { ContentType, JiraResult } from '../../../model/Result';

const url = 'https://www.example.jira.dev.com/';
const cloudId = 'cloudId';
const isUserAnonymous = false;
const RECENT_PATH = 'rest/internal/2/productsearch/recent';
const MY_PERMISSION_PATH = 'rest/api/2/mypermissions?permissions=USER_PICKER';

const EXCEPTION_CASES = [
  () => Promise.reject(new Error('error occured during request')),
  () => {
    throw new Error('general error');
  },
  () => 'invalid response will fail during transformation',
];

describe('JiraClient', () => {
  let requestSpy: jest.SpyInstance;
  let jiraClient: JiraClient;

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService');

    requestSpy.mockReturnValue(Promise.resolve(undefined));

    jiraClient = new JiraClientImpl(url, cloudId, isUserAnonymous);
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  describe('canSearchPeople', () => {
    it('should call correct permissions endpoint', async () => {
      jiraClient.canSearchUsers();

      expect(requestSpy).toHaveBeenCalledTimes(1);

      const serviceConfigParam = requestSpy.mock.calls[0][0];
      expect(serviceConfigParam).toHaveProperty('url', url);

      const requestOptions = requestSpy.mock.calls[0][1];
      expect(requestOptions).toHaveProperty('path', MY_PERMISSION_PATH);
    });

    it('should only request permissions once', async () => {
      requestSpy.mockReturnValue(
        Promise.resolve({
          permissions: {
            USER_PICKER: {
              id: '27',
              key: 'USER_PICKER',
              name: 'Browse users and groups',
              type: 'GLOBAL',
              description: 'Description',
              havePermission: true,
            },
          },
        }),
      );

      await jiraClient.canSearchUsers();
      await jiraClient.canSearchUsers();

      expect(requestSpy).toHaveBeenCalledTimes(1);
    });

    EXCEPTION_CASES.forEach(exceptionImpl => {
      it('should throw exception if request fails', async () => {
        requestSpy.mockImplementation(exceptionImpl);
        try {
          await jiraClient.canSearchUsers();
          expect(true).toBe(false); // should never reach this line
        } catch (e) {
          expect(e).not.toBeNull();
        }
      });
    });

    it('should correctly parse the value when permission is present and true', async () => {
      requestSpy.mockReturnValue(
        Promise.resolve({
          permissions: {
            USER_PICKER: {
              id: '27',
              key: 'USER_PICKER',
              name: 'Browse users and groups',
              type: 'GLOBAL',
              description: 'Description',
              havePermission: true,
            },
          },
        }),
      );

      const result = await jiraClient.canSearchUsers();

      expect(result).toEqual(true);
    });

    it('should correctly parse the value when permission is present and false', async () => {
      requestSpy.mockReturnValue(
        Promise.resolve({
          permissions: {
            USER_PICKER: {
              id: '27',
              key: 'USER_PICKER',
              name: 'Browse users and groups',
              type: 'GLOBAL',
              description: 'Description',
              havePermission: false,
            },
          },
        }),
      );

      const result = await jiraClient.canSearchUsers();

      expect(result).toEqual(false);
    });

    it('should correctly parse the value when permissions are not present', async () => {
      requestSpy.mockReturnValue(
        Promise.resolve({
          permissions: {},
        }),
      );

      const result = await jiraClient.canSearchUsers();

      expect(result).toEqual(false);
    });
  });

  describe('getRecentItems', () => {
    it('should call remote endpoint with correct params', () => {
      const sessionId = 'sessionId-1';
      const counts = {
        issues: 7,
        projects: 5,
        boards: 3,
        filters: 1,
      };

      jiraClient.getRecentItems(sessionId, counts);

      expect(requestSpy).toHaveBeenCalledTimes(1);

      const serviceConfigParam = requestSpy.mock.calls[0][0];
      expect(serviceConfigParam).toHaveProperty('url', url);

      const requestOptions = requestSpy.mock.calls[0][1];
      expect(requestOptions).toHaveProperty('path', RECENT_PATH);
      expect(requestOptions.queryParams).toMatchObject({
        search_id: sessionId,
        counts: 'issues=7,projects=5,boards=3,filters=1',
      });
    });

    it('should not call endpoint when user is anonymous', () => {
      jiraClient = new JiraClientImpl(url, cloudId, true);
      const sessionId = 'sessionId-1';
      const counts = {
        issues: 7,
        projects: 5,
        boards: 3,
        filters: 1,
      };

      jiraClient.getRecentItems(sessionId, counts);

      expect(requestSpy).toHaveBeenCalledTimes(0);
    });

    EXCEPTION_CASES.forEach(mockImpl => {
      it('should throws exception on error calling request', async () => {
        requestSpy.mockImplementation(mockImpl);
        try {
          await jiraClient.getRecentItems('sessionId-2');
          expect(true).toBe(false); // should never reach this line
        } catch (e) {
          expect(e).not.toBeNull();
        }
      });
    });

    [
      [[], []],
      [JiraRecentResponse, TransformedResponse],
    ].forEach(([jiraResponse, transformedResponse]) => {
      it('should transform valid response without error', async () => {
        requestSpy.mockReturnValue(Promise.resolve(jiraResponse));
        const result = await jiraClient.getRecentItems('session');
        expect(result).toEqual(transformedResponse);
      });
    });

    describe('Jira responses with attributes', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(
          Promise.resolve(jiraRecentResponseWithAttributes),
        );
      });

      const extractContainerId = (result: JiraResult[], types: ContentType[]) =>
        result
          .filter(({ contentType }) => types.includes(contentType))
          .map(({ containerId }) => containerId);

      it('should return correct container id', async () => {
        const result = await jiraClient.getRecentItems('session');
        const containerIds = extractContainerId(result, [
          ContentType.JiraIssue,
          ContentType.JiraBoard,
        ]);
        expect(containerIds).toEqual([
          '10000',
          '10000',
          '47720',
          '42023',
          '67401',
          '57420',
          '42023',
          '37300',
          '78096',
          '77816',
        ]);
        const projectsContainerId = extractContainerId(result, [
          ContentType.JiraProject,
        ]);
        projectsContainerId.forEach((containerId: any) =>
          expect(containerId).toBeUndefined(),
        );
        const filtersContainerId = extractContainerId(result, [
          ContentType.JiraFilter,
        ]);
        expect(filtersContainerId.length).toBe(1);
        expect(filtersContainerId[0]).toEqual(
          'b777fa0a-cd87-4cf7-b64f-00d24feb16eb',
        );
      });

      it('should transform issue type and key to container name and object key', async () => {
        const result = await jiraClient.getRecentItems('session');
        const issuesTypeAndKey = result
          .filter(({ contentType }) => contentType === ContentType.JiraIssue)
          .map(({ containerName, objectKey }) => ({
            containerName,
            objectKey,
          }));
        expect(issuesTypeAndKey).toEqual([
          { containerName: 'Bug', objectKey: 'JDEV-38497' },
          { containerName: 'Bug', objectKey: 'JDEV-39110' },
          { containerName: 'Story', objectKey: 'VPP-1379' },
          { containerName: 'Task', objectKey: 'NEXT-6112' },
          { containerName: 'Story', objectKey: 'BENTO-1564' },
          { containerName: 'Bug', objectKey: 'JOOME-22' },
          { containerName: 'Task', objectKey: 'NEXT-5876' },
        ]);
      });

      it('should extract container name for boards', async () => {
        const result = await jiraClient.getRecentItems('session');
        const boardContainers = result
          .filter(({ contentType }) => contentType === ContentType.JiraBoard)
          .map(({ containerName }) => containerName);
        expect(boardContainers).toEqual([
          'Ky Pham',
          'Endeavour - Jira SPA',
          'Jira Data Integrity',
        ]);
        const boardObjectKeys = result
          .filter(({ contentType }) => contentType === ContentType.JiraBoard)
          .map(({ objectKey }) => objectKey);
        boardObjectKeys.forEach(key => expect(key).toBeUndefined());
      });
    });
  });
});
