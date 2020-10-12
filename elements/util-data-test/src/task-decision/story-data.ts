import {
  MockTaskDecisionResource,
  MockTaskDecisionResourceConfig,
} from './MockTaskDecisionResource';
declare var require: {
  <T>(path: string): T;
};
// ServiceTaskResponse
export const getServiceTasksResponse = () =>
  require('../json-data/sample-tasks.json') as any;

export const getMockTaskDecisionResource = (
  config?: MockTaskDecisionResourceConfig,
) => new MockTaskDecisionResource(config);

export const document = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello world',
        },
        { type: 'hardBreak' },
        {
          type: 'text',
          text: 'This is a some content ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':wink:',
            id: '1f609',
            text: '😉',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mention',
          attrs: {
            id: '0',
            text: '@Carolyn',
            accessLevel: 'CONTAINER',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          text: 'was',
          marks: [{ type: 'strong' }],
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          text: 'here',
          marks: [{ type: 'em' }, { type: 'strong' }],
        },
        {
          type: 'text',
          text: '. ',
        },
      ],
    },
  ],
};

export const participants = [
  'ed5c802ddd0ef7ec9da68da9fa51c186',
  'ed5c802ddd0ef7ec9da68da9fa51c187',
  'ed5c802ddd0ef7ec9da68da9fa51c188',
  'ed5c802ddd0ef7ec9da68da9fa51c189',
  '4cc5629af38fb272d40446a51f58ab71',
  '4cc5629af38fb272d40446a51f58ab72',
  '4cc5629af38fb272d40446a51f58ab73',
];

export const getParticipants = (count: number) => participants.slice(0, count);
