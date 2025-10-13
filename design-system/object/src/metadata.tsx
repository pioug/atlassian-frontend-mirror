/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c873348ffc71e78274a37c55639f426a>>
 * @codegenCommand yarn build-glyphs
 */
interface ComponentMetadata {
	componentName: string;
	package: string;
	packageLoader: () => Promise<{ default: React.ComponentType<any> }>;
}

interface ObjectMetadata {
	keywords: string[];
	color: string;
	icon: string;
	iconPackage: string;
	object: ComponentMetadata;
	tile: ComponentMetadata;
}

export const metadata: Record<string, ObjectMetadata> = {
	blog: {
		keywords: ['blog', 'blue'],
		color: 'blue',
		icon: 'quotation-mark',
		iconPackage: 'icon',
		object: {
			componentName: 'BlogObject',
			package: '@atlaskit/object/blog',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/blog'
				),
		},
		tile: {
			componentName: 'BlogObjectTile',
			package: '@atlaskit/object/tile/blog',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/blog'
				),
		},
	},
	branch: {
		keywords: ['branch', 'blue'],
		color: 'blue',
		icon: 'branch',
		iconPackage: 'icon',
		object: {
			componentName: 'BranchObject',
			package: '@atlaskit/object/branch',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/branch'
				),
		},
		tile: {
			componentName: 'BranchObjectTile',
			package: '@atlaskit/object/tile/branch',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/branch'
				),
		},
	},
	bug: {
		keywords: ['bug', 'red'],
		color: 'red',
		icon: 'bug',
		iconPackage: 'icon',
		object: {
			componentName: 'BugObject',
			package: '@atlaskit/object/bug',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/bug'
				),
		},
		tile: {
			componentName: 'BugObjectTile',
			package: '@atlaskit/object/tile/bug',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/bug'
				),
		},
	},
	calendar: {
		keywords: ['calendar', 'red'],
		color: 'red',
		icon: 'calendar',
		iconPackage: 'icon',
		object: {
			componentName: 'CalendarObject',
			package: '@atlaskit/object/calendar',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/calendar'
				),
		},
		tile: {
			componentName: 'CalendarObjectTile',
			package: '@atlaskit/object/tile/calendar',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/calendar'
				),
		},
	},
	changes: {
		keywords: ['changes', 'yellow'],
		color: 'yellow',
		icon: 'changes',
		iconPackage: 'icon',
		object: {
			componentName: 'ChangesObject',
			package: '@atlaskit/object/changes',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/changes'
				),
		},
		tile: {
			componentName: 'ChangesObjectTile',
			package: '@atlaskit/object/tile/changes',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/changes'
				),
		},
	},
	code: {
		keywords: ['code', 'purple'],
		color: 'purple',
		icon: 'angle-brackets',
		iconPackage: 'icon',
		object: {
			componentName: 'CodeObject',
			package: '@atlaskit/object/code',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/code'
				),
		},
		tile: {
			componentName: 'CodeObjectTile',
			package: '@atlaskit/object/tile/code',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/code'
				),
		},
	},
	commit: {
		keywords: ['commit', 'yellow'],
		color: 'yellow',
		icon: 'commit',
		iconPackage: 'icon',
		object: {
			componentName: 'CommitObject',
			package: '@atlaskit/object/commit',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/commit'
				),
		},
		tile: {
			componentName: 'CommitObjectTile',
			package: '@atlaskit/object/tile/commit',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/commit'
				),
		},
	},
	database: {
		keywords: ['database', 'purple'],
		color: 'purple',
		icon: 'database',
		iconPackage: 'icon',
		object: {
			componentName: 'DatabaseObject',
			package: '@atlaskit/object/database',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/database'
				),
		},
		tile: {
			componentName: 'DatabaseObjectTile',
			package: '@atlaskit/object/tile/database',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/database'
				),
		},
	},
	epic: {
		keywords: ['epic', 'purple'],
		color: 'purple',
		icon: 'epic',
		iconPackage: 'icon',
		object: {
			componentName: 'EpicObject',
			package: '@atlaskit/object/epic',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/epic'
				),
		},
		tile: {
			componentName: 'EpicObjectTile',
			package: '@atlaskit/object/tile/epic',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/epic'
				),
		},
	},
	idea: {
		keywords: ['idea', 'yellow'],
		color: 'yellow',
		icon: 'lightbulb',
		iconPackage: 'icon',
		object: {
			componentName: 'IdeaObject',
			package: '@atlaskit/object/idea',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/idea'
				),
		},
		tile: {
			componentName: 'IdeaObjectTile',
			package: '@atlaskit/object/tile/idea',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/idea'
				),
		},
	},
	improvement: {
		keywords: ['improvement', 'green'],
		color: 'green',
		icon: 'arrow-up',
		iconPackage: 'icon',
		object: {
			componentName: 'ImprovementObject',
			package: '@atlaskit/object/improvement',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/improvement'
				),
		},
		tile: {
			componentName: 'ImprovementObjectTile',
			package: '@atlaskit/object/tile/improvement',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/improvement'
				),
		},
	},
	incident: {
		keywords: ['incident', 'red'],
		color: 'red',
		icon: 'incident',
		iconPackage: 'icon',
		object: {
			componentName: 'IncidentObject',
			package: '@atlaskit/object/incident',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/incident'
				),
		},
		tile: {
			componentName: 'IncidentObjectTile',
			package: '@atlaskit/object/tile/incident',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/incident'
				),
		},
	},
	'new-feature': {
		keywords: ['new-feature', 'new feature', 'green'],
		color: 'green',
		icon: 'add',
		iconPackage: 'icon',
		object: {
			componentName: 'NewFeatureObject',
			package: '@atlaskit/object/new-feature',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/new-feature'
				),
		},
		tile: {
			componentName: 'NewFeatureObjectTile',
			package: '@atlaskit/object/tile/new-feature',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/new-feature'
				),
		},
	},
	page: {
		keywords: ['page', 'blue'],
		color: 'blue',
		icon: 'page',
		iconPackage: 'icon',
		object: {
			componentName: 'PageObject',
			package: '@atlaskit/object/page',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/page'
				),
		},
		tile: {
			componentName: 'PageObjectTile',
			package: '@atlaskit/object/tile/page',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/page'
				),
		},
	},
	'page-live-doc': {
		keywords: ['page-live-doc', 'page live doc', 'magenta'],
		color: 'magenta',
		icon: 'page-live-doc',
		iconPackage: 'icon-lab',
		object: {
			componentName: 'PageLiveDocObject',
			package: '@atlaskit/object/page-live-doc',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/page-live-doc'
				),
		},
		tile: {
			componentName: 'PageLiveDocObjectTile',
			package: '@atlaskit/object/tile/page-live-doc',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/page-live-doc'
				),
		},
	},
	problem: {
		keywords: ['problem', 'red'],
		color: 'red',
		icon: 'problem',
		iconPackage: 'icon',
		object: {
			componentName: 'ProblemObject',
			package: '@atlaskit/object/problem',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/problem'
				),
		},
		tile: {
			componentName: 'ProblemObjectTile',
			package: '@atlaskit/object/tile/problem',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/problem'
				),
		},
	},
	'pull-request': {
		keywords: ['pull-request', 'pull request', 'green'],
		color: 'green',
		icon: 'pull-request',
		iconPackage: 'icon',
		object: {
			componentName: 'PullRequestObject',
			package: '@atlaskit/object/pull-request',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/pull-request'
				),
		},
		tile: {
			componentName: 'PullRequestObjectTile',
			package: '@atlaskit/object/tile/pull-request',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/pull-request'
				),
		},
	},
	question: {
		keywords: ['question', 'purple'],
		color: 'purple',
		icon: 'question-circle',
		iconPackage: 'icon',
		object: {
			componentName: 'QuestionObject',
			package: '@atlaskit/object/question',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/question'
				),
		},
		tile: {
			componentName: 'QuestionObjectTile',
			package: '@atlaskit/object/tile/question',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/question'
				),
		},
	},
	story: {
		keywords: ['story', 'green'],
		color: 'green',
		icon: 'story',
		iconPackage: 'icon',
		object: {
			componentName: 'StoryObject',
			package: '@atlaskit/object/story',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/story'
				),
		},
		tile: {
			componentName: 'StoryObjectTile',
			package: '@atlaskit/object/tile/story',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/story'
				),
		},
	},
	subtask: {
		keywords: ['subtask', 'blue'],
		color: 'blue',
		icon: 'subtasks',
		iconPackage: 'icon',
		object: {
			componentName: 'SubtaskObject',
			package: '@atlaskit/object/subtask',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/subtask'
				),
		},
		tile: {
			componentName: 'SubtaskObjectTile',
			package: '@atlaskit/object/tile/subtask',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/subtask'
				),
		},
	},
	task: {
		keywords: ['task', 'blue'],
		color: 'blue',
		icon: 'task',
		iconPackage: 'icon',
		object: {
			componentName: 'TaskObject',
			package: '@atlaskit/object/task',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/task'
				),
		},
		tile: {
			componentName: 'TaskObjectTile',
			package: '@atlaskit/object/tile/task',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/task'
				),
		},
	},
	whiteboard: {
		keywords: ['whiteboard', 'teal'],
		color: 'teal',
		icon: 'whiteboard',
		iconPackage: 'icon',
		object: {
			componentName: 'WhiteboardObject',
			package: '@atlaskit/object/whiteboard',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/whiteboard'
				),
		},
		tile: {
			componentName: 'WhiteboardObjectTile',
			package: '@atlaskit/object/tile/whiteboard',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/whiteboard'
				),
		},
	},
	'work-item': {
		keywords: ['work-item', 'work item', 'blue'],
		color: 'blue',
		icon: 'work-item',
		iconPackage: 'icon',
		object: {
			componentName: 'WorkItemObject',
			package: '@atlaskit/object/work-item',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object" */
					'./components/object/components/work-item'
				),
		},
		tile: {
			componentName: 'WorkItemObjectTile',
			package: '@atlaskit/object/tile/work-item',
			packageLoader: () =>
				import(
					/* webpackChunkName: "@atlaskit-internal_object-tile" */
					'./components/object-tile/components/work-item'
				),
		},
	},
};
