import { avatar2, avatar3, iconTrello, image1 } from '../../examples/images';

const baseMetaData = {
  visibility: 'restricted',
  access: 'granted',
  version: '2509',
  key: 'trello-object-provider',
};

export const TrelloBoard = {
  meta: {
    ...baseMetaData,
    resourceType: 'board',
  },
  data: {
    '@id': 'https://trellis.coffee/b/4XkW4AJC',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'atlassian:Project',
    generator: {
      '@type': 'Application',
      name: 'Trello',
      icon: {
        '@type': 'Image',
        url: iconTrello,
      },
    },
    icon: {
      '@type': 'Image',
      url: iconTrello,
    },
    url: 'https://trellis.coffee/b/4XkW4AJC',
    'atlassian:isDeleted': false,
    'atlassian:member': {
      items: [
        {
          '@type': 'Person',
          name: 'Adil Bhayani',
          icon: avatar3,
        },
      ],
      totalItems: 1,
    },
    name: 'A test board in staging',
    summary:
      'This is the description of the test board. Feel free to play around in this staging instance.',
    image: {
      '@type': 'Image',
      url: image1,
    },
    location: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'atlassian:Project',
      name: 'userworkspace73847528',
      url: 'https://trellis.coffee/w/userworkspace73847528',
    },
    preview: {
      '@type': 'Link',
      'atlassian:supportedPlatforms': ['web'],
      href: 'https://preview-url',
    },
  },
};

export const TrelloCard = {
  meta: {
    ...baseMetaData,
    resourceType: 'card',
  },
  data: {
    '@id': 'https://trellis.coffee/c/PPkz6M3s',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    generator: {
      '@type': 'Application',
      name: 'Trello',
      icon: {
        '@type': 'Image',
        url: iconTrello,
      },
    },
    icon: {
      '@type': 'Image',
      url: iconTrello,
    },
    '@type': 'atlassian:Project',
    url: 'https://trellis.coffee/c/PPkz6M3s',
    'atlassian:attachmentCount': 3,
    location: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'atlassian:Project',
      name: 'Public Board',
      url: 'https://trellis.coffee/b/lQazxNTe/public-board',
    },
    'atlassian:isDeleted': false,
    'atlassian:member': {
      items: [
        {
          '@type': 'Person',
          name: 'Luke Dahill',
          icon: avatar2,
        },
      ],
      totalItems: 1,
    },
    endTime: '2025-11-10T20:13:00.000Z',
    name: 'Example Card with due date, member, attachments, and cover',
    summary:
      'This is an example card to test the hover preview. Ideally this should show a due date, member set, and attachment count in a hover preview card.',
    'atlassian:state': 'List 1',
    image: {
      '@type': 'Image',
      url: image1,
    },
    'schema:commentCount': 1,
  },
};
