import { type JsonLd } from '@atlaskit/json-ld-types';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import AtlasProject from '../../../__fixtures__/atlas-project';
import BitbucketPullRequest from '../../../__fixtures__/bitbucket-pull-request';
import CompassScorecard from '../../../__fixtures__/compass-scorecard';
import ConfluenceBlog from '../../../__fixtures__/confluence-blog';
import ConfluencePage from '../../../__fixtures__/confluence-page';
import ConfluenceSpace from '../../../__fixtures__/confluence-space';
import ConfluenceTemplate from '../../../__fixtures__/confluence-template';
import DocumentEntity from '../../../__fixtures__/document-entity';
import DropboxFile from '../../../__fixtures__/dropbox-file';
import Figma from '../../../__fixtures__/figma';
import FigmaEntity from '../../../__fixtures__/figma-entity';
import JiraRoadMap from '../../../__fixtures__/jira-roadmap';
import JiraTask from '../../../__fixtures__/jira-task';
import JiraTimeline from '../../../__fixtures__/jira-timeline';
import YouTubeVideo from '../../../__fixtures__/youtube-video';
import { SmartLinkStatus } from '../../../constants';
import extractFlexibleUiContext from '../index';

describe('extractFlexibleUiContext', () => {
	ffTest.both('smart_links_noun_support', '', () => {
		ffTest.both('platform-linking-visual-refresh-v2', '', () => {
			ffTest.both('cc-ai-linking-platform-snippet-renderer', '', () => {
				it('returns flexible ui context for bitbucket pull request', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
							label:
								'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
							url: 'https://icon-url',
							render: undefined,
						},
						modifiedBy: 'Angie Mccarthy',
						modifiedOn: '2022-07-04T12:05:28.601Z',
						provider: { label: 'Bitbucket', url: 'https://icon-url' },
						sourceBranch: 'source-branch',
						state: { text: 'open', appearance: 'inprogress', action: undefined },
						targetBranch: 'target-branch',
						linkTitle: expect.objectContaining({
							text: 'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
						}),
						url: 'https://link-url',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:SourceCodePullRequest', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'pull-id',
								resourceType: 'pull',
								tenantId: 'bitbucket-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for compass scorecard', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
						response: CompassScorecard as JsonLd.Response,
					});

					expect(data).toEqual({
						actions: {
							AISummaryAction: undefined,
							AutomationAction: undefined,
							CopyLinkAction: {
								invokeAction: {
									actionFn: expect.any(Function),
									actionSubjectId: 'copyLink',
									actionType: 'CopyLinkAction',
									definitionId: undefined,
									display: undefined,
									extensionKey: 'dragonfruit-object-provider',
									id: undefined,
									resourceType: 'scorecard-v2',
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
									extensionKey: 'dragonfruit-object-provider',
									id: undefined,
								},
							},
							ViewRelatedLinksAction: undefined,
						},
						appliedToComponentsCount: 2,
						ari: undefined,
						assignedTo: undefined,
						assignedToGroup: undefined,
						attachmentCount: undefined,
						authorGroup: undefined,
						checklistProgress: undefined,
						collaboratorGroup: undefined,
						commentCount: undefined,
						createdBy: undefined,
						createdOn: undefined,
						dueOn: undefined,
						latestCommit: undefined,
						linkIcon: {
							label: 'Component readiness',
							render: undefined,
							url: 'https://compass-ui.prod-east.frontend.public.atl-paas.net/assets/scorecard-icon.svg',
						},
						location: undefined,
						modifiedBy: undefined,
						modifiedOn: undefined,
						ownedBy: 'Ben Krig',
						ownedByGroup: [
							{
								name: 'Ben Krig',
								src: 'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/5ce5eb3e00d9750e45e260b7/bee2c06c-5a29-4c54-bae4-1b0599289492/128',
							},
						],
						preview: undefined,
						priority: undefined,
						programmingLanguage: undefined,
						provider: {
							label: 'Compass',
							url: 'https://compass-ui.prod-east.frontend.public.atl-paas.net/assets/compass.svg',
						},
						reactCount: undefined,
						readTime: undefined,
						sentOn: undefined,
						snippet:
							'Ensure component details are ready for development teams to reference in the catalog.',
						sourceBranch: undefined,
						state: undefined,
						storyPoints: undefined,
						subTasksProgress: undefined,
						subscriberCount: undefined,
						targetBranch: undefined,
						linkTitle: expect.objectContaining({ text: 'Component readiness' }),
						url: 'https://ben-just-jwm.jira-dev.com/compass/scorecard/a7c20891-8958-4360-bc5a-8d8a26d7cdfc',
						viewCount: undefined,
						voteCount: undefined,
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Project', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'scorecard-id',
								resourceType: 'scorecard-v2',
								tenantId: 'compass-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for confluence page', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({
							text: 'Everything you need to know about ShipIt53!',
						}),
						url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['schema:TextDigitalDocument', 'Document'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'page-id',
								resourceType: 'page',
								tenantId: 'confluence-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for confluence blog', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({
							text: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
						}),
						url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['schema:BlogPosting', 'Document'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'blog-id',
								resourceType: 'blog',
								tenantId: 'confluence-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context confluence space', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'ShipIt' }),
						url: 'https://confluence-url/wiki/spaces/space-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Project', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'space-id',
								resourceType: 'space',
								tenantId: 'confluence-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for confluence template', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'templateName_4815162342' }),
						url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Template', 'Document'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'template-id',
								resourceType: 'template',
								tenantId: 'confluence-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for jira task', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'Flexible UI Task' }),
						url: 'https://jira-url/browse/id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Task', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'task-id',
								resourceType: 'issue',
								tenantId: 'jira-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for jira roadmap', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'Linking Platform' }),
						url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Project', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'roadmap-id',
								resourceType: 'roadmap',
								tenantId: 'jira-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for jira timeline', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'Linking Platform' }),
						url: 'https://jira-url/projects/project-id/boards/board-id/timeline',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Project', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'timeline-id',
								resourceType: 'roadmap',
								tenantId: 'jira-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for atlas project', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'The Superman Project' }),
						url: 'https://link-url',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['atlassian:Project', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'project-id',
								resourceType: undefined,
								tenantId: 'atlas-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for figma', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'Flexible Links' }),
						url: 'https://figma-url/Flexible-Links?node-id=node-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['Document'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'figma-id',
								resourceType: 'file',
								tenantId: 'figma-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for youtube video', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'The Atlassian Business Model' }),
						url: 'https://youtube-url/watch?v=video-id',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'video-id',
								resourceType: 'youtube',
								tenantId: 'youtube-tenant',
							},
						}),
					});
				});

				it('returns flexible ui context for dropbox file', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
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
						linkTitle: expect.objectContaining({ text: 'Happy Guy.gif' }),
						url: 'https://link-url',
						...(fg('platform-linking-visual-refresh-v2') && {
							type: ['schema:TextDigitalDocument', 'Object'],
						}),
						...(fg('cc-ai-linking-platform-snippet-renderer') && {
							meta: {
								objectId: 'file-id',
								resourceType: 'sharedFile',
								tenantId: 'dropbox-tenant',
							},
						}),
					});
				});
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
			const data = extractFlexibleUiContext({ status: SmartLinkStatus.Resolved, response });

			expect(data?.linkTitle?.text).toEqual(url);
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

			const data = extractFlexibleUiContext({
				status: SmartLinkStatus.Resolved,
				aiSummaryConfig,
				response,
				url: propUrl,
			});
			expect(data?.actions?.AISummaryAction?.url).toEqual('prop-url');
		});
	});

	ffTest.on('smart_links_noun_support', '', () => {
		ffTest.both('platform-linking-visual-refresh-v2', '', () => {
			describe('with entity support', () => {
				it('returns flexible ui context for Figma document with entity support', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
						response: FigmaEntity as SmartLinkResponse,
					});
					expect(data).toEqual(
						expect.objectContaining({
							actions: {
								CopyLinkAction: {
									invokeAction: expect.objectContaining({
										actionSubjectId: 'copyLink',
										actionType: 'CopyLinkAction',
										definitionId: '19ec1155-f5d8-45d3-ab2a-3f4a3d9d060e',
										display: undefined,
										extensionKey: 'figma-object-provider',
										id: undefined,
										resourceType: 'file',
									}),
								},
								DownloadAction: undefined,
								FollowAction: undefined,
								PreviewAction: {
									invokeAction: expect.objectContaining({
										actionSubjectId: 'invokePreviewScreen',
										actionType: 'PreviewAction',
										display: undefined,
										extensionKey: 'figma-object-provider',
										id: undefined,
									}),
								},
								AutomationAction: undefined,
								AISummaryAction: undefined,
								ViewRelatedLinksAction: undefined,
							},
							linkIcon: { label: 'Flexible Links', url: 'https://icon-url' },
							modifiedOn: '2025-01-08T22:26:52.501Z',
							preview: { type: 'image', url: 'https://image-url' },
							linkTitle: expect.objectContaining({ text: 'Flexible Links' }),
							url: 'https://figma-url/Flexible-Links?node-id=node-id',
							...(fg('platform-linking-visual-refresh-v2') && {
								type: ['Document'],
							}),
							...(fg('cc-ai-linking-platform-snippet-renderer') && {
								meta: {
									objectId: 'figma-id',
									resourceType: 'file',
									tenantId: 'figma-tenant',
								},
							}),
						}),
					);
				});

				it('returns flexible ui context for Google document with entity support', () => {
					const data = extractFlexibleUiContext({
						status: SmartLinkStatus.Resolved,
						response: DocumentEntity as SmartLinkResponse,
					});
					expect(data).toEqual(
						expect.objectContaining({
							actions: {
								CopyLinkAction: {
									invokeAction: expect.objectContaining({
										actionSubjectId: 'copyLink',
										actionType: 'CopyLinkAction',
										definitionId: 'bf155190-d90c-449f-9690-d1d1aa9910e6',
										display: undefined,
										extensionKey: 'google-object-provider',
										id: undefined,
										resourceType: 'file',
									}),
								},
								DownloadAction: undefined,
								FollowAction: undefined,
								// TODO: Update to have PreviewAction when Embed Link for Documents is supported
								PreviewAction: undefined,
								AutomationAction: undefined,
								AISummaryAction: undefined,
								ViewRelatedLinksAction: {
									ari: 'ari:cloud:graph::document/my-document',
								},
							},
							linkIcon: {
								label: 'Google Sheets: Public',
								url: 'https://provider-icon.com/drive_icon.png',
							},
							modifiedOn: '2022-06-22T00:44:14.956Z',
							preview: { type: 'image', url: 'https://preview-image-url' },
							linkTitle: expect.objectContaining({ text: 'Google Sheets: Public' }),
							url: 'https://document.com',
							...(fg('platform-linking-visual-refresh-v2') && {
								type: ['Document'],
							}),
							...(fg('cc-ai-linking-platform-snippet-renderer') && {
								meta: {
									objectId: 'google-id',
									resourceType: 'file',
									tenantId: 'google-tenant',
								},
							}),
						}),
					);
				});
			});
		});
	});
});
