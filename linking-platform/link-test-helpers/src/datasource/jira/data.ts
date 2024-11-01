import {
	blocker,
	bug,
	epic,
	high,
	low,
	major,
	medium,
	profile,
	questionMark,
	story,
	task,
	trivial,
} from '../../images';
import { type Site } from '../index';

const generateMockPeopleResponse = (size: number) => {
	return new Array(size).fill(null).map(() => ({
		displayName: 'Scott Farquhar',
		avatarSource: profile,
	}));
};

let mocks = 1;
// It is not in a particular format. IT is transformed into expected format when consumed.
export const mockJiraData = {
	nextPageCursor: 'c3RhcnRBdD01',
	totalIssues: 1357,
	data: [
		{
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1172',
			summary: 'FIRST! This level contains five Dragon coins',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(4),
			priority: {
				label: 'major',
				source: questionMark,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: questionMark,
			},
			issueNumber: 'DONUT-1173',
			summary: "Audio in meeting room K909 doesn't work",
			assignee: undefined,
			people: generateMockPeopleResponse(3),
			priority: {
				label: 'high',
				source: high,
			},
			status: {
				text: 'In Progress',
				status: 'inprogress',
			},
			resolution: 'Unresolved',
			created: '23/Jul/20',
			updated: '23/Jul/20',
			due: '24/Jul/20',
			link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
		},
		{
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'bug',
				source: bug,
			},
			issueNumber: 'DONUT-1174',
			summary: 'In the underground area, under three Rotating spheres',
			assignee: undefined,
			people: generateMockPeopleResponse(2),
			priority: {
				label: 'medium',
				source: medium,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1175',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(1),
			priority: {
				label: 'low',
				source: low,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: story,
			},
			issueNumber: 'DONUT-1176',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies accumsan justo, eget pretium quam aliquet semper.',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: undefined,
			priority: {
				label: 'trivial',
				source: trivial,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'epic',
				source: epic,
			},
			issueNumber: 'DONUT-1177',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(10),
			priority: {
				label: 'blocker',
				source: blocker,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1178',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(12),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'epic',
				source: epic,
			},
			issueNumber: 'DONUT-1179',
			summary: 'This level is hard',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(0),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: story,
			},
			issueNumber: 'DONUT-1180',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(5),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1181',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(6),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1182',
			summary: 'This level is hard',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(8),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1183',
			summary: 'This level contains five Dragon coins',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(20),
			priority: {
				label: 'major',
				source: major,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: story,
			},
			issueNumber: 'DONUT-1184',
			summary: "Audio in meeting room K909 doesn't work",
			assignee: undefined,
			people: generateMockPeopleResponse(2),
			priority: {
				label: 'high',
				source: high,
			},
			status: {
				text: 'In Progress',
				status: 'inprogress',
			},
			resolution: 'Unresolved',
			created: '23/Jul/20',
			updated: '23/Jul/20',
			due: '24/Jul/20',
			link: 'https://product-fabric.atlassian.net/browse/EDM-5591',
		},
		{
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1185',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(3),
			priority: {
				label: 'low',
				source: low,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: story,
			},
			issueNumber: 'DONUT-1186',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies accumsan justo, eget pretium quam aliquet semper.',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(3),
			priority: {
				label: 'trivial',
				source: trivial,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1187',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(4),
			priority: {
				label: 'blocker',
				source: blocker,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1188',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(2),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1189',
			summary: 'This level is hard',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(7),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'story',
				source: story,
			},
			issueNumber: 'DONUT-1190',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(5),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'epic',
				source: epic,
			},
			issueNumber: 'DONUT-1191',
			summary: 'This level is hard',
			assignee: undefined,
			people: generateMockPeopleResponse(1),
			priority: {
				label: 'high',
				source: high,
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
			ari: {
				data: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${mocks++}`,
			},
			type: {
				label: 'task',
				source: task,
			},
			issueNumber: 'DONUT-1192',
			summary: 'This level is hard',
			assignee: {
				displayName: 'Scott Farquhar',
				source: profile,
			},
			people: generateMockPeopleResponse(4),
			priority: {
				label: 'high',
				source: high,
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

export const mockSiteData = [
	{
		cloudId: '67899',
		url: 'https://hello.atlassian.net',
		displayName: 'hello',
	},
	{
		cloudId: '12345',
		url: 'https://test1.atlassian.net',
		displayName: 'test1',
	},
	{
		cloudId: '45678',
		url: 'https://test2.atlassian.net',
		displayName: 'test2',
	},
	{
		cloudId: '78911',
		url: 'https://test4.atlassian.net',
		displayName: 'test4',
	},
	{
		cloudId: '33333',
		url: 'https://test7.atlassian.net',
		displayName: 'testNetworkError',
	},
	{
		cloudId: '44444',
		url: 'https://test7.atlassian.net',
		displayName: 'testNoAccess',
	},
	{
		cloudId: '22222',
		url: 'https://test6.atlassian.net',
		displayName: 'testNoResults',
	},
	{
		cloudId: '11111',
		url: 'https://test5.atlassian.net',
		displayName: 'testSingleIssue',
	},
];

export const mockSite: Site = {
	cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
	displayName: 'forge-smart-link-battleground',
	url: 'https://forge-smart-link-battleground.jira-dev.com',
};

// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/#api-rest-api-3-jql-autocompletedata-post
export const mockAutoCompleteData = {
	visibleFieldNames: [
		{
			value: 'status',
			displayName: 'status',
			operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
			searchable: 'true',
			auto: 'true',
			orderable: 'true',
			types: ['com.atlassian.jira.issue.status.Status'],
		},
		{
			value: 'issuetype',
			displayName: 'issuetype',
			operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
			searchable: 'true',
			auto: 'true',
			orderable: 'true',
			types: ['com.atlassian.jira.issue.issuetype.IssueType'],
		},
		{
			value: 'cf[10062]',
			displayName: 'Component - cf[10062]',
			orderable: 'true',
			auto: 'true',
			cfid: 'cf[10062]',
			operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
			types: ['com.atlassian.jira.issue.customfields.option.Option'],
		},
		{
			value: '"Component[Dropdown]"',
			displayName: 'Component - Component[Dropdown]',
			searchable: 'true',
			auto: 'true',
			operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
			types: ['com.atlassian.jira.issue.customfields.option.Option'],
		},
	],
	visibleFunctionNames: [
		{
			value: 'standardIssueTypes()',
			displayName: 'standardIssueTypes()',
			isList: 'true',
			types: ['com.atlassian.jira.issue.issuetype.IssueType'],
		},
		{
			value: 'currentUser()',
			displayName: 'currentUser()',
			types: ['com.atlassian.jira.user.ApplicationUser'],
		},
	],
	jqlReservedWords: ['empty', 'and', 'or', 'in', 'distinct'],
};

// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/#api-rest-api-3-jql-autocompletedata-suggestions-get
export const mockSuggestionData = {
	results: [
		{
			value: '"0. On Hold"',
			displayName: '0. On Hold',
		},
		{
			value: '"0. Parking Lot"',
			displayName: '0. Parking Lot',
		},
		{
			value: '"0 - Paused"',
			displayName: '0 - Paused',
		},
	],
};

export const defaultInitialVisibleColumnKeys: string[] = [
	// Order of actual columns is in different order is on purpose
	// To demonstrate that this list is a king
	'type',
	'key',
	'summary',
	'link',
	'assignee',
	'people',
	'labels',
	'status',
	'created',
	'description',
];
