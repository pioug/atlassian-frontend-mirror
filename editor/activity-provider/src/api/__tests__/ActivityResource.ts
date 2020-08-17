import fetchMock from 'fetch-mock/es5/client';
import { graphql, buildSchema } from 'graphql';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
import ActivityResource, { makeGetRecentItemBody } from '../ActivityResource';
import { ActivityResponse } from '../../types';

const readFile = promisify(fs.readFile);

const activityUrl = '/graphql';
const cloudId = '123';

const getMockRecentResponse = (): ActivityResponse => ({
  data: {
    activities: {
      myActivities: {
        viewed: {
          nodes: [
            {
              id:
                'YXJpOmNsb3VkOmFjdGl2aXR5OkRVTU1ZLTE1OGM4MjA0LWZmM2ItNDdjMi1hZGJiLWEwOTA2Y2NjNzIyYjppdGVtLzE3MzM3MGZjNmJlYWRiNDI1YjYyMTJjZmQ5NjM4YWViZWRkMTUzMWUxZGU=',
              timestamp: '2020-06-24T01:15:39.680Z',
              object: {
                id:
                  'YXJpOmNsb3VkOmNvbmZsdWVuY2U6RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJiOmNvbnRlbnQvMTQ1NjgzNDI5MQ==',
                localResourceId: '159894',
                name: 'recent item 1',
                type: 'ISSUE',
                product: 'JIRA_SOFTWARE',
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                url: 'https://product-fabric.atlassian.net/browse/EDM-642',
                iconUrl:
                  'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype',
                containers: [
                  {
                    id:
                      'RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJi',
                    name: null,
                    type: 'SITE',
                    product: 'JIRA_SOFTWARE',
                  },
                  {
                    id:
                      'YXJpOmNsb3VkOmppcmE6RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJiOnByb2plY3QvMTMwNTU=',
                    name: 'Editor Media',
                    type: 'PROJECT',
                    product: 'JIRA_SOFTWARE',
                  },
                ],
              },
            },
            {
              id:
                'YXJpOmNsb3VkOmFjdGl2aXR5OkRVTU1ZLTE1OGM4MjA0LWZmM2ItNDdjMi1hZGJiLWEwOTA2Y2NjNzIyYjppdGVtLzE3MmUzZTA5MTNkMWJkYzE5NTgyMTU1ZTc5MmVhZDk2ZGQ4YzM1ZWE5NDc=',
              timestamp: '2020-06-24T01:10:44.797Z',
              object: {
                id:
                  'YXJpOmNsb3VkOmppcmE6RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJiOmlzc3VlLzE1OTk0MQ==',
                localResourceId: '159941',
                name: 'recent item 2',
                type: 'longIssue' as any,
                product: 'JIRA_SOFTWARE',
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                url: 'https://product-fabric.atlassian.net/browse/EDM-649',
                iconUrl:
                  'https://product-fabric.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype',
                containers: [
                  {
                    id:
                      'RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJi',
                    name: null,
                    type: 'SITE',
                    product: 'JIRA_SOFTWARE',
                  },
                  {
                    id:
                      'YXJpOmNsb3VkOmppcmE6RFVNTVktMTU4YzgyMDQtZmYzYi00N2MyLWFkYmItYTA5MDZjY2M3MjJiOnByb2plY3QvMTMwNTU=',
                    name: '',
                    type: 'PROJECT',
                    product: 'JIRA_SOFTWARE',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
});

describe('ActivityResource', () => {
  beforeEach(() => {
    fetchMock.mock({
      matcher: activityUrl,
      response: getMockRecentResponse(),
      name: 'recent',
    });
  });

  afterEach(fetchMock.restore);

  it('should validate against our graphql schema', async () => {
    const schemaFile = await readFile(
      join(__dirname, 'activities.graphql'),
      'utf8',
    );
    const activitySchema = buildSchema(schemaFile, { assumeValid: true });

    const result = await graphql(
      activitySchema,
      makeGetRecentItemBody(cloudId).query,
    );
    expect(result.errors).toBeUndefined();
  });

  it('should resolve recent items', async () => {
    const provider = new ActivityResource(activityUrl, cloudId);
    const items = await provider.getRecentItems();
    expect(items).toMatchSnapshot();
  });

  describe('search recent', () => {
    it('should return empty array with empty search term', async () => {
      const provider = new ActivityResource(activityUrl, cloudId);
      const items = await provider.searchRecent('');
      expect(items).toHaveLength(0);
    });

    it('should return empty array with search term that matches nothing', async () => {
      const provider = new ActivityResource(activityUrl, cloudId);
      const items = await provider.searchRecent('klasjfklajsf');
      expect(items).toHaveLength(0);
    });

    it('should perform case-insensitive prefix search on name property', async () => {
      const provider = new ActivityResource(activityUrl, cloudId);
      const items = await provider.searchRecent('recent');
      expect(items).toMatchSnapshot();
    });
  });
});
