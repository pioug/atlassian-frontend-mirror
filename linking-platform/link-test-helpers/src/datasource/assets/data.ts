import {
	type DatasourceDataResponse,
	type DatasourceDataResponseItem,
	type DatasourceDetailsResponse,
	type DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types';

import { mike, nidhin, profile } from '../../images';

export const objectSchemaListResponse = {
	values: [
		{
			id: '1',
			name: 'objSchema1',
		},
		{
			id: '2',
			name: 'objSchema2',
		},
		{
			id: '3',
			name: 'objSchema3',
		},
		{
			id: '4',
			name: 'objSchema4',
		},
		{
			id: '5',
			name: 'Demo',
		},
		{
			id: '6',
			name: 'Test',
		},
	],
};
export const assetsColumns: DatasourceResponseSchemaProperty[] = [
	{
		key: 'Key',
		type: 'link',
		title: 'Key',
		isList: false,
	},
	{
		key: 'Label',
		type: 'string',
		title: 'Label',
		isList: false,
	},
	{
		key: 'Created',
		type: 'datetime',
		title: 'Created',
		isList: false,
	},
	{
		key: 'Updated',
		type: 'datetime',
		title: 'Updated',
		isList: false,
	},
	{
		key: 'Name',
		type: 'string',
		title: 'Name',
		isList: false,
	},
	{
		key: 'Number of Slots',
		type: 'number',
		title: 'Number of Slots',
		isList: false,
	},
	{
		key: 'Is Virtual',
		type: 'string',
		title: 'Is Virtual',
		isList: false,
	},
	{
		key: 'Primary Capability',
		type: 'string',
		title: 'Primary Capability',
		isList: false,
	},
	{
		key: 'Workgroup',
		type: 'string',
		title: 'Workgroup',
		isList: false,
	},
	{
		key: 'Asset Birthdate',
		type: 'datetime',
		title: 'Asset Birthdate',
		isList: false,
	},
	{
		key: 'Asset Status',
		type: 'status',
		title: 'Asset Status',
		isList: false,
	},
	{
		key: 'Manufacturer',
		type: 'string',
		title: 'Manufacturer',
		isList: false,
	},
	{
		key: 'Owners',
		type: 'string',
		title: 'Owners',
		isList: false,
	},
	{
		key: 'Change approvers',
		type: 'user',
		title: 'Change approvers',
		isList: false,
	},
	{
		key: 'Notes',
		type: 'string',
		title: 'Notes',
		isList: false,
	},
	{
		key: 'Hardware Components',
		type: 'link',
		title: 'Hardware Components',
		isList: true,
	},
	{
		key: 'Applications',
		type: 'link',
		title: 'Applications',
		isList: false,
	},
	{
		key: 'Software Services',
		type: 'link',
		title: 'Software Services',
		isList: false,
	},
	{
		key: 'Bitbucket Repo',
		type: 'link',
		title: 'Bitbucket Repo',
		isList: false,
	},
];

export const assetsResponseItems: DatasourceDataResponseItem[] = [
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1338',
				text: 'LSD-1338',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 1',
		},
		Created: {
			data: '2023-10-30T02:02:06.103Z',
		},
		Updated: {
			data: '2023-10-30T02:13:49.575Z',
		},
		'Number of Slots': {
			data: 3,
		},
		'Is Virtual': {
			data: 'True',
		},
		'Primary Capability': {
			data: 'Storage',
		},
		Workgroup: {
			data: 'Workgroup 1',
		},
		'Asset Birthdate': {
			data: '2023-10-05T15:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Action Needed',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'atlassian-addons-admin',
		},
		'Change approvers': {
			data: {
				displayName: 'Scott Farquhar',
				avatarSource: profile,
			},
		},
		Notes: {
			data: 'This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long note for server object',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1329',
					text: 'Hardware 4',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1332',
				text: 'Application 3',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/my-first-repo',
				text: 'my-first-repo',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 1',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1339',
				text: 'LSD-1339',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 2',
		},
		Created: {
			data: '2023-10-30T04:07:30.866Z',
		},
		Updated: {
			data: '2023-10-30T04:07:30.866Z',
		},
		'Number of Slots': {
			data: 5,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Switch',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-10-12T14:00:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Closed',
				style: {
					appearance: 'removed',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'confluence-admins',
		},
		'Change approvers': {
			data: {
				displayName: 'Nidhin',
				avatarSource: nidhin,
			},
		},
		Notes: {
			data: 'Some notes',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1335',
				text: 'Software Service 2',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/2',
				text: '2',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 2',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1340',
				text: 'LSD-1340',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 3',
		},
		Created: {
			data: '2023-10-30T04:30:56.853Z',
		},
		Updated: {
			data: '2023-10-30T04:30:56.854Z',
		},
		'Number of Slots': {
			data: 6,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Server',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-10-17T16:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Active',
				style: {
					appearance: 'success',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'assets-users',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike',
				avatarSource: mike,
			},
		},
		'Hardware Components': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
				text: 'Hardware 2',
				style: {
					appearance: 'default',
				},
			},
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/12',
				text: '12',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 3',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1341',
				text: 'LSD-1341',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 4',
		},
		Created: {
			data: '2023-10-30T04:32:11.471Z',
		},
		Updated: {
			data: '2023-10-30T04:32:11.471Z',
		},
		'Number of Slots': {
			data: 1,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Router',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-11-09T16:00:00Z',
		},
		'Asset Status': {
			data: {
				text: 'In Service',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 2',
		},
		Owners: {
			data: 'assets-admins',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike User1',
				avatarSource: '',
			},
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1332',
				text: 'Application 3',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 4',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1342',
				text: 'LSD-1342',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 5',
		},
		Created: {
			data: '2023-10-30T04:35:21.187Z',
		},
		Updated: {
			data: '2023-10-30T04:35:21.187Z',
		},
		'Number of Slots': {
			data: 3,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Storage',
		},
		Workgroup: {
			data: 'Workgroup 1',
		},
		'Asset Birthdate': {
			data: '2023-10-05T15:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Action Needed',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'atlassian-addons-admin',
		},
		'Change approvers': {
			data: {
				displayName: 'Scott Farquhar',
				avatarSource: profile,
			},
		},
		Notes: {
			data: 'This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long note for server object',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1329',
					text: 'Hardware 4',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1326',
					text: 'Hardware 1',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1332',
				text: 'Application 3',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/my-first-repo',
				text: 'my-first-repo',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 5',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1343',
				text: 'LSD-1343',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 6',
		},
		Created: {
			data: '2023-10-30T04:35:40.869Z',
		},
		Updated: {
			data: '2023-10-30T04:36:02.954Z',
		},
		'Number of Slots': {
			data: 5,
		},
		'Is Virtual': {
			data: 'True',
		},
		'Primary Capability': {
			data: 'Switch',
		},
		Workgroup: {
			data: 'Workgroup 1',
		},
		'Asset Birthdate': {
			data: '2023-10-12T14:00:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Closed',
				style: {
					appearance: 'removed',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'confluence-admins',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike',
				avatarSource: mike,
			},
		},
		Notes: {
			data: 'Some notes',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1335',
				text: 'Software Service 2',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/2',
				text: '2',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 6',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1344',
				text: 'LSD-1344',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 7',
		},
		Created: {
			data: '2023-10-30T04:36:34.637Z',
		},
		Updated: {
			data: '2023-10-30T04:36:34.637Z',
		},
		'Number of Slots': {
			data: 4,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Router',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-11-09T16:00:00Z',
		},
		'Asset Status': {
			data: {
				text: 'In Service',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 2',
		},
		Owners: {
			data: 'assets-admins',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike User1',
				avatarSource: '',
			},
		},
		Notes: {
			data: 'Test test',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1329',
					text: 'Hardware 4',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1332',
				text: 'Application 3',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 7',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1345',
				text: 'LSD-1345',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 8',
		},
		Created: {
			data: '2023-10-30T04:37:12.554Z',
		},
		Updated: {
			data: '2023-10-30T04:37:12.554Z',
		},
		'Number of Slots': {
			data: 5,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Storage',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-10-02T16:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Active',
				style: {
					appearance: 'success',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'assets-users',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike',
				avatarSource: mike,
			},
		},
		'Hardware Components': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
				text: 'Hardware 2',
				style: {
					appearance: 'default',
				},
			},
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/12',
				text: '12',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 8',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1346',
				text: 'LSD-1346',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 9',
		},
		Created: {
			data: '2023-10-30T04:39:33.994Z',
		},
		Updated: {
			data: '2023-10-30T04:39:33.994Z',
		},
		'Number of Slots': {
			data: 1,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Router',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-11-09T16:00:00Z',
		},
		'Asset Status': {
			data: {
				text: 'In Service',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 2',
		},
		Owners: {
			data: 'assets-admins',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike Manager',
				avatarSource: '',
			},
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
					text: 'Hardware 2',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1331',
				text: 'Application 2',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/7',
				text: '7',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 9',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1347',
				text: 'LSD-1347',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 10',
		},
		Created: {
			data: '2023-10-30T04:40:19.055Z',
		},
		Updated: {
			data: '2023-10-30T04:40:19.055Z',
		},
		'Number of Slots': {
			data: 10,
		},
		'Primary Capability': {
			data: 'Storage',
		},
		'Asset Birthdate': {
			data: '2023-10-05T15:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Action Needed',
				style: {
					appearance: 'moved',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'atlassian-addons-admin',
		},
		'Change approvers': {
			data: {
				displayName: 'Scott Farquhar',
				avatarSource: profile,
			},
		},
		Notes: {
			data: 'This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long note for server object',
		},
		'Hardware Components': {
			data: [
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1329',
					text: 'Hardware 4',
					style: {
						appearance: 'default',
					},
				},
				{
					url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1328',
					text: 'Hardware 3',
					style: {
						appearance: 'default',
					},
				},
			],
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/my-first-repo',
				text: 'my-first-repo',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 10',
		},
	},
	{
		Key: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1348',
				text: 'LSD-1348',
				style: {
					appearance: 'default',
				},
			},
		},
		Name: {
			data: 'Server 11',
		},
		Created: {
			data: '2023-10-30T04:41:01.953Z',
		},
		Updated: {
			data: '2023-10-30T04:41:01.953Z',
		},
		'Number of Slots': {
			data: 6,
		},
		'Is Virtual': {
			data: 'False',
		},
		'Primary Capability': {
			data: 'Server',
		},
		Workgroup: {
			data: 'Workgroup 2',
		},
		'Asset Birthdate': {
			data: '2023-10-08T16:30:00Z',
		},
		'Asset Status': {
			data: {
				text: 'Active',
				style: {
					appearance: 'success',
					isBold: false,
				},
			},
		},
		Manufacturer: {
			data: 'Manufacturer 1',
		},
		Owners: {
			data: 'assets-users',
		},
		'Change approvers': {
			data: {
				displayName: 'Mike',
				avatarSource: mike,
			},
		},
		'Hardware Components': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1327',
				text: 'Hardware 2',
				style: {
					appearance: 'default',
				},
			},
		},
		Applications: {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
				text: 'Application 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Software Services': {
			data: {
				url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1337',
				text: 'Software Service 4',
				style: {
					appearance: 'default',
				},
			},
		},
		'Bitbucket Repo': {
			data: {
				url: 'https://integration.bb-inf.net/test-instance-atlassian-bd7y3o/12',
				text: '12',
				style: {
					appearance: 'default',
				},
			},
		},
		Label: {
			data: 'Server 11',
		},
	},
];

