// Copy this file to local-config.ts and customise.
export default {
  recordConfig: {
    url: 'https://www.example.org/',
  },
  providers: [
    {
      url: 'https://www.example.org/emoji/standard',
    },
    {
      url: 'https://www.example.org/emoji/site-id/site',
      securityProvider: () => ({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    },
  ],
};
