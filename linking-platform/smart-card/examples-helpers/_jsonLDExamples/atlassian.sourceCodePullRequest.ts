export const BitbucketPullRequest = {
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
    image: 'https://bitbucket.org/account/tuser/avatar/',
    name: 'tuser',
  },
  'atlassian:reviewedBy': [
    {
      '@type': 'Person',
      image: 'https://bitbucket.org/account/tuser/avatar/',
      name: 'tuser',
    },
  ],
  'atlassian:reviewer': [
    {
      '@type': 'Person',
      image: 'https://bitbucket.org/account/testuser/avatar/',
      name: 'testuser',
    },
  ],
  'atlassian:state': 'MERGED',
  'atlassian:updatedBy': {
    '@type': 'Person',
    image: 'https://bitbucket.org/account/tuser/avatar/',
    name: 'tuser',
  },
  attributedTo: {
    '@type': 'Person',
    image: 'https://bitbucket.org/account/tuser/avatar/',
    name: 'tuser',
  },
  audience: [
    {
      '@type': 'Person',
      image: 'https://bitbucket.org/account/tuser/avatar/',
      name: 'tuser',
    },
    {
      '@type': 'Person',
      image: 'https://bitbucket.org/account/tuser/avatar/',
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
};

export const GithubPullRequest = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/testuser/test-repo/pull/3',
  '@type': ['Object', 'atlassian:SourceCodePullRequest'],
  url: 'https://github.com/testuser/test-repo/pull/3',
  'atlassian:isMerged': false,
  'atlassian:mergeCommit': {
    '@type': 'Link',
    href:
      'https://github.com/testuser/test-repo/commit/bbadd311a1eb5154ab7f43445adfa67e0810bfec',
  },
  'atlassian:mergeDestination': {
    '@type': 'Link',
    href: 'https://github.com/testuser/test-repo/tree/master',
  },
  'atlassian:mergeSource': {
    '@type': 'Link',
    href: 'https://github.com/testuser/test-repo/tree/testuser-patch-1',
  },
  'atlassian:mergeable': true,
  'atlassian:mergedBy': undefined,
  'atlassian:reviewedBy': [
    {
      '@type': 'Person',
      image: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
      name: 'testuser',
    },
  ],
  'atlassian:reviewer': [
    {
      '@type': 'Person',
      image: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
      name: 'testuser',
    },
  ],
  'atlassian:state': 'open',
  'atlassian:updatedBy': {
    '@type': 'Person',
    image: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
    name: 'testuser',
  },
  attributedTo: {
    '@type': 'Person',
    image: 'https://avatars0.githubusercontent.com/u/20928699?v=4',
    name: 'testuser',
  },
  audience: [
    {
      '@type': 'Person',
      image: 'https://avatars0.githubusercontent.com/u/20928690?v=4',
      name: 'tuser',
    },
    {
      '@type': 'Person',
      image: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
      name: 'testuser',
    },
  ],
  context: {
    '@type': 'atlassian:SourceCodeRepository',
    name: 'test-repo',
    url: 'https://github.com/testuser/test-repo',
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
  name: 'qweqwe',
  'schema:dateCreated': '2018-05-23T14:43:57Z',
  'schema:potentialAction': undefined,
  'schema:programmingLanguage': 'JavaScript',
  summary: '@someuser',
  tags: [
    {
      '@type': '',
      id: 921541895,
      name: 'bug',
      url: 'https://github.com/testuser/test-repo/labels/bug',
    },
    {
      '@type': '',
      id: 921541896,
      name: 'duplicate',
      url: 'https://github.com/testuser/test-repo/labels/duplicate',
    },
    {
      '@type': '',
      id: 921541897,
      name: 'enhancement',
      url: 'https://github.com/testuser/test-repo/labels/enhancement',
    },
  ],
  updated: '2018-08-08T12:17:47Z',
};
