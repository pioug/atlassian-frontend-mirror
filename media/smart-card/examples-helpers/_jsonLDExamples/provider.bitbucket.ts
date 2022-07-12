import {
  avatar1,
  avatar2,
  avatar3,
  iconBitbucket,
  image2,
} from '../../examples/images';

export const BitbucketBranch = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'branch',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'https://branch-url/branch/master',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'atlassian:SourceCodeReference',
    url: 'https://link-url/branch',
    name: 'master',
    icon: { '@type': 'Image', url: iconBitbucket },
    image: { '@type': 'Image', url: image2 },
    attributedTo: { '@type': 'Person', name: 'Build Agent', icon: avatar1 },
    updated: '2022-06-29T07:26:11.000Z',
    'atlassian:updatedBy': {
      '@type': 'Person',
      name: 'Build Agent',
      icon: avatar1,
    },
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'Image', url: iconBitbucket },
    },
    summary: 'release: 1.0.39',
    'atlassian:commit': {
      '@id': 'sha1:199fd07f616001f2161b9d256006db6fb43b0577',
      '@type': 'atlassian:SourceCodeCommit',
      url: 'https://last-commit-url/7f616001f2',
    },
    context: {
      '@type': 'atlassian:SourceCodeRepository',
      name: 'linking-platform',
      url: 'https://link-url/repository',
    },
  },
};

export const BitbucketCommit = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'commit',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'sha1:493727ee866e4cfc17d38207dca5f8f628442819',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'atlassian:SourceCodeCommit',
    url: 'https://link-url/commit',
    name: 'EDM-3487: Integer blandit gravida lacus',
    attributedTo: { '@type': 'Person', name: 'Angie Mccarthy', icon: avatar1 },
    'atlassian:committedBy': {
      '@type': 'Person',
      name: 'Angie Mccarthy',
      icon: avatar1,
    },
    context: {
      '@type': 'atlassian:SourceCodeRepository',
      name: 'linking-platform',
      url: 'https://link-url/repository',
    },
    'schema:dateCreated': '2022-06-15T05:55:17.000Z',
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'Image', url: iconBitbucket },
    },
    'atlassian:parent': [{ '@type': 'Link', href: 'https://link-url/parent' }],
    'schema:commentCount': 0,
  },
};

export const BitbucketFile = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'file',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'https://link-url/file/README.md',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': ['schema:DigitalDocument', 'Document'],
    url: 'https://link-url/file/README.md',
    'schema:fileFormat': null,
    'atlassian:fileSize': 16990,
    context: { '@type': 'Collection', name: 'bitbucket-object-provider' },
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'Image', url: iconBitbucket },
    },
    'atlassian:isDeleted': false,
    name: 'README.md',
  },
};

export const BitbucketProject = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'project',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'https://bitbucket.org/atlassian/workspace/projects/PROJ',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'atlassian:Project',
    url: 'https://bitbucket.org/atlassian/workspace/projects/PROJ',
    name: 'Project: Linking Platform',
    icon: { '@type': 'Image', url: iconBitbucket },
    image: { '@type': 'Image', url: image2 },
    attributedTo: {
      '@type': 'Person',
      name: 'Linking Platform',
      icon: avatar1,
    },
    'schema:dateCreated': '2015-10-14T02:33:44.425Z',
    updated: '2015-11-12T01:12:31.050Z',
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'Image', url: iconBitbucket },
    },
    'atlassian:isDeleted': false,
    'atlassian:member': {
      '@type': 'Collection',
      totalItems: 5,
      items: [
        { '@type': 'Person', name: 'Angie Mccarthy', icon: avatar1 },
        { '@type': 'Person', name: 'Steve Johnson', icon: avatar2 },
        { '@type': 'Person', name: 'Aliza Montgomery', icon: avatar3 },
      ],
    },
    summary: 'Project created by Bitbucket for Linking Platform',
    context: {
      '@type': 'Organization',
      name: 'atlassian',
      url: 'https://bitbucket.org/%7B02b941e3-cfaa-40f9-9a58-cec53e20bdc3%7D/',
    },
  },
};

export const BitbucketPullRequest = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'pull',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'https://pull-request-url/61',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': ['Object', 'atlassian:SourceCodePullRequest'],
    url: 'https://link-url/pull-request',
    attributedTo: { '@type': 'Person', name: 'Angie Mccarthy', icon: avatar1 },
    'schema:dateCreated': '2022-07-04T12:04:10.182Z',
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'icon', url: iconBitbucket },
    },
    icon: { '@type': 'icon', url: iconBitbucket },
    name: 'EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
    summary:
      'Phasellus faucibus interdum facilisis. Duis nulla erat, accumsan a nisi pellentesque.',
    'atlassian:mergeSource': {
      '@type': 'Link',
      href: 'https://source-branch-url',
      name: 'lp-smart-links',
    },
    'atlassian:mergeDestination': {
      '@type': 'Link',
      href: 'https://target-branch-url',
      name: 'master',
    },
    updated: '2022-07-04T12:05:28.601Z',
    'atlassian:internalId': '61',
    'atlassian:isMerged': false,
    'atlassian:state': 'OPEN',
    'atlassian:reviewer': [
      { '@type': 'Person', name: 'Steve Johnson', icon: avatar2 },
      { '@type': 'Person', name: 'Aliza Montgomery', icon: avatar3 },
    ],
    'atlassian:subscriberCount': 2,
    'atlassian:updatedBy': {
      '@type': 'Person',
      name: 'Angie Mccarthy',
      icon: avatar1,
    },
    audience: [
      { '@type': 'Person', name: 'Steve Johnson', icon: avatar2 },
      { '@type': 'Person', name: 'Aliza Montgomery', icon: avatar3 },
    ],
    context: {
      '@type': 'atlassian:SourceCodeRepository',
      name: 'linking-platform',
      url: 'https://link-url/repository',
    },
  },
};

export const BitbucketRepository = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'repo',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@id': 'https://repository-url',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'atlassian:SourceCodeRepository',
    url: 'https://link-url/repository',
    name: 'atlassian/linking-platform',
    icon: { '@type': 'Image', url: iconBitbucket },
    attributedTo: {
      '@type': 'Person',
      name: 'Linking Platform',
      icon: avatar1,
    },
    'schema:dateCreated': '2021-05-27T05:07:57.658Z',
    updated: '2022-07-04T11:57:38.000Z',
    generator: {
      '@type': 'Application',
      name: 'Bitbucket',
      icon: { '@type': 'Image', url: iconBitbucket },
    },
    'schema:programmingLanguage': '',
    'atlassian:subscriberCount': 2,
    context: {
      '@type': 'atlassian:Project',
      name: 'Project: Linking Platform',
    },
    'atlassian:latestCommit': {
      url: 'https://commit-url/d4f2fc9',
      '@id': 'https://commit-url/d4f2fc9',
      '@type': 'atlassian:SourceCodeCommit',
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      name: 'd4f2fc9',
      attributedTo: 'Steve Johnson',
      'schema:dateCreated': '2022-07-04T11:57:38.000Z',
      updated: '2022-07-04T11:57:38.000Z',
      icon: { '@type': 'Image', url: iconBitbucket },
      generator: {
        '@type': 'Application',
        name: 'Bitbucket',
        icon: { '@type': 'Image', url: iconBitbucket },
      },
      'atlassian:committedBy': 'Steve Johnson',
      summary: 'EDM-3605: Nullam eu sem vehicula, consequat eros id.',
    },
  },
};
