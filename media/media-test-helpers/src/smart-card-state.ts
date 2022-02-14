export const url =
  'https://bitbucket.org/atlassian/incredible-monorepo/pull-requests/42';
export const cardState: any = {
  status: 'resolved',
  lastUpdatedAt: 1624877833614,
  details: {
    meta: {
      access: 'granted',
      visibility: 'restricted',
      auth: [
        {
          key: 'bitbucket',
          displayName: 'Atlassian Links - Bitbucket',
          url:
            'https://id.stg.internal.atlassian.com/outboundAuth/start?containerId=4d6a1ee9-20b3-492f-a0b6-3bab6c763a8e_3f823978-fbc9-4baa-95e2-1b4c89a73027&serviceKey=bitbucket',
        },
      ],
      definitionId: 'a2d59c5a-952f-4996-8cf6-1d0ad318731a',
      key: 'bitbucket-object-provider',
      resourceType: 'pull',
      version: '2.0.2',
    },
    data: {
      '@id': url,
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': ['Object', 'atlassian:SourceCodePullRequest'],
      url,
      attributedTo: {
        '@type': 'Person',
        name: 'Matt Turner',
        image:
          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
      },
      'schema:dateCreated': '2019-12-12T03:20:14.858Z',
      generator: {
        '@type': 'Application',
        name: 'Bitbucket',
        icon: {
          '@type': 'Image',
          url:
            'https://wac-cdn.atlassian.com/assets/img/favicons/bitbucket/favicon-32x32.png',
        },
      },
      icon: {
        '@type': 'Image',
        url:
          'https://wac-cdn.atlassian.com/assets/img/favicons/bitbucket/favicon-32x32.png',
      },
      name: 'Normalise package config',
      summary: '',
      'atlassian:mergeSource': {
        '@type': 'Link',
        href:
          'https://bitbucket.org/atlassian/incredible-monorepo/branch/normalise-package-config',
      },
      'atlassian:mergeDestination': {
        '@type': 'Link',
        href:
          'https://bitbucket.org/atlassian/incredible-monorepo/branch/master',
      },
      updated: '2019-12-12T03:40:43.420Z',
      'atlassian:mergeCommit': {
        '@type': 'Link',
        href:
          'https://bitbucket.org/atlassian/incredible-monorepo/commits/56139bbc3793',
      },
      'atlassian:internalId': '42',
      'atlassian:isMerged': true,
      'atlassian:state': 'MERGED',
      'atlassian:mergedBy': {
        '@type': 'Person',
        name: 'Matt Turner',
        image:
          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
      },
      'atlassian:reviewer': [
        {
          '@type': 'Person',
          name: 'ᴄᴏsᴍᴏ',
          image:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
        },
      ],
      'atlassian:reviewedBy': [
        {
          '@type': 'Person',
          name: 'ᴄᴏsᴍᴏ',
          image:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
        },
      ],
      'atlassian:updatedBy': {
        '@type': 'Person',
        name: 'Matt Turner',
        image:
          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
      },
      audience: [
        {
          '@type': 'Person',
          name: 'Matt Turner',
          image:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
        },
        {
          '@type': 'Person',
          name: 'ᴄᴏsᴍᴏ',
          image:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
        },
      ],
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'incredible-monorepo',
        url: 'https://bitbucket.org/atlassian/incredible-monorepo',
      },
    },
  },
};
