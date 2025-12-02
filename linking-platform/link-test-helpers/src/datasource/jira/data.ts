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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: generateMockPeopleResponse(4),
			priority: {
				label: 'major',
				source: questionMark,
				text: 'Major',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: generateMockPeopleResponse(3),
			priority: {
				label: 'high',
				source: high,
				text: 'High',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: generateMockPeopleResponse(2),
			priority: {
				label: 'medium',
				source: medium,
				text: 'Medium',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: generateMockPeopleResponse(1),
			priority: {
				label: 'low',
				source: low,
				text: 'Low',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: undefined,
			priority: {
				label: 'trivial',
				source: trivial,
				text: 'Trivial',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
			people: generateMockPeopleResponse(10),
			priority: {
				label: 'blocker',
				source: blocker,
				text: 'Blocker',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
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
			project: {
				name: 'EDM',
				id: '10000',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
			},
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
			project: {
				name: 'EDM',
				id: '10000',
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
		products: ['jira-software.ondemand', 'jira-servicedesk.ondemand', 'confluence.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '12345',
		url: 'https://test1.atlassian.net',
		displayName: 'test1',
		products: ['jira-software.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '45678',
		url: 'https://test2.atlassian.net',
		displayName: 'test2',
		products: ['jira-software.ondemand', 'jira-product-discovery'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '78911',
		url: 'https://test4.atlassian.net',
		displayName: 'test4',
		products: ['jira-product-discovery'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '33333',
		url: 'https://test7.atlassian.net',
		displayName: 'testNetworkError',
		products: ['jira-product-discovery', 'jira-servicedesk.ondemand', 'confluence.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '44444',
		url: 'https://test7.atlassian.net',
		displayName: 'testNoAccess',
		products: ['jira-product-discovery', 'jira-servicedesk.ondemand', 'confluence.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '22222',
		url: 'https://test6.atlassian.net',
		displayName: 'testNoResults',
		products: ['jira-product-discovery', 'jira-servicedesk.ondemand', 'confluence.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
	{
		cloudId: '11111',
		url: 'https://test5.atlassian.net',
		displayName: 'testSingleIssue',
		products: ['jira-product-discovery', 'jira-servicedesk.ondemand', 'confluence.ondemand'],
		avatarUrl: undefined,
		isVertigo: false,
	},
];

export const mockProductsData = [
	{
		productId: 'jira-software.ondemand',
		productDisplayName: 'Jira Software',
		workspaces: [
			{
				cloudId: '67899',
				cloudUrl: 'https://hello.atlassian.net',
				workspaceDisplayName: 'hello',
			},
			{
				cloudId: '12345',
				cloudUrl: 'https://test1.atlassian.net',
				workspaceDisplayName: 'test1',
			},
			{
				cloudId: '45678',
				cloudUrl: 'https://test2.atlassian.net',
				workspaceDisplayName: 'test2',
			},
		],
	},
	{
		productId: 'jira-product-discovery',
		productDisplayName: 'JPD',
		workspaces: [
			{
				cloudId: '45678',
				cloudUrl: 'https://test2.atlassian.net',
				workspaceDisplayName: 'test2',
			},
			{
				cloudId: '78911',
				cloudUrl: 'https://test4.atlassian.net',
				workspaceDisplayName: 'test4',
			},
			{
				cloudId: '33333',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNetworkError',
			},
			{
				cloudId: '44444',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNoAccess',
			},
			{
				cloudId: '22222',
				cloudUrl: 'https://test6.atlassian.net',
				workspaceDisplayName: 'testNoResults',
			},
			{
				cloudId: '11111',
				cloudUrl: 'https://test5.atlassian.net',
				workspaceDisplayName: 'testSingleIssue',
			},
		],
	},
	{
		productId: 'jira-servicedesk.ondemand',
		productDisplayName: 'Jira Service Desk',
		workspaces: [
			{
				cloudId: '67899',
				cloudUrl: 'https://hello.atlassian.net',
				workspaceDisplayName: 'hello',
			},
			{
				cloudId: '44444',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNoAccess',
			},
			{
				cloudId: '22222',
				cloudUrl: 'https://test6.atlassian.net',
				workspaceDisplayName: 'testNoResults',
			},
			{
				cloudId: '11111',
				cloudUrl: 'https://test5.atlassian.net',
				workspaceDisplayName: 'testSingleIssue',
			},
			{
				cloudId: '33333',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNetworkError',
			},
		],
	},
	{
		productId: 'confluence.ondemand',
		productDisplayName: 'Confluence',
		workspaces: [
			{
				cloudId: '67899',
				cloudUrl: 'https://hello.atlassian.net',
				workspaceDisplayName: 'hello',
			},
			{
				cloudId: '44444',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNoAccess',
			},
			{
				cloudId: '22222',
				cloudUrl: 'https://test6.atlassian.net',
				workspaceDisplayName: 'testNoResults',
			},
			{
				cloudId: '11111',
				cloudUrl: 'https://test5.atlassian.net',
				workspaceDisplayName: 'testSingleIssue',
			},
			{
				cloudId: '33333',
				cloudUrl: 'https://test7.atlassian.net',
				workspaceDisplayName: 'testNetworkError',
			},
		],
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
	'priority',
	// TODO: Uncomment this when cleaning up jpd_confluence_date_fields_improvements
	// 'daterange',
];
