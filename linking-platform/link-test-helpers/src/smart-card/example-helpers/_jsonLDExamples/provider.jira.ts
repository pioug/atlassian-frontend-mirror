import { SmartLinkActionType } from '@atlaskit/linking-types';

import { avatar3 } from '../../images';

export const CONFLUENCE_GENERATOR_ID = 'https://www.atlassian.com/#Confluence';

export const JIRA_GENERATOR_ID = 'https://www.atlassian.com/#Jira';
// To support icons for all Jira task types.
export const JIRA_TASK = 'JiraTask';
export const JIRA_SUB_TASK = 'JiraSubTask';
export const JIRA_STORY = 'JiraStory';
export const JIRA_BUG = 'JiraBug';
export const JIRA_EPIC = 'JiraEpic';
export const JIRA_INCIDENT = 'JiraIncident';
export const JIRA_SERVICE_REQUEST = 'JiraServiceRequest';
export const JIRA_CHANGE = 'JiraChange';
export const JIRA_PROBLEM = 'JiraProblem';
export const JIRA_CUSTOM_TASK_TYPE = 'JiraCustomTaskType';

//List of provider keys that support theme modes for the embedded content.
export const PROVIDER_KEYS_WITH_THEMING: string[] = [
	'jira-object-provider',
	'confluence-object-provider',
	'watermelon-object-provider',
];

const icon =
	'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT50YXNrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9InRhc2siIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiPgogICAgICAgICAgICA8ZyBpZD0iVGFzayIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTM2IiBmaWxsPSIjNEJBREU4IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHJ4PSIyIj48L3JlY3Q+CiAgICAgICAgICAgICAgICA8ZyBpZD0iUGFnZS0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC41MDAwMDApIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMiw1IEw2LDAiIGlkPSJTdHJva2UtMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDUgTDAsMyIgaWQ9IlN0cm9rZS0zIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';

const generateJiraTask = (
	taskName: string,
	taskType: string,
	taskTypeName: string,
	taskTag: { appearance?: string; name?: string } = {},
	hasProjectPermission: boolean = true,
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
			name: 'https://storybird.s3.amazonaws.com/artwork/PaulMcDougall/full/cheese.jpeg',
		},
		{
			'@type': 'Person',
			image: 'https://stumptownblogger.typepad.com/.a/6a010536b86d36970c0168eb2c5e6b970c-800wi',
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
		icon: 'https://product-fabric.atlassian.net/s/tmq6us/b/15/4b814c568b5302d1d1376067007f07c2/_/favicon-software.ico',
		name: 'Jira',
	},
	'atlassian:isCompleted': false,
	'atlassian:isDeleted': false,
	name: taskName,
	hasProjectPermission: hasProjectPermission,
	startTime: '2018-07-10T15:00:32Z',
	'atlassian:taskType': {
		'@type': ['Object', 'atlassian:TaskType'],
		'@id': `https://www.atlassian.com/#${taskType}`,
		name: `${taskTypeName}`,
	},
	tag: taskTag,
	'atlassian:taskStatus': {
		'@type': 'Link',
		href: 'https://jira.atlassian.com/projects/MAC/issues/?filter=allopenissues',
		name: 'open',
	},
});

export const JiraTask = generateJiraTask('Get Don to perform', JIRA_TASK, 'Task');
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
export const JiraBug = generateJiraTask('Fix audio quality of mixer', JIRA_BUG, 'Bug', {
	name: 'todo',
	appearance: 'default',
});
export const JiraEpic = generateJiraTask('Tribute to Earth Concert', JIRA_EPIC, 'Epic', {
	name: 'in progress',
	appearance: 'inprogress',
});
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
export const JiraChange = generateJiraTask('Change album cover', JIRA_CHANGE, 'Change', {
	name: 'delayed',
	appearance: 'moved',
});
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
export const JiraCustomTaskTypeWithIcon: any = (() => {
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
export const JiraTaskWithNoEditPermission = generateJiraTask(
	'Get Don to sing',
	JIRA_TASK,
	'Task',
	{ name: 'done', appearance: 'success' },
	false,
);

export const JiraTasks: any[] = [
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
	JiraTaskWithNoEditPermission,
];

export const JiraIssue = {
	meta: {
		auth: [],
		definitionId: 'jira-object-provider',
		product: 'jira',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'issue',
		key: 'jira-object-provider',
		supportedFeature: ['AISummary', 'RelatedLinks'],
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

export const JiraIssueAssigned = {
	...JiraIssue,
	data: {
		...JiraIssue.data,
		'atlassian:assignedTo': {
			'@type': 'Person',
			name: 'Eliza Pancake',
			icon: avatar3,
		},
		url: 'https://issue-url/TST-1',
	},
};

export const JiraProject = {
	meta: {
		auth: [],
		definitionId: 'jira-object-provider',
		product: 'jira',
		visibility: 'restricted',
		access: 'granted',
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
			icon: {
				'@type': 'Image',
				url: 'https://cdn.bfldr.com/K3MHR9G8/at/nw9qpmqv3g2j75qvk8sjcw/jira-mark-gradient-blue.svg?auto=webp&format=png',
			},
		},
		'@type': ['Object', 'atlassian:Project'],
		url: 'https://jira-project-url',
		name: 'Linking Platform',
		summary: '',
		icon: {
			'@type': 'Image',
			url: icon,
		},
	},
};
