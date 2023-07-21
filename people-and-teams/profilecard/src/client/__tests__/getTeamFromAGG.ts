import fetchMock from 'fetch-mock/cjs/client';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import {
  addHeaders,
  buildGatewayQuery,
  convertTeam,
  extractIdFromAri,
  GATEWAY_QUERY,
  GATEWAY_QUERY_V2,
  getTeamFromAGG,
  idToAri,
} from '../getTeamFromAGG';
import * as gqlUtils from '../graphqlUtils';

jest.mock('@atlaskit/platform-feature-flags');

const ARI_PREFIX = 'ari:cloud:identity::team';

const teamId = '1234-5678-abcd-89ef';

describe('getTeamFromAGG', () => {
  parseAndTestGraphQLQueries([GATEWAY_QUERY, GATEWAY_QUERY_V2]);

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

      expect(result.get('atl-client-name')).toEqual('@atlaskit/profilecard');
      expect(result.get('atl-client-version')).toEqual('999.9.9');
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

  describe.each([[true], [false]])(
    'buildGatewayQuery - site-scoped %s',
    (siteScopedEnabled) => {
      beforeEach(() => {
        (getBooleanFF as jest.Mock).mockImplementation(() => siteScopedEnabled);
      });
      it('should build the correct gateway query', () => {
        const query = buildGatewayQuery({
          teamId: '12345',
          siteId: 'site-id',
        });
        expect(query.query.includes('teamV2')).toBe(siteScopedEnabled);
        expect(query.query.includes('siteId')).toBe(siteScopedEnabled);
        expect(query.variables.siteId).toBe(
          siteScopedEnabled ? 'site-id' : undefined,
        );
      });
    },
  );

  describe('getTeamFromAGG', () => {
    const serviceUrl = 'test/url';

    afterEach(() => {
      fetchMock.restore();
      jest.resetAllMocks();
    });

    it('should return error when response is not ok', async () => {
      const status = 400;
      const statusText = 'Bad Request';
      const traceId = '123';
      fetchMock.mock(serviceUrl, (_: any, __: any) => ({
        status,
        headers: {
          'atl-traceid': traceId,
        },
      }));

      await expect(getTeamFromAGG(serviceUrl, teamId)).rejects.toEqual({
        code: status,
        reason: statusText,
        traceId,
      });
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

      await expect(getTeamFromAGG(serviceUrl, teamId)).rejects.toEqual({
        code: status,
        reason,
        traceId,
        source,
        message,
      });
    });

    it.each([
      [
        true,
        expect.objectContaining({
          query: expect.stringContaining(
            'team: teamV2(id: $teamId, siteId: $siteId)',
          ),
          variables: {
            siteId: 'site-id',
            teamId: 'ari:cloud:identity::team/1234-5678-abcd-89ef',
          },
        }),
      ],
      [
        false,
        expect.objectContaining({
          query: expect.stringContaining('team(id: $teamId)'),
          variables: {
            teamId: 'ari:cloud:identity::team/1234-5678-abcd-89ef',
          },
        }),
      ],
    ])(
      'should make the correct query - site scoped %s',
      async (siteScopedTeamsEnabled, expectedObject) => {
        const gqlQuery = jest
          .spyOn(gqlUtils, 'graphqlQuery')
          .mockImplementation(() => Promise.resolve({ Team: TEAM_RESPONSE }));
        (getBooleanFF as jest.Mock).mockImplementation(
          () => siteScopedTeamsEnabled,
        );

        await getTeamFromAGG(serviceUrl, teamId, 'site-id');

        expect(gqlQuery).toHaveBeenCalledWith(
          'test/url',
          expectedObject,
          expect.anything(),
        );
      },
    );
  });
});
