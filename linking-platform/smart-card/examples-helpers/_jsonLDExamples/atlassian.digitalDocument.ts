export const BitbucketFile = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id':
    'https://bitbucket.org/owner-name/repo-name/src/q1w2e3r4/server/package.json',
  '@type': ['schema:DigitalDocument', 'Document'],
  url:
    'https://bitbucket.org/owner-name/repo-name/src/q1w2e3r4/server/package.json',
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
};

export const GithubFile = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/tuser/test-repo/blob/tuser-patch-1/test.txt',
  '@type': ['schema:DigitalDocument', 'Document'],
  url: 'https://github.com/tuser/test-repo/blob/tuser-patch-1/test.txt',
  'atlassian:fileSize': 10,
  'atlassian:isDeleted': false,
  context: {
    '@type': 'Collection',
    name: 'test-repo',
  },
  fileFormat: 'text/plain',
  generator: {
    '@type': 'Application',
    icon: {
      '@type': 'Image',
      url: 'https://git-scm.com/favicon.ico',
    },
    name: 'git',
  },
  name: 'test.txt',
};
