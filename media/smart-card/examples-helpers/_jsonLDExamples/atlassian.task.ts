import {
  JIRA_TASK,
  JIRA_SUB_TASK,
  JIRA_STORY,
  JIRA_BUG,
  JIRA_EPIC,
  JIRA_INCIDENT,
  JIRA_SERVICE_REQUEST,
  JIRA_CHANGE,
  JIRA_PROBLEM,
  JIRA_CUSTOM_TASK_TYPE,
} from '../../src/extractors/constants';

export const AsanaTask = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://app.asana.com/0/759475196256783/759474743020981',
  '@type': ['Object', 'atlassian:Task'],
  'atlassian:assigned': '2018-07-27T11:15:06.815Z',
  'atlassian:assignedBy': {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  'atlassian:assignedTo': {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  'atlassian:completed': undefined,
  'atlassian:isCompleted': false,
  'atlassian:isDeleted': false,
  'atlassian:subscriber': {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  'atlassian:subscriberCount': 1,
  'atlassian:taskStatus': {
    '@type': 'Object',
    name: 'Today',
    url: 'https://app.asana.com/0/759475196256783/list',
  },
  'atlassian:taskType': {
    '@type': 'Object',
    id: 'https://app.asana.com/0/759475196256783/759474743020981',
    name: 'project-board-task-1',
    url: 'https://app.asana.com/0/759475196256783/759474743020981',
  },
  'atlassian:updatedBy': {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  attributedTo: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  content: 'Some raw text with new lines',
  context: {
    '@type': 'Collection',
    name: 'NEXT UP',
  },
  endTime: '2018-07-31T00:00:00.000Z',
  generator: {
    '@type': 'Application',
    icon: {
      '@type': 'Image',
      url: 'https://asana.com/favicon.ico',
    },
    name: 'Asana',
  },
  mediaType: 'text/plain',
  name: 'project-board-task-1',
  'schema:commentCount': 1,
  'schema:dateCreated': '2018-07-27T11:14:57.392Z',
  startTime: undefined,
  summary: 'Some raw text with new lines',
  tags: [
    {
      '@type': 'Object',
      id: 'https://app.asana.com/0/759494272065666/list',
      name: 'tagged',
      url: 'https://app.asana.com/0/759494272065666/list',
    },
  ],
  updated: '2018-07-31T11:48:17.741Z',
  url: 'https://app.asana.com/0/759475196256783/759474743020981',
};

export const GitHubIssue = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/User/repo-name/issues/8',
  '@type': ['Object', 'atlassian:Task'],
  'atlassian:assigned': undefined,
  'atlassian:assignedBy': {
    '@type': 'Person',
    image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
    name: 'User',
  },
  'atlassian:assignedTo': [
    {
      '@type': 'Person',
      image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
      name: 'User',
    },
    {
      '@type': 'Person',
      image: 'https://avatars0.githubusercontent.com/u/40266685?v=4',
      name: 'Partner',
    },
  ],
  'atlassian:isCompleted': false,
  'atlassian:isDeleted': false,
  'atlassian:priority': undefined,
  'atlassian:priorityName': undefined,
  'atlassian:subscriber': [
    {
      '@type': 'Person',
      image: 'https://avatars0.githubusercontent.com/u/385?v=4',
      name: 'subscriber1',
    },
    {
      '@type': 'Person',
      image: 'https://avatars3.githubusercontent.com/u/2050?v=4',
      name: 'subscriber2',
    },
  ],
  'atlassian:subscriberCount': 1,
  'atlassian:taskStatus': {
    '@type': 'Link',
    href: 'https://github.com/user/repo-name/issues?q=is%3Aissue%20is%3Aopen',
    name: 'open',
  },
  'atlassian:taskType': {
    '@type': 'Link',
    href: 'https://github.com/user/repo-name/issues',
    name: 'Issue',
  },
  'atlassian:updatedBy': undefined,
  attributedTo: {
    '@type': 'Person',
    image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
    name: 'User',
  },
  completed: undefined,
  content: 'Issue descriptions bla bla',
  context: {
    '@type': 'atlassian:Project',
    name: 'User/repo-name',
  },
  endTime: undefined,
  generator: {
    '@type': 'Application',
    icon: {
      '@type': 'Image',
      url: 'https://github.githubassets.com/favicon.ico',
    },
    name: 'git',
  },
  image: undefined,
  mediaType: 'text/markdown',
  name: 'w1',
  'schema:commentCount': 24,
  'schema:dateCreated': '2018-07-10T15:00:32Z',
  'schema:potentialAction': undefined,
  startTime: '2018-07-10T15:00:32Z',
  summary: undefined,
  tags: [
    {
      '@type': 'Object',
      id: 576144926,
      name: 'enhancement',
      url: 'https://github.com/user/repo-name/labels/enhancement',
    },
    {
      '@type': 'Object',
      id: 576144927,
      name: 'help wanted',
      url: 'https://github.com/user/repo-name/labels/help%20wanted',
    },
    {
      '@type': 'Object',
      id: 576144928,
      name: 'invalid',
      url: 'https://github.com/user/repo-name/labels/invalid',
    },
  ],
  updated: '2018-07-30T16:15:03Z',
  url: 'https://github.com/user/repo-name/issues/535123525?a=2',
};

const generateJiraTask = (
  taskName: string,
  taskType: string,
  taskTypeName: string,
  taskTag: { name?: string; appearance?: string } = {},
) => ({
  '@type': ['Object', 'atlassian:Task'],
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': `https://jira.atlassian.com/browse/?jql=issuetype%20=%20${taskTypeName}%20order%20by%20created%20DESC`,
  url: `https://jira.atlassian.com/browse/MAC-123`,
  icon: {
    url: 'https://cdn.iconscout.com/icon/free/png-256/guitar-61-160923.png',
  },
  'atlassian:assignedBy': {
    '@type': 'Person',
    image:
      'http://www.bohemiaticket.cz/photos/db/57/db57d4caf42e8d79b3e3b891d510bf3e-7324-750x450-fit.jpg',
    name: 'Frank Sinatra 🎺',
  },
  'atlassian:assignedTo': [
    {
      '@type': 'Person',
      image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
      name:
        'https://storybird.s3.amazonaws.com/artwork/PaulMcDougall/full/cheese.jpeg',
    },
    {
      '@type': 'Person',
      image:
        'https://stumptownblogger.typepad.com/.a/6a010536b86d36970c0168eb2c5e6b970c-800wi',
      name: 'Don Rickles ✨',
    },
  ],
  'atlassian:attributedTo': {
    '@type': 'Person',
    image:
      'http://www.bohemiaticket.cz/photos/db/57/db57d4caf42e8d79b3e3b891d510bf3e-7324-750x450-fit.jpg',
    name: 'Frank Sinatra 🎺',
  },
  'schema:commentCount': 24,
  content: 'Frank needs Don to perform for him',
  context: {
    '@type': 'atlassian:Project',
    name: 'Musicians and Comedians unite',
  },
  'schema:dateCreated': '2018-07-10T15:00:32Z',
  generator: {
    '@type': 'Application',
    '@id': 'https://www.atlassian.com/#Jira',
    icon:
      'https://product-fabric.atlassian.net/s/tmq6us/b/15/4b814c568b5302d1d1376067007f07c2/_/favicon-software.ico',
    name: 'Jira',
  },
  'atlassian:isCompleted': false,
  'atlassian:isDeleted': false,
  name: taskName,
  startTime: '2018-07-10T15:00:32Z',
  'atlassian:taskType': {
    '@type': ['Object', 'atlassian:TaskType'],
    '@id': `https://www.atlassian.com/#${taskType}`,
    name: `${taskTypeName}`,
  },
  tag: taskTag,
  'atlassian:taskStatus': {
    '@type': 'Link',
    href:
      'https://jira.atlassian.com/projects/MAC/issues/?filter=allopenissues',
    name: 'open',
  },
});

export const JiraTask = generateJiraTask(
  'Get Don to perform',
  JIRA_TASK,
  'Task',
);
export const JiraSubTask = generateJiraTask(
  'Buy new trumpet',
  JIRA_SUB_TASK,
  'Sub-task',
  { appearance: 'success' }, // shouldn't display lozenge
);
export const JiraStory = generateJiraTask(
  'Market next concert',
  JIRA_STORY,
  'Story',
  { name: 'todo' }, // should display as "default"
);
export const JiraBug = generateJiraTask(
  'Fix audio quality of mixer',
  JIRA_BUG,
  'Bug',
  { name: 'todo', appearance: 'default' },
);
export const JiraEpic = generateJiraTask(
  'Tribute to Earth Concert',
  JIRA_EPIC,
  'Epic',
  { name: 'in progress', appearance: 'inprogress' },
);
export const JiraIncident = generateJiraTask(
  'Remove unauthorised crowd members',
  JIRA_INCIDENT,
  'Incident',
  { name: 'blocked', appearance: 'removed' },
);
export const JiraServiceRequest = generateJiraTask(
  'Re-string instruments',
  JIRA_SERVICE_REQUEST,
  'Service Request',
  { name: 'done', appearance: 'success' },
);
export const JiraChange = generateJiraTask(
  'Change album cover',
  JIRA_CHANGE,
  'Change',
  { name: 'delayed', appearance: 'moved' },
);
export const JiraProblem = generateJiraTask(
  'Request Don to step teasing',
  JIRA_PROBLEM,
  'Problem',
  { name: 'done', appearance: 'success' },
);
export const JiraCustomTaskType = generateJiraTask(
  'Perform at the Conga Club',
  JIRA_CUSTOM_TASK_TYPE,
  'Musician Request',
  { name: 'done', appearance: 'success' },
);
export const JiraCustomTaskTypeWithIcon = (() => {
  const json: any = generateJiraTask(
    'Perform at the Conga Club',
    JIRA_CUSTOM_TASK_TYPE,
    'Musician Request',
    { name: 'done', appearance: 'success' },
  );

  json['atlassian:taskType'].icon = {
    '@type': 'Image',
    url: 'https://cdn.iconscout.com/icon/free/png-256/guitar-61-160923.png',
  };

  return json;
})();

export const JiraTasks = [
  JiraTask,
  JiraSubTask,
  JiraStory,
  JiraBug,
  JiraEpic,
  JiraIncident,
  JiraServiceRequest,
  JiraChange,
  JiraProblem,
  JiraCustomTaskType,
  JiraCustomTaskTypeWithIcon,
];
