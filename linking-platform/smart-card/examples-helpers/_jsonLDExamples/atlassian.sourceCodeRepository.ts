export const BitbucketRepository = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://bitbucket.org/tuser/angular-react',
  '@type': ['atlassian:SourceCodeRepository'],
  url: 'https://bitbucket.org/tuser/angular-react',
  attributedTo: {
    '@type': 'Person',
    image: 'https://bitbucket.org/account/atlassian/avatar/',
    name: 'atlassian',
  },
  context: {
    '@type': 'atlassian:Project',
    name: 'Frontend Warriors',
  },
  generator: {
    '@type': 'Application',
    icon: {
      '@type': 'Image',
      url:
        'https://d301sr5gafysq2.cloudfront.net/frontbucket/build-favicon-default.3b48bd21f29d.ico',
    },
    name: 'Bitbucket',
  },
  icon: {
    '@type': 'Image',
    url:
      'https://d301sr5gafysq2.cloudfront.net/frontbucket/build-favicon-default.3b48bd21f29d.ico',
  },
  image: {
    url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Arthur%2C_the_cat.jpg/1600px-Arthur%2C_the_cat.jpg',
  },
  name: 'angular-react',
  'schema:dateCreated': '2018-01-23T15:08:40.834Z',
  'schema:programmingLanguage': 'JavaScript',
  summary:
    'The solution to all your past, present and future front-end needs and woes. Why choose between two libraries when you can merge the two? 🧀',
  updated: '2018-10-12T12:07:37.855Z',
  'atlassian:subscribers': [],
  'atlassian:subscriberCount': '2000000',
};

export const GithubRepository = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/User/blender.js',
  '@type': 'atlassian:SourceCodeRepository',
  url: 'https://github.com/User/cheeser.js',
  'atlassian:updatedBy': {
    '@type': 'Person',
    image: 'https://avatars.githubusercontent.com/u/20928690?',
    name: 'tuser',
  },
  attributedTo: {
    '@type': 'Person',
    image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
    name: 'User',
  },
  context: {
    '@type': 'Organization',
    name: 'NASA',
  },
  generator: {
    '@type': 'Application',
    icon: {
      '@type': 'Image',
      url: 'https://github.githubassets.com/favicon.ico',
    },
    name: 'Github',
  },
  icon: {
    '@type': 'Image',
    url: 'https://github.githubassets.com/favicon.ico',
  },
  name: 'cheeser.js',
  'schema:dateCreated': '2017-04-04T10:17:08Z',
  'schema:programmingLanguage': 'JavaScript',
  summary:
    'A JavaScript engine helping you develop real-time, blockchain-inspired, ML-invoked cheese models.',
  updated: '2018-07-30T16:21:19Z',
  'atlassian:subscribers': [],
  'atlassian:subscriberCount': '20488402',
};
