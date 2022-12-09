import { avatar2, avatar3 } from '../../examples/images';

export const TrelloBoard = {
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
      url: 'https://fd-assets.prod.atl-paas.net/image/logos/contrib/trello/icons/blue.svg',
    },
  },
  '@type': 'atlassian:Project',
  url: 'https://project-url',
  icon: {
    '@type': 'Image',
    url: 'https://fd-assets.prod.atl-paas.net/image/logos/contrib/trello/icons/neutral.svg',
  },
  'atlassian:isDeleted': false,
  'atlassian:member': {
    totalItems: 1,
    items: [
      { '@type': 'Person', icon: avatar3, name: 'Aliza' },
      { '@type': 'Person', icon: avatar2, name: 'Steve' },
    ],
  },
  name: 'Lorem ipsum dolor sit amet',
  summary:
    'Cras ut nisi vitae lectus sagittis mattis. Curabitur a urna feugiat, laoreet enim ac, lobortis diam.',
  preview: {
    '@type': 'Link',
    'atlassian:supportedPlatforms': ['web'],
    href: 'https://preview-url',
  },
};

export const TrelloCard = {
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
      url: 'https://fd-assets.prod.atl-paas.net/image/logos/contrib/trello/icons/blue.svg',
    },
  },
  '@type': 'atlassian:Task',
  url: 'https://project-url',
  'atlassian:isDeleted': false,
  'atlassian:member': {
    totalItems: 1,
    items: [
      { '@type': 'Person', icon: avatar3, name: 'Aliza' },
      { '@type': 'Person', icon: avatar2, name: 'Steve' },
    ],
  },
  name: 'Trello Card Title',
  summary:
    'Cras ut nisi vitae lectus sagittis mattis. Curabitur a urna feugiat, laoreet enim ac, lobortis diam.',
  'atlassian:attachmentCount': 2,
  'atlassian:checkItems': {
    checkedItems: 2,
    totalItems: 3,
  },
  'atlassian:commentCount': 11,
  'atlassian:reactCount': 3,
  startTime: '2018-07-10T15:00:32Z',
  endTime: '2018-08-10T00:00:00Z',
};
