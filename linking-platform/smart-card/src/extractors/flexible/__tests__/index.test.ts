import { type JsonLd } from 'json-ld-types';

import AtlasProject from '../../../__fixtures__/atlas-project';
import BitbucketPullRequest from '../../../__fixtures__/bitbucket-pull-request';
import ConfluenceBlog from '../../../__fixtures__/confluence-blog';
import ConfluencePage from '../../../__fixtures__/confluence-page';
import ConfluenceSpace from '../../../__fixtures__/confluence-space';
import ConfluenceTemplate from '../../../__fixtures__/confluence-template';
import DropboxFile from '../../../__fixtures__/dropbox-file';
import Figma from '../../../__fixtures__/figma';
import JiraRoadMap from '../../../__fixtures__/jira-roadmap';
import JiraTask from '../../../__fixtures__/jira-task';
import JiraTimeline from '../../../__fixtures__/jira-timeline';
import YouTubeVideo from '../../../__fixtures__/youtube-video';
import extractFlexibleUiContext from '../index';

describe('extractFlexibleUiContext', () => {
	it('returns flexible ui context for bitbucket pull request', () => {
		const data = extractFlexibleUiContext({
			response: BitbucketPullRequest as JsonLd.Response,
		});
		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: undefined,
						display: undefined,
						extensionKey: 'native-bitbucket-object-provider',
						id: undefined,
						resourceType: 'pull',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: undefined,
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			authorGroup: [{ name: 'Angie Mccarthy', src: 'https://person-url' }],
			collaboratorGroup: [{ name: 'Angie Mccarthy', src: 'https://person-url' }],
			createdBy: 'Angie Mccarthy',
			createdOn: '2022-07-04T12:04:10.182Z',
			linkIcon: {
				label: 'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
				url: 'https://icon-url',
				render: undefined,
			},
			modifiedBy: 'Angie Mccarthy',
			modifiedOn: '2022-07-04T12:05:28.601Z',
			provider: { label: 'Bitbucket', url: 'https://icon-url' },
			sourceBranch: 'source-branch',
			state: { text: 'open', appearance: 'inprogress', action: undefined },
			targetBranch: 'target-branch',
			title: 'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
			url: 'https://link-url',
		});
	});

	it('returns flexible ui context for confluence page', () => {
		const data = extractFlexibleUiContext({
			response: ConfluencePage as JsonLd.Response,
		});
		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'confluence-object-provider',
						display: undefined,
						extensionKey: 'confluence-object-provider',
						id: undefined,
						resourceType: 'page',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'confluence-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			authorGroup: undefined,
			ownedByGroup: [{ name: 'Angie Mccarthy', src: 'https://person-url' }],
			commentCount: 24,
			ownedBy: 'Angie Mccarthy',
			linkIcon: {
				icon: 'FileType:Document',
				label: 'Everything you need to know about ShipIt53!',
				render: undefined,
			},
			provider: { icon: 'Provider:Confluence', label: 'Confluence' },
			snippet: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
			subscriberCount: 21,
			title: 'Everything you need to know about ShipIt53!',
			url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
		});
	});

	it('returns flexible ui context for confluence blog', () => {
		const data = extractFlexibleUiContext({
			response: ConfluenceBlog as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'confluence-object-provider',
						display: undefined,
						extensionKey: 'confluence-object-provider',
						id: undefined,
						resourceType: 'blog',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'confluence-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			ownedByGroup: [{ name: 'Angie Mccarthy', src: 'https://person-url' }],
			commentCount: 7,
			ownedBy: 'Angie Mccarthy',
			linkIcon: {
				icon: 'FileType:Blog',
				label: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
				render: undefined,
			},
			provider: { icon: 'Provider:Confluence', label: 'Confluence' },
			snippet:
				'A few weeks ago, we announced a brand new award for ShipIt - the Customer Fun Award. The goal was to generate ideas to create fun experiences in our new product, Canvas.',
			subscriberCount: 17,
			title: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
			url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
		});
	});

	it('returns flexible ui context confluence space', () => {
		const data = extractFlexibleUiContext({
			response: ConfluenceSpace as JsonLd.Response,
		});
		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'confluence-object-provider',
						display: undefined,
						extensionKey: 'confluence-object-provider',
						id: undefined,
						resourceType: 'space',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: undefined,
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: { label: 'ShipIt', url: 'https://icon-url', render: undefined },
			provider: { icon: 'Provider:Confluence', label: 'Confluence' },
			title: 'ShipIt',
			url: 'https://confluence-url/wiki/spaces/space-id',
		});
	});

	it('returns flexible ui context for confluence template', () => {
		const data = extractFlexibleUiContext({
			response: ConfluenceTemplate as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'confluence-object-provider',
						display: undefined,
						extensionKey: undefined,
						id: undefined,
						resourceType: 'template',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: undefined,
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: {
				icon: 'FileType:Template',
				label: 'templateName_4815162342',
				render: undefined,
			},
			provider: { icon: 'Provider:Confluence', label: 'Confluence' },
			snippet: 'Description for templateName_4815162342',

			title: 'templateName_4815162342',
			url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
		});
	});

	it('returns flexible ui context for jira task', () => {
		const data = extractFlexibleUiContext({
			response: JiraTask as JsonLd.Response,
			actionOptions: { hide: true },
		});

		expect(data).toEqual({
			authorGroup: [{ name: 'Fluffy Fluffington', src: undefined }],
			commentCount: 1,
			createdBy: 'Fluffy Fluffington',
			createdOn: '2021-10-19T11:35:10.027+1100',
			linkIcon: {
				label: 'Flexible UI Task',
				url: 'https://icon-url',
				render: undefined,
			},
			modifiedOn: '2021-12-16T10:47:20.054+1100',
			priority: { label: 'Major', url: 'https://priority-icon-url' },
			provider: { icon: 'Provider:Jira', label: 'Jira' },
			state: { text: '(Awaiting) Deployment', appearance: 'success' },
			subscriberCount: 2,
			title: 'Flexible UI Task',
			url: 'https://jira-url/browse/id',
		});
	});

	it('returns flexible ui context for jira roadmap', () => {
		const data = extractFlexibleUiContext({
			response: JiraRoadMap as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'jira-object-provider',
						display: undefined,
						extensionKey: 'jira-object-provider',
						id: undefined,
						resourceType: 'roadmap',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'jira-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: {
				label: 'Linking Platform',
				url: 'https://icon-url',
				render: undefined,
			},
			provider: { icon: 'Provider:Jira', label: 'Jira' },
			title: 'Linking Platform',
			url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
		});
	});

	it('returns flexible ui context for jira timeline', () => {
		const data = extractFlexibleUiContext({
			response: JiraTimeline as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'jira-object-provider',
						display: undefined,
						extensionKey: 'jira-object-provider',
						id: undefined,
						resourceType: 'roadmap',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'jira-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: {
				label: 'Linking Platform',
				url: 'https://icon-url',
				render: undefined,
			},
			provider: { icon: 'Provider:Jira', label: 'Jira' },
			title: 'Linking Platform',
			url: 'https://jira-url/projects/project-id/boards/board-id/timeline',
		});
	});

	it('returns flexible ui context for atlas project', () => {
		const data = extractFlexibleUiContext({
			response: AtlasProject as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'watermelon-object-provider',
						display: undefined,
						extensionKey: 'watermelon-object-provider',
						id: undefined,
						resourceType: undefined,
					},
				},
				DownloadAction: undefined,
				FollowAction: {
					action: {
						action: {
							actionType: 'FollowEntityAction',
							resourceIdentifiers: { ari: 'some-id' },
						},
						providerKey: 'watermelon-object-provider',
						reload: { id: undefined, url: 'https://link-url' },
					},
					value: true,
					isProject: true,
				},
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'watermelon-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			authorGroup: [{ name: 'Lois Lane', src: 'https://person-url' }],
			commentCount: 1,
			createdBy: 'Lois Lane',
			dueOn: '2030-12-31',
			linkIcon: {
				label: 'The Superman Project',
				url: 'https://icon-url',
				render: undefined,
			},
			modifiedOn: '2023-03-05T08:00:00.861423',
			provider: { label: 'Atlas', url: 'https://icon-url' },
			snippet: 'The journey to discover the real identity of Superman?',
			state: {
				text: 'On track',
				appearance: 'success',
				style: undefined,
				action: undefined,
			},
			subscriberCount: 109,
			title: 'The Superman Project',
			url: 'https://link-url',
		});
	});

	it('returns flexible ui context for figma', () => {
		const data = extractFlexibleUiContext({
			response: Figma as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: '19ec1155-f5d8-45d3-ab2a-3f4a3d9d060e',
						display: undefined,
						extensionKey: 'figma-object-provider',
						id: undefined,
						resourceType: 'file',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'figma-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: { label: 'Figma', url: 'https://icon-url', render: undefined },
			modifiedOn: '2021-12-14T05:07:13Z',
			preview: { type: 'image', url: 'https://image-url' },
			provider: { label: 'Figma', url: 'https://icon-url' },
			title: 'Flexible Links',
			url: 'https://figma-url/Flexible-Links?node-id=node-id',
		});
	});

	it('returns flexible ui context for youtube video', () => {
		const data = extractFlexibleUiContext({
			response: YouTubeVideo as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: 'dc00272f-0cdd-43e1-92a9-c0ab00807c1a',
						display: undefined,
						extensionKey: 'iframely-object-provider',
						id: undefined,
						resourceType: 'youtube',
					},
				},
				DownloadAction: undefined,
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'iframely-object-provider',
						id: undefined,
					},
				},
				AutomationAction: undefined,
				AISummaryAction: undefined,
				ViewRelatedLinksAction: undefined,
			},
			linkIcon: {
				label: 'The Atlassian Business Model',
				url: 'https://icon-url',
				render: undefined,
			},
			modifiedOn: '2015-12-10T14:30:00.000Z',
			preview: { type: 'image', url: 'https://image-url' },
			provider: { label: 'YouTube', url: 'https://icon-url' },
			snippet:
				"Atlassian's product strategy, distribution model, and company culture work in concert to create unique value for its customers and a competitive advantage for the company.",
			title: 'The Atlassian Business Model',
			url: 'https://youtube-url/watch?v=video-id',
		});
	});

	it('returns flexible ui context for dropbox file', () => {
		const data = extractFlexibleUiContext({
			response: DropboxFile as JsonLd.Response,
		});

		expect(data).toEqual({
			actions: {
				CopyLinkAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'copyLink',
						actionType: 'CopyLinkAction',
						definitionId: '9c3e33e4-be06-437f-80fb-26c38acd215d',
						display: undefined,
						extensionKey: 'dropbox-object-provider',
						id: undefined,
						resourceType: 'sharedFile',
					},
				},
				DownloadAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'downloadDocument',
						actionType: 'DownloadAction',
						definitionId: '9c3e33e4-be06-437f-80fb-26c38acd215d',
						display: undefined,
						extensionKey: 'dropbox-object-provider',
						id: undefined,
						resourceType: 'sharedFile',
					},
				},
				FollowAction: undefined,
				PreviewAction: {
					invokeAction: {
						actionFn: expect.any(Function),
						actionSubjectId: 'invokePreviewScreen',
						actionType: 'PreviewAction',
						display: undefined,
						extensionKey: 'dropbox-object-provider',
						id: undefined,
					},
				},
			},
			linkIcon: {
				label: 'Happy Guy.gif',
				url: 'https://icon-url',
				render: undefined,
			},
			modifiedOn: '2022-06-30T00:06:16Z',
			preview: { type: 'image', url: 'https://image-url' },
			provider: { label: 'Dropbox', url: 'https://icon-url' },
			title: 'Happy Guy.gif',
			url: 'https://link-url',
		});
	});

	it('returns undefined if response is not provided', () => {
		const data = extractFlexibleUiContext();

		expect(data).toBeUndefined();
	});

	it('returns url as title if title is not provided', () => {
		const url = 'some-url';
		const response = {
			...ConfluencePage,
			data: {
				...ConfluencePage.data,
				name: undefined,
				url,
			},
		} as JsonLd.Response;
		const data = extractFlexibleUiContext({ response });

		expect(data?.title).toEqual(url);
	});

	describe('actions', () => {
		const propUrl = 'prop-url';
		const aiSummaryConfig = { isAdminHubAIEnabled: true };
		const response = {
			meta: {
				...ConfluencePage.meta,
				supportedFeature: ['AISummary'],
			},
			data: {
				...ConfluencePage.data,
				name: undefined,
				url: 'response-url',
			},
		} as JsonLd.Response;

		const data = extractFlexibleUiContext({ aiSummaryConfig, response, url: propUrl });
		expect(data?.actions?.AISummaryAction?.url).toEqual('prop-url');
	});
});
