export default {
  meta: {
    access: 'granted',
    visibility: 'public',
    auth: [],
    definitionId: 'dc00272f-0cdd-43e1-92a9-c0ab00807c1a',
    key: 'iframely-object-provider',
    resourceType: 'youtube',
  },
  data: {
    '@type': 'Object',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    url: 'https://youtube-url/watch?v=video-id',
    name: 'The Atlassian Business Model',
    updated: '2015-12-10T14:30:00.000Z',
    summary:
      "Atlassian's product strategy, distribution model, and company culture work in concert to create unique value for its customers and a competitive advantage for the company.",
    generator: {
      '@type': 'Object',
      name: 'YouTube',
      icon: {
        '@type': 'Image',
        url: 'https://icon-url',
      },
    },
    icon: {
      '@type': 'Image',
      url: 'https://icon-url',
    },
    image: {
      '@type': 'Image',
      url: 'https://image-url',
    },
    preview: {
      '@type': 'Link',
      href: 'https://preview-url',
      'atlassian:aspectRatio': 1.7778,
    },
  },
};
