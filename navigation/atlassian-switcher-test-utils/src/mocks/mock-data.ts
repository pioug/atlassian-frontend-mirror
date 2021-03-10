export interface MockData {
  AVAILABLE_PRODUCTS_DATA: object | number;
  AVAILABLE_PRODUCTS_DATA_ERROR?: object;
  CUSTOM_LINKS_DATA: object;
  CUSTOM_LINKS_DATA_ERROR?: object;
  USER_PERMISSION_DATA: {
    manage: any;
    'add-products': any;
  };
  XFLOW_SETTINGS: object;
  JOINABLE_SITES_DATA: object | number;
  COLLABORATION_GRAPH_CONTAINERS: object;
}
// Mock data can be overriden in the story so be careful when testing.
const ORIGINAL_MOCK_DATA: MockData = {
  AVAILABLE_PRODUCTS_DATA: {
    isPartial: false,
    sites: [
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
          {
            productType: 'JIRA_SOFTWARE',
            url: null,
          },
        ],
        cloudId: '0706eddc-00d7-4e1c-9268-ee3c1d2408cc',
        displayName: 'sre-ehlo',
        url: 'https://sre-ehlo.jira-dev.com',
        avatar:
          'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rings.png',
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
          {
            productType: 'JIRA_BUSINESS',
            url: null,
          },
        ],
        cloudId: '536e586b-06fe-4550-b084-4e5b12ede8c5',
        displayName: 'atl-vertigo-product-fabric-testing',
        url: 'https://atl-vertigo-product-fabric-testing.jira-dev.com',
        avatar:
          'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/site.png',
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
          {
            productType: 'JIRA_BUSINESS',
            url: null,
          },
          {
            productType: 'JIRA_SERVICE_DESK',
            url: null,
          },
          {
            productType: 'JIRA_SOFTWARE',
            url: null,
          },
        ],
        cloudId: 'DUMMY-43cb9cad-e4b1-407a-a727-1c40e9314f04',
        displayName: 'growth',
        url: 'https://growth.jira-dev.com',
        avatar:
          'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rocket.png',
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
          {
            productType: 'JIRA_SERVICE_DESK',
            url: null,
          },
          {
            productType: 'JIRA_SOFTWARE',
            url: null,
          },
        ],
        cloudId: 'DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea',
        displayName: 'sdog',
        url: 'https://sdog.jira-dev.com',
        avatar:
          'https://site-admin-avatar-cdn.stg.public.atl-paas.net/avatars/240/rocket.png',
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
        ],
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        displayName: 'Atlassian Pug',
        url: 'https://pug.jira-dev.com',
        avatar: null,
      },
      {
        adminAccess: true,
        availableProducts: [
          {
            productType: 'CONFLUENCE',
            url: null,
          },
          {
            productType: 'JIRA_SOFTWARE',
            url: null,
          },
          {
            productType: 'OPSGENIE',
            url: 'https://start.atlassian-app.opsgeni.us',
          },
        ],
        cloudId: 'some-cloud-id',
        displayName: 'some-random-instance-some-random-instance',
        url: 'https://some-random-instance.atlassian.net',
        avatar: null,
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'JIRA_BUSINESS',
            url: null,
          },
          {
            productType: 'JIRA_SERVICE_DESK',
            url: null,
          },
          {
            productType: 'JIRA_SOFTWARE',
            url: null,
          },
        ],
        cloudId: '497ea592-beb4-43c3-9137-a6e5fa301088',
        displayName: 'jdog',
        url: 'https://jdog.jira-dev.com',
        avatar:
          'https://wac-cdn.atlassian.com/dam/jcr:d9db9a6f-b514-44d0-9d29-f97d0879e5ee/icon-charlie-white.svg',
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'BITBUCKET',
            url: 'https://bitbucket.org',
          },
        ],
        cloudId: 'bitbucket',
        displayName: 'Bitbucket',
        url: 'https://bitbucket.org',
        avatar: null,
      },
      {
        adminAccess: false,
        availableProducts: [
          {
            productType: 'STATUSPAGE',
            url: 'https://atlassianinternal.statuspage.io',
          },
        ],
        cloudId: '497ea592-beb4-43c3-9137-a6e5fa301000',
        displayName: 'Statuspage instance',
        url: 'https://statuspage.io',
        avatar: null,
      },
    ],
  },
  CUSTOM_LINKS_DATA: [
    {
      key: 'home',
      link: 'https://some-random-instance.atlassian.net/secure/MyJiraHome.jspa',
      label: 'Jira',
      local: true,
      self: false,
      applicationType: 'jira',
    },
    {
      key: 'home',
      link: 'https://some-random-instance.atlassian.net/wiki/',
      label: 'Confluence',
      local: true,
      self: false,
      applicationType: 'jira',
    },
    {
      key: 'home',
      link: 'https://bitbucket.org/my-team',
      label: 'Bitbucket - My Team',
      local: false,
      self: false,
      applicationType: 'jira',
    },
  ],
  USER_PERMISSION_DATA: {
    manage: {
      permitted: true,
    },
    'add-products': {
      permitted: true,
    },
  },
  XFLOW_SETTINGS: {},
  JOINABLE_SITES_DATA: {
    sites: [
      {
        cloudId: 'cloud-1',
        url: 'https://teamsinspace.com',
        products: {
          'jira-software.ondemand': [],
        },
        displayName: 'Example',
        avatarUrl: 'http://avatarSite/avatar',
        relevance: 0,
      },
      {
        cloudId: 'cloud-2',
        url: 'https://teamsinspace2.com',
        products: {},
        displayName: 'Example 2',
        avatarUrl: 'http://avatarSite/avatar',
        relevance: 0,
      },
    ],
  },
  COLLABORATION_GRAPH_CONTAINERS: {
    collaborationGraphEntities: [
      {
        entityType: 'CONTAINER',
        containerType: 'confluenceSpace',
        id: '403016412',
        containerDetails: {
          id: '403016412',
          key: 'SMRT',
          name: 'Search & Smarts',
          url: 'https://hello.atlassian.net/wiki/spaces/SMRT',
          iconUrl:
            'https://hello.atlassian.net/wiki/download/attachments/403059104/SMRT?version=1&modificationDate=1507830030007&cacheVersion=1&api=v2',
        },
        score: 268500.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'jiraProject',
        id: '20740',
        containerDetails: {
          id: '20740',
          key: 'PC',
          name: 'Project Central',
          url: 'https://hello.atlassian.net/browse/PC',
          iconUrl:
            'https://hello.atlassian.net/secure/projectavatar?pid=20740&avatarId=15426',
        },
        score: 109250.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'confluenceSpace',
        id: '169932209',
        containerDetails: {
          id: '169932209',
          key: '~gawadhwal',
          name: 'Gaurav Awadhwal',
          url: 'https://hello.atlassian.net/wiki/spaces/~gawadhwal',
          iconUrl:
            'https://hello.atlassian.net/wiki/aa-avatar/557058:643f6e31-6098-4b0b-982e-0f119f9b1a98',
        },
        score: 90750.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'jiraProject',
        id: '19643',
        containerDetails: {
          id: '19643',
          key: 'OKR',
          name: 'Objectives and Key Results (OKR)',
          url: 'https://hello.atlassian.net/browse/OKR',
          iconUrl:
            'https://hello.atlassian.net/secure/projectavatar?pid=19643&avatarId=26628',
        },
        score: 40500.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'confluenceSpace',
        id: '188186690',
        containerDetails: {
          id: '188186690',
          key: '~shamid',
          name: 'Shihab Hamid',
          url: 'https://hello.atlassian.net/wiki/spaces/~shamid',
          iconUrl:
            'https://hello.atlassian.net/wiki/aa-avatar/557057:cfbb7556-aaed-4cb4-8600-6e7786103e34',
        },
        score: 20250.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'jiraProject',
        id: '23340',
        containerDetails: {
          id: '23340',
          key: 'DE',
          name: 'Data Engineering',
          url: 'https://hello.atlassian.net/browse/DE',
          iconUrl:
            'https://hello.atlassian.net/secure/projectavatar?avatarId=24523',
        },
        score: 20000.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'confluenceSpace',
        id: '598578434',
        containerDetails: {
          id: '598578434',
          key: '~706746381',
          name: 'David Nguyen',
          url: 'https://hello.atlassian.net/wiki/spaces/~706746381',
          iconUrl:
            'https://hello.atlassian.net/wiki/aa-avatar/5dd4fa70a20e0c0e9ef6e5c5',
        },
        score: 10000.0,
      },
      {
        entityType: 'CONTAINER',
        containerType: 'jiraProject',
        id: '10080',
        containerDetails: {
          id: '10080',
          key: 'ADM',
          name: 'Workplace Technology',
          url: 'https://hello.atlassian.net/browse/ADM',
          iconUrl:
            'https://hello.atlassian.net/secure/projectavatar?pid=10080&avatarId=31822',
        },
        score: 10000.0,
      },
    ],
  },
};

export default ORIGINAL_MOCK_DATA;
