import fetchMock from 'fetch-mock/cjs/client';

import {
  parseAndTestGraphQLQueries,
  toBeValidAGGQuery,
} from '@atlassian/ptc-test-utils/graphql-jest';

import { AGGErrors, HttpError } from '../../util/errors';
import {
  addHeaders,
  buildGatewayQuery,
  convertTeam,
  extractIdFromAri,
  GATEWAY_QUERY_V2,
  getTeamFromAGG,
  idToAri,
} from '../getTeamFromAGG';
import * as gqlUtils from '../graphqlUtils';

const ARI_PREFIX = 'ari:cloud:identity::team';

const teamId = '1234-5678-abcd-89ef';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const TEAM_RESPONSE = {
  team: {
    largeAvatarImageUrl: 'https://example.com/picture',
    id: `${ARI_PREFIX}/${teamId}`,
    displayName: 'Cool team!',
    description: '',
    organizationId: 'abc',
    members: {
      nodes: [
        {
          member: {
            accountId: '1',
            name: 'Test user A',
            picture: 'https://example.com/picture/1',
          },
        },
        {
          member: {
            accountId: '2',
            name: 'Test user B',
            picture: 'https://example.com/picture/2',
          },
        },
        {
          member: {
            accountId: '3',
            name: 'Test user C',
            picture: 'https://example.com/picture/3',
          },
        },
      ],
    },
  },
};

describe('getTeamFromAGG', () => {
  describe('valid query', () => {
    toBeValidAGGQuery(GATEWAY_QUERY_V2);
    parseAndTestGraphQLQueries([GATEWAY_QUERY_V2]);
  });
  describe('extractIdFromAri', () => {
    it('should get id from ari correctly', () => {
      const ari = `${ARI_PREFIX}/${teamId}`;

      expect(extractIdFromAri(ari)).toEqual(teamId);
    });

    it('should get id if ari is just id', () => {
      expect(extractIdFromAri(teamId)).toEqual(teamId);
    });

    it('should get id from random ari', () => {
      expect(extractIdFromAri(`some:nonsense/${teamId}`)).toEqual(teamId);
    });
  });

  describe('idToAri', () => {
    it('should add ari prefix', () => {
      expect(idToAri(teamId)).toEqual(`${ARI_PREFIX}/${teamId}`);
    });
  });

  describe('convertTeam', () => {
    it('should convert team formats as expected', () => {
      expect(convertTeam(TEAM_RESPONSE)).toEqual({
        largeAvatarImageUrl: 'https://example.com/picture',
        id: teamId,
        displayName: 'Cool team!',
        description: '',
        organizationId: 'abc',
        members: [
          {
            id: '1',
            fullName: 'Test user A',
            avatarUrl: 'https://example.com/picture/1',
          },
          {
            id: '2',
            fullName: 'Test user B',
            avatarUrl: 'https://example.com/picture/2',
          },
          {
            id: '3',
            fullName: 'Test user C',
            avatarUrl: 'https://example.com/picture/3',
          },
        ],
      });
    });
  });

  describe('addHeaders', () => {
    it('should add headers for experiment', () => {
      const headers = new Headers();
      headers.append('Test', '123');

      const result = addHeaders(headers);

      expect(result.get('X-ExperimentalApi')).toEqual(
        'teams-beta, team-members-beta',
      );
    });

    it('should add headers for packageInfo', () => {
      const headers = new Headers();
      headers.append('Test', '123');

      const result = addHeaders(headers);

      expect(result.get('atl-client-name')).toEqual(packageName);
      expect(result.get('atl-client-version')).toEqual(packageVersion);
    });

    it('should return the same headers instance', () => {
      const headers = new Headers();
      headers.append('Test', '123');

      const result = addHeaders(headers);

      expect(result).toBe(headers);
    });

    it('should retain other headers', () => {
      const headers = new Headers();
      headers.append('Test', '123');

      const result = addHeaders(headers);

      expect(result.get('Test')).toBe('123');
    });
  });

  it('should build the correct gateway query', () => {
    const query = buildGatewayQuery({
      teamId: '12345',
      siteId: 'site-id',
    });
    expect(query.query.includes('teamV2')).toBe(true);
    expect(query.query.includes('siteId')).toBe(true);
    expect(query.variables.siteId).toBe('site-id');
  });

  describe('getTeamFromAGG', () => {
    const serviceUrl = 'test/url';

    afterEach(() => {
      fetchMock.restore();
      jest.resetAllMocks();
    });

    it('should return error when response is not ok', async () => {
      const status = 400;
      const traceId = '123';
      fetchMock.mock(serviceUrl, (_: any, __: any) => ({
        status,
        headers: {
          'atl-traceid': traceId,
        },
      }));

      await expect(getTeamFromAGG(serviceUrl, teamId)).rejects.toBeInstanceOf(
        HttpError,
      );
    });

    it('should return error when the response contains errors from AGG', async () => {
      const status = 403;
      const reason = 'TEAMS_FORBIDDEN';
      const traceId = '123';
      const source = 'test-error-source';
      const message = 'test-error-message';
      fetchMock.mock(serviceUrl, (_: any, __: any) => ({
        status: 200,
        body: {
          errors: [
            {
              extensions: {
                classification: reason,
                statusCode: status,
                errorSource: source,
              },
              message,
            },
          ],
          extensions: {
            gateway: {
              request_id: traceId,
            },
          },
        },
      }));

      expect.assertions(6);
      try {
        await getTeamFromAGG(serviceUrl, teamId);
      } catch (e) {
        expect(e).toBeInstanceOf(AGGErrors);
        expect((e as AGGErrors).errors.length).toEqual(1);
        expect((e as AGGErrors).errors[0].message).toEqual(message);
        expect((e as AGGErrors).errors[0].statusCode).toEqual(status);
        expect((e as AGGErrors).errors[0].classification).toEqual(reason);
        expect((e as AGGErrors).traceId).toEqual(traceId);
      }
    });

    it('should make the correct query', async () => {
      const gqlQuery = jest
        .spyOn(gqlUtils, 'AGGQuery')
        .mockImplementation(() => Promise.resolve({ Team: TEAM_RESPONSE }));

      await getTeamFromAGG(serviceUrl, teamId, 'site-id');

      expect(gqlQuery).toHaveBeenCalledWith(
        'test/url',
        expect.objectContaining({
          query: expect.stringContaining(
            'team: teamV2(id: $teamId, siteId: $siteId)',
          ),
          variables: {
            siteId: 'site-id',
            teamId: 'ari:cloud:identity::team/1234-5678-abcd-89ef',
          },
        }),
        expect.anything(),
      );
    });
  });
});
