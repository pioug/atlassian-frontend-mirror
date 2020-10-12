// Copy this file to local-config.ts and customise.
export default {
  recordConfig: {
    url: 'https://emoji-example/',
  },
  providers: [
    {
      url: 'https://emoji-example/emoji/standard',
    },
    {
      url: 'https://emoji-example/emoji/site-id/site',
      securityProvider: () => ({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    },
  ],
};
