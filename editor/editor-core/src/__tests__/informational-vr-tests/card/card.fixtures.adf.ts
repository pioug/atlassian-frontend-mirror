export const embedCardNotFoundAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl/notFound',
        layout: 'center',
      },
    },
  ],
};

export const embedCardResolvingAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl/resolving',
        layout: 'center',
      },
    },
  ],
};

export const embedCardForbiddenAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl/forbidden',
        layout: 'center',
      },
    },
  ],
};
