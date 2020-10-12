// Copy this file to local-config.ts and customise.
export default {
  serviceConfig: {
    product: 'TEST',
    url: 'https://pf-frontendpubsub-service.dev.atl-paas.net',
    securityProvider: () => {
      return {
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3Ivc29tZXRoaW5nIn0.eyJqdGkiOiI5Mjc4MDA4Yi0wNWQwLTRkNjEtOGVhYS0yOWUwODYxZTU3OGEiLCJpYXQiOjE1MTk2MTQwMDcsImV4cCI6MTUxOTYxNDEzNywiYWNjb3VudElkIjoiNjY5IiwiaXNzIjoibWljcm9zL2VkZ2UtYXV0aGVudGljYXRvciIsInN1YiI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3IiLCJhdWQiOlsicGYtZnJvbnRlbmRwdWJzdWItc2VydmljZSJdfQ.oDHU6Ofn07ujTKYNsmnjdSyIQy8m1yvhMcP0Zr-jS1Yw3AR4AqIONB-H7i1bABIzlHvu5nILJWrmQkAZH-hWk5f4N4nQBtYhkjod_rM5-BhN79NIqNLTwheY8PbYMOtfiCQ0_xQThJCWsLR1iCNbj1oeHmMP7jNfl4j_TqabOZNVsCCzOx6nXGuhm-9U8AX8X9NyNPv3aYxRmPDth1ZdoGuJw9QrLrITGPw0KjitPIrqi_4pPfUZWTxYYEknJ9Qolf5fZqjnycoBiEpvMuyk_uU6uj8Xr62dUBCMhV6CggcDeona1d2TRx4f1BROskLYLWG0eZQaZPD1adPVByW0Pw',
        },
      };
    },
  },
};
