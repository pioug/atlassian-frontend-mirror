export const BitbucketSourceCodeReference = {
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
    url:
      'https://bitbucket.org/tuser/test-repo/commits/0304dd88274bcc4ccc737fff22481dbac3945874',
  },
  'atlassian:updatedBy': {
    '@type': 'Person',
    image: 'https://bitbucket.org/account/tuser-2/avatar/',
    name: 'tuser-2',
  },
  attributedTo: {
    '@type': 'Person',
    image: 'https://bitbucket.org/account/tuser-2/avatar/',
    name: 'tuser-2',
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
    url:
      'https://bytebucket.org/ravatar/{0ea250c7-008d-4f87-9ec2-dc7c928bfdf6}?ts=default',
  },
  name: 'branch-name',
  'schema:dateCreated': undefined,
  summary: 'Commit message here',
  updated: '2018-10-08T12:51:56.000Z',
};

export const GithubSourceCodeReference = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/tuser/test-repo/tree/new-branch',
  '@type': 'atlassian:SourceCodeReference',
  url: 'https://github.com/tuser/test-repo/tree/new-branch',
  'atlassian:commit': {
    '@id': '216bbb3ec969788969b95defcc995af2ebafef91',
    '@type': 'atlassian:SourceCodeCommit',
    url:
      'https://github.com/tuser/test-repo/commit/216bbb3ec969788969b95defcc995af2ebafef91',
  },
  'atlassian:updatedBy': {
    '@type': 'Person',
    image: 'https://avatars3.githubusercontent.com/u/19864447?v=4',
    name: 'web-flow',
  },
  attributedTo: {
    '@type': 'Person',
    image: 'https://avatars0.githubusercontent.com/u/20928690?v=4',
    name: 'tuser',
  },
  context: {
    '@type': 'atlassian:SourceCodeRepository',
    name: 'repo-name',
    url: 'https://github.com/User/repo-name',
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
  name: 'tuser-patch-1',
  'schema:dateCreated': '2018-05-23T14:43:41Z',
  'schema:programmingLanguage': 'JavaScript',
  summary: 'qweqwe',
  updated: '2018-05-23T14:43:41Z',
};