export const assetsDefaultInitialVisibleColumnKeys: string[] = [
	'Key',
	'Label',
	'Created',
	'Is Virtual',
	'Owners',
	'Change approvers',
	'Notes',
	'Hardware Components',
	'Applications',
	'Software Services',
];

export const defaultAssetsDetailsResponse: DatasourceDetailsResponse = {
	meta: {
		access: 'granted',
		auth: [],
		destinationObjectTypes: ['assets'],
		extensionKey: 'jsm-cmdb-gateway',
		visibility: 'restricted',
	},
	data: {
		schema: {
			properties: assetsColumns,
			defaultProperties: assetsDefaultInitialVisibleColumnKeys,
		},
		ari: 'mock-ari',
		id: 'mock-id',
		name: 'AQL Datasource',
		description: 'Fetches Objects using AQL',
		parameters: [],
	},
};

export const assetsDefaultDetails = {
	...defaultAssetsDetailsResponse,
	data: {
		...defaultAssetsDetailsResponse.data,
		schema: {
			...defaultAssetsDetailsResponse.data.schema,
			defaultProperties: assetsDefaultInitialVisibleColumnKeys,
		},
	},
};

export const generateDataResponse = ({
	initialVisibleColumnKeys,
	isUnauthorized = false,
}: {
	initialVisibleColumnKeys: string[];
	isUnauthorized?: boolean;
}): DatasourceDataResponse => {
	const detailsResponse = defaultAssetsDetailsResponse;

	const schema = {
		properties: detailsResponse.data.schema.properties.filter(({ key }) => {
			return initialVisibleColumnKeys.includes(key);
		}),
		defaultProperties: assetsDefaultInitialVisibleColumnKeys,
	};

	return {
		meta: {
			access: isUnauthorized ? 'unauthorized' : 'granted',
			auth: [],
			destinationObjectTypes: ['assets'],
			extensionKey: 'jsm-cmdb-gateway',
			visibility: 'restricted',
		},
		data: {
			items: assetsResponseItems,
			totalCount: assetsResponseItems.length,
			nextPageCursor: undefined,
			...{ schema },
		},
	};
};
