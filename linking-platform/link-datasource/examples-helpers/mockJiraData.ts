// not sure what BE schema looks like so just using my mock schema for now
export const mockJiraData = {
  nextPageCursor: 'c3RhcnRBdD01',
  totalIssues: 1357,
  data: [
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1172',
      summary: 'FIRST! This level contains five Dragon coins',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'major',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/major.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
      labels: ['label', 'another', 'third'],
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1173',
      summary: "Audio in meeting room K909 doesn't work",
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'In progress',
        status: 'inprogress',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'bug',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
      },
      issueNumber: 'DONUT-1174',
      summary: 'In the underground area, under three Rotating spheres',
      assignee: undefined,
      priority: {
        label: 'medium',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/medium.svg',
      },
      status: {
        text: 'Done',
        status: 'success',
      },
      resolution: 'Done',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1175',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'low',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/low.svg',
      },
      status: {
        text: 'Closed',
        status: 'removed',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1176',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies accumsan justo, eget pretium quam aliquet semper.',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'trivial',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/trivial.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'epic',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium',
      },
      issueNumber: 'DONUT-1177',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'blocker',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/blocker.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1178',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'epic',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium',
      },
      issueNumber: 'DONUT-1179',
      summary: 'This level is hard',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1180',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1181',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'default',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1182',
      summary: 'This level is hard',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'Closed',
        status: 'removed',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1183',
      summary: 'This level contains five Dragon coins',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'major',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/major.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1184',
      summary: "Audio in meeting room K909 doesn't work",
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'In progress',
        status: 'inprogress',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1185',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'low',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/low.svg',
      },
      status: {
        text: 'Closed',
        status: 'removed',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1186',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies accumsan justo, eget pretium quam aliquet semper.',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'trivial',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/trivial.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1187',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'blocker',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/blocker.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1188',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1189',
      summary: 'This level is hard',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'story',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium',
      },
      issueNumber: 'DONUT-1190',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'epic',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium',
      },
      issueNumber: 'DONUT-1191',
      summary: 'This level is hard',
      assignee: undefined,
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'To do',
        status: 'new',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
    {
      type: {
        label: 'task',
        source:
          'https://product-fabric.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      },
      issueNumber: 'DONUT-1192',
      summary: 'This level is hard',
      assignee: {
        displayName: 'Scott Farquhar',
        source:
          'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
      },
      priority: {
        label: 'high',
        source:
          'https://product-fabric.atlassian.net/images/icons/priorities/high.svg',
      },
      status: {
        text: 'Closed',
        status: 'removed',
      },
      resolution: 'Unresolved',
      created: '23/Jul/20',
      updated: '23/Jul/20',
      due: '24/Jul/20',
      link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
    },
  ],
};
