// Copy this file to local-config.ts and customise.
export default {
  asap: {
    url: 'http://www.example.org/mentions',
    securityProvider: () => ({
      headers: {
        'X-Bogus-Authorization': 'Bearer asap_token',
      },
      omitCredentials: true,
    }),
  },
  sessionservice: {
    url: 'http://www.example.org/mentions/some-cloud-id',
    productId: 'micros-group/confluence',
    securityProvider: () => ({
      headers: {
        'X-Bogus-Authorization': 'Session-bearer session_service_token',
      },
    }),
  },
  sessionServiceWithTeam: {
    user: {
      url: 'http://www.example.org/mentions/some-cloud-id',
      productId: 'micros-group/confluence',
      securityProvider: () => ({
        headers: {
          'X-Bogus-Authorization': 'Session-bearer session_service_token',
        },
      }),
    },
    team: {
      url: 'http://www.example.org/teams/mentions',
      productId: 'micros-group/confluence',
      securityProvider: () => ({
        headers: {
          'X-Bogus-Authorization': 'Session-bearer session_service_token',
        },
      }),
    },
  },
};
