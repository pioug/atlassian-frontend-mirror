export const object = {
  '@type': 'Object',
  url: 'https://www.example.com/',
  name: 'Some object',
  summary: 'The object description',
  generator: {
    type: 'Application',
    name: 'My app',
    icon: 'https://www.example.com/icon.jpg',
  },
};

export const atlassianTask = {
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

export const document = {
  ...object,
  '@type': 'Document',
  commentCount: 214,
};

export const spreadsheet = {
  ...document,
  '@type': 'Spreadsheet',
};
