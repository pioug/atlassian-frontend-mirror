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

export const BitbucketFile1 = {
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

export const BitbucketFile2 = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'file',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@id':
      'https://bitbucket.org/owner-name/repo-name/src/q1w2e3r4/server/package.json',
    '@type': ['schema:DigitalDocument', 'Document'],
    url: 'https://bitbucket.org/owner-name/repo-name/src/q1w2e3r4/server/package.json',
    'atlassian:fileSize': 1483,
    'atlassian:isDeleted': false,
    context: {
      '@type': 'Collection',
      name: 'test-repo',
    },
    fileFormat: 'application/json',
    generator: {
      '@type': 'Application',
      icon: {
        '@type': 'Image',
        url: 'https://git-scm.com/favicon.ico',
      },
      name: 'git',
    },
    name: 'package.json',
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

export const BitbucketPullRequest1 = {
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

export const BitbucketPullRequest2 = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'pull',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@id': 'https://bitbucket.org/tuser/test-repo/pull-requests/7',
    '@type': ['Object', 'atlassian:SourceCodePullRequest'],
    url: 'https://bitbucket.org/tuser/test-repo/pull-requests/7',
    'atlassian:isMerged': true,
    'atlassian:mergeCommit': {
      '@type': 'Link',
      href: 'https://bitbucket.org/tuser/test-repo/commits/5478f639c012',
    },
    'atlassian:mergeDestination': {
      '@type': 'Link',
      href: 'https://bitbucket.org/tuser/test-repo/branch/master',
    },
    'atlassian:mergeSource': {
      '@type': 'Link',
      href: 'https://bitbucket.org/tuser/test-repo/branch/rerun',
    },
    'atlassian:mergeable': undefined,
    'atlassian:mergedBy': {
      '@type': 'Person',
      icon: 'https://bitbucket.org/account/tuser/avatar/',
      name: 'tuser',
    },
    'atlassian:reviewedBy': [
      {
        '@type': 'Person',
        icon: 'https://bitbucket.org/account/tuser/avatar/',
        name: 'tuser',
      },
    ],
    'atlassian:reviewer': [
      {
        '@type': 'Person',
        icon: 'https://bitbucket.org/account/testuser/avatar/',
        name: 'testuser',
      },
    ],
    'atlassian:state': 'MERGED',
    'atlassian:updatedBy': {
      '@type': 'Person',
      icon: 'https://bitbucket.org/account/tuser/avatar/',
      name: 'tuser',
    },
    attributedTo: {
      '@type': 'Person',
      icon: 'https://bitbucket.org/account/tuser/avatar/',
      name: 'tuser',
    },
    audience: [
      {
        '@type': 'Person',
        icon: 'https://bitbucket.org/account/tuser/avatar/',
        name: 'tuser',
      },
      {
        '@type': 'Person',
        icon: 'https://bitbucket.org/account/tuser/avatar/',
        name: 'tuser',
      },
    ],
    context: {
      '@type': 'atlassian:SourceCodeRepository',
      name: 'test-repo',
      url: 'https://bitbucket.org/tuser/test-repo',
    },
    generator: {
      '@type': 'Application',
      icon: {
        '@type': 'Image',
        url: 'https://git-scm.com/favicon.ico',
      },
      name: 'git',
    },
    icon: {
      '@type': 'Image',
      url: 'https://git-scm.com/favicon.ico',
    },
    name: 'filecreate.txt created online with Bitbucket',
    'schema:dateCreated': '2018-02-28T09:29:32.282Z',
    'schema:potentialAction': undefined,
    'schema:programmingLanguage': undefined,
    summary: 'Pull request description',
    updated: '2018-02-28T09:30:01.557Z',
  },
};

export const BitbucketRepository1 = {
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

export const BitbucketRepository2 = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'repo',
    key: 'native-bitbucket-object-provider',
  },
  data: {
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
      icon: 'https://bitbucket.org/account/atlassian/avatar/',
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
        url: 'https://d301sr5gafysq2.cloudfront.net/frontbucket/build-favicon-default.3b48bd21f29d.ico',
      },
      name: 'Bitbucket',
    },
    icon: {
      '@type': 'Image',
      url: 'https://d301sr5gafysq2.cloudfront.net/frontbucket/build-favicon-default.3b48bd21f29d.ico',
    },
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Arthur%2C_the_cat.jpg/1600px-Arthur%2C_the_cat.jpg',
    },
    name: 'angular-react',
    'schema:dateCreated': '2018-01-23T15:08:40.834Z',
    'schema:programmingLanguage': 'JavaScript',
    summary:
      'The solution to all your past, present and future front-end needs and woes. Why choose between two libraries when you can merge the two? 🧀',
    updated: '2018-10-12T12:07:37.855Z',
    'atlassian:subscribers': [],
    'atlassian:subscriberCount': '2000000',
  },
};

export const BitbucketSourceCodeReference = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'branch',
    key: 'native-bitbucket-object-provider',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@id': 'https://bitbucket.org/tuser/test-repo/branch/branch-name',
    '@type': 'atlassian:SourceCodeReference',
    url: 'https://bitbucket.org/tuser/test-repo/branch/branch-name',
    'atlassian:commit': {
      '@id': '0304dd88274bcc4ccc737fff22481dbac3945874',
      '@type': 'atlassian:SourceCodeCommit',
      url: 'https://bitbucket.org/tuser/test-repo/commits/0304dd88274bcc4ccc737fff22481dbac3945874',
    },
    'atlassian:updatedBy': {
      '@type': 'Person',
      icon: 'https://bitbucket.org/account/abhayani2018/avatar/',
      name: 'abhayani2018',
    },
    attributedTo: {
      '@type': 'Person',
      icon: 'https://bitbucket.org/account/abhayani2018/avatar/',
      name: 'abhayani2018',
    },
    context: {
      '@type': 'atlassian:SourceCodeRepository',
      name: 'test-repo',
      url: 'https://bitbucket.org/tuser/test-repo',
    },
    generator: {
      '@type': 'Application',
      icon: {
        '@type': 'Image',
        url: 'https://git-scm.com/favicon.ico',
      },
      name: 'git',
    },
    icon: {
      '@type': 'Image',
      url: 'https://git-scm.com/favicon.ico',
    },
    image: {
      '@type': 'Image',
      url: 'https://bytebucket.org/ravatar/{0ea250c7-008d-4f87-9ec2-dc7c928bfdf6}?ts=default',
    },
    name: 'branch-name',
    'schema:dateCreated': undefined,
    summary: 'Commit message here',
    updated: '2018-10-08T12:51:56.000Z',
  },
};
