import { avatar3 } from '../../examples/images';
import { SmartLinkActionType } from '@atlaskit/linking-types';

const icon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT50YXNrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9InRhc2siIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiPgogICAgICAgICAgICA8ZyBpZD0iVGFzayIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTM2IiBmaWxsPSIjNEJBREU4IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHJ4PSIyIj48L3JlY3Q+CiAgICAgICAgICAgICAgICA8ZyBpZD0iUGFnZS0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC41MDAwMDApIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMiw1IEw2LDAiIGlkPSJTdHJva2UtMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDUgTDAsMyIgaWQ9IlN0cm9rZS0zIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';

export const JiraIssue = {
  meta: {
    auth: [],
    definitionId: 'jira-object-provider',
    product: 'jira',
    visibility: 'restricted',
    access: 'granted',
    resourceType: 'issue',
    key: 'jira-object-provider',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    generator: {
      '@type': 'Application',
      '@id': 'https://www.atlassian.com/#Jira',
      name: 'Jira',
    },
    '@type': ['atlassian:Task', 'Object'],
    name: 'LP-5128: Lorem ipsum dolor sit amet',
    'schema:dateCreated': '2022-11-22T12:15:28.032+1100',
    updated: '2022-11-22T15:30:49.140+1100',
    'schema:commentCount': 0,
    'atlassian:priority': {
      '@type': 'Object',
      name: 'Minor',
      icon: {
        '@type': 'Image',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTguMDQ1MzE5IDEyLjgwNjE1Mmw0LjUtMi43Yy41LS4zIDEuMS0uMSAxLjMuNHMuMiAxLjEtLjMgMS4zbC01IDNjLS4zLjItLjcuMi0xIDBsLTUtM2MtLjUtLjMtLjYtLjktLjMtMS40LjMtLjUuOS0uNiAxLjQtLjNsNC40IDIuN3oiIGZpbGw9IiMwMDY1ZmYiLz4KICA8cGF0aCBkPSJNMTIuNTQ1MzE5IDUuODA2MTUyYy41LS4zIDEuMS0uMSAxLjMuM3MuMiAxLjEtLjMgMS40bC01IDNjLS4zLjItLjcuMi0xIDBsLTUtM2MtLjUtLjMtLjYtLjktLjMtMS40LjMtLjUuOS0uNiAxLjQtLjNsNC40IDIuNyA0LjUtMi43eiIgZmlsbD0iIzI2ODRmZiIvPgogIDxwYXRoIGQ9Ik0xMi41NDUzMTkgMS41MDYxNTJjLjUtLjMgMS4xLS4yIDEuMy4zcy4yIDEuMS0uMyAxLjRsLTUgM2MtLjMuMi0uNy4yLTEgMGwtNS0zYy0uNS0uMy0uNi0uOS0uMy0xLjQuMy0uNS45LS42IDEuNC0uM2w0LjQgMi43IDQuNS0yLjd6IiBmaWxsPSIjNGM5YWZmIi8+Cjwvc3ZnPg==',
      },
    },
    'atlassian:subscriberCount': 1,
    tag: {
      '@type': 'Object',
      name: 'In Progress',
      appearance: 'inprogress',
    },
    taskType: {
      '@type': ['Object', 'atlassian:TaskType'],
      '@id': 'https://www.atlassian.com/#JiraCustomTaskType',
      name: 'Task',
      icon: {
        '@type': 'Image',
        url: icon,
      },
    },
    icon: {
      '@type': 'Image',
      url: icon,
    },
    summary:
      'Donec vitae efficitur risus, vel congue neque. Sed eu odio diam. Pellentesque nec vehicula leo, id pulvinar ligula. Nam vel semper nisl, vel sodales lorem.',
    attributedTo: {
      '@type': 'Person',
      name: 'Eliza Pancake',
      icon: avatar3,
    },
    preview: {
      '@type': 'Link',
      href: 'https://preview-url',
      'atlassian:supportedPlatforms': ['web'],
    },
    url: 'https://issue-url',
    'atlassian:serverAction': [
      {
        '@type': 'UpdateAction',
        name: 'UpdateAction',
        dataRetrievalAction: {
          '@type': 'ReadAction',
          name: SmartLinkActionType.GetStatusTransitionsAction,
        },
        dataUpdateAction: {
          '@type': 'UpdateAction',
          name: SmartLinkActionType.StatusUpdateAction,
        },
        refField: 'tag',
        resourceIdentifiers: {
          issueKey: 'some-id',
          hostname: 'some-hostname',
        },
      },
    ],
  },
};
