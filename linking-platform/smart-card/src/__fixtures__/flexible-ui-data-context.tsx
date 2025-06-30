import { SmartLinkActionType } from '@atlaskit/linking-types';

import { ActionName, IconType, MediaType } from '../constants';
import { type FlexibleUiDataContext } from '../state/flexible-ui-context/types';

const context: FlexibleUiDataContext = {
	actions: {
		PreviewAction: {
			invokeAction: {
				actionFn: jest.fn(),
				actionType: ActionName.PreviewAction,
			},
		},
		DownloadAction: {
			invokeAction: {
				actionFn: jest.fn(),
				actionType: ActionName.DownloadAction,
			},
		},
		FollowAction: {
			action: {
				action: {
					actionType: SmartLinkActionType.FollowEntityAction,
					resourceIdentifiers: {},
				},
				providerKey: 'object-provider',
			},
			value: true,
			isProject: true,
		},
		CopyLinkAction: {
			invokeAction: {
				actionFn: jest.fn(),
				actionType: ActionName.CopyLinkAction,
			},
		},
		AISummaryAction: {
			url: 'https://www.link-url.com',
		},
		AutomationAction: {
			baseAutomationUrl: 'https://www.link-url.com',
			objectAri: 'someAri',
			siteAri: 'someAri',
			canManageAutomation: false,
			analyticsSource: 'smart-card',
			product: 'confluence',
			resourceType: 'page',
		},
		ViewRelatedLinksAction: {
			ari: 'ari:cloud:link:1234:example:abcd',
		},
	},
	appliedToComponentsCount: 2,
	attachmentCount: 3,
	authorGroup: [{ name: 'Alexander Hamilton' }, { name: 'Spongebob Squarepants' }],
	checklistProgress: '4/7',
	collaboratorGroup: [{ name: 'James Bond' }, { name: 'Spiderman' }],
	commentCount: 10,
	createdBy: 'Doctor Stephen Vincent Strange',
	createdOn: '2020-02-04T12:40:12.353+0800',
	dueOn: '2022-02-22T12:40:12.353+0800',
	latestCommit: '03e6a82',
	linkIcon: {
		icon: 'BitBucket:Project' as IconType,
		label: 'Link icon',
	},
	linkTitle: {
		text: 'Link title',
		url: 'https://www.link-url.com',
	},
	location: {
		text: 'Location title',
		url: 'https://www.locationMcLocationton.com/foo',
	},
	meta: {
		objectId: '123',
		resourceType: 'page',
		tenantId: 'tenant-123',
	},
	modifiedBy: 'Tony Stark',
	modifiedOn: '2022-01-12T12:40:12.353+0800',
	ownedBy: 'Bruce Banner',
	ownedByGroup: [
		{
			name: 'Bruce Banner',
			src: 'https://person-url',
		},
	],
	assignedTo: 'Bruce Assigned',
	assignedToGroup: [
		{
			name: 'Bruce Assigned',
			src: 'https://person-url',
		},
	],
	preview: { type: MediaType.Image, url: 'image-url' },
	priority: {
		icon: 'Badge:PriorityMajor' as IconType,
		label: 'Major',
	},
	programmingLanguage: 'Javascript',
	provider: {
		icon: 'Provider:Confluence' as IconType,
		label: 'Confluence',
	},
	reactCount: 31,
	readTime: '5 minutes',
	snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	sourceBranch: 'lp-flexible-smart-links',
	state: {
		appearance: 'success',
		text: 'Link state',
	},
	subscriberCount: 20,
	storyPoints: 3,
	teamMemberCount: 3,
	subTasksProgress: '3/4',
	targetBranch: 'master',
	title: 'Link title',
	url: 'https://www.link-url.com',
	viewAction: {
		invokeAction: {
			actionFn: jest.fn(),
			actionType: ActionName.PreviewAction,
		},
	},
	sentOn: '2023-08-10T03:45:14.797Z',
	viewCount: 21,
	voteCount: 41,
	userAttributes: {
		role: 'Frontend Developer (React/TypeScript)',
	},
};

export default context;
