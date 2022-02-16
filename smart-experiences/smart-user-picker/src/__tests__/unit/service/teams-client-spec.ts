import fetchMock from 'fetch-mock/cjs/client';

import hydrateTeamFromLegion from '../../../service/teams-client';

const ID = '58538da6-333b-4e28-8f15-8aadc3961b62';

const legionResponse = {
  creatorDomain:
    'c6080332a525e35ccd7b699a80a128e49a0acce5009e275bfdbc4ad53814eb2b',
  creatorId: '5e15afb1e3b48c0daa0f5c7e',
  description: '',
  discoverable: 'DISCOVERABLE',
  displayName: 'Shipit-with-orgId',
  headerImageId: null,
  id: 'ari:cloud:teams::team/58538da6-333b-4e28-8f15-8aadc3961b62',
  largeAvatarImageUrl:
    'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/3.svg',
  largeHeaderImageUrl:
    'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/gradients/3.svg',
  membershipSettings: 'MEMBER_INVITE',
  organizationId: '3f97e0d7-a8ca-4263-91bf-3015999c8e64',
  permission: 'FULL_WRITE',
  restriction: 'NO_RESTRICTION',
  smallAvatarImageUrl:
    'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/3.svg',
  smallHeaderImageUrl:
    'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/gradients/3.svg',
};

const hydratedTeam = {
  id: '58538da6-333b-4e28-8f15-8aadc3961b62',
  name: legionResponse.displayName,
  type: 'team',
  avatarUrl: legionResponse.smallAvatarImageUrl,
};

const mockHydrationApi = ({ mockOverrideLegionResponse }: any) => {
  fetchMock.get(new RegExp('/gateway/api/v3/teams'), {
    ...legionResponse,
    ...mockOverrideLegionResponse,
  });
};

describe('default-value-hydration-client', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should transform Legion team response to Team option', async () => {
    mockHydrationApi({});

    const hydratedTransformedTeam = await hydrateTeamFromLegion({ id: ID });

    expect(fetchMock.called()).toBeTruthy();
    expect(hydratedTransformedTeam).toEqual(hydratedTeam);
  });

  it('should use original request team ID instead of response ID', async () => {
    const requestId = '123';
    mockHydrationApi({});

    const hydratedTransformedTeam = await hydrateTeamFromLegion({
      id: requestId,
    });

    expect(fetchMock.called()).toBeTruthy();
    expect(hydratedTransformedTeam).toEqual({ ...hydratedTeam, id: requestId });
  });

  it('should return Unknown if network error', async () => {
    const requestId = '123';
    fetchMock.catch(504);

    const hydratedTransformedTeam = await hydrateTeamFromLegion({
      id: requestId,
    });

    expect(fetchMock.called()).toBeTruthy();
    expect(hydratedTransformedTeam).toEqual({
      ...hydratedTeam,
      id: requestId,
      name: 'Unknown',
      avatarUrl: undefined,
    });
  });
});
