import { JsonLd } from 'json-ld-types';

import AtlasProject from '../../../__fixtures__/atlas-project';
import BitbucketPullRequest from '../../../__fixtures__/bitbucket-pull-request';
import ConfluenceBlog from '../../../__fixtures__/confluence-blog';
import ConfluencePage from '../../../__fixtures__/confluence-page';
import ConfluenceSpace from '../../../__fixtures__/confluence-space';
import ConfluenceTemplate from '../../../__fixtures__/confluence-template';
import Figma from '../../../__fixtures__/figma';
import JiraRoadMap from '../../../__fixtures__/jira-roadmap';
import JiraTask from '../../../__fixtures__/jira-task';
import JiraTimeline from '../../../__fixtures__/jira-timeline';
import YouTubeVideo from '../../../__fixtures__/youtube-video';
import DropboxFile from '../../../__fixtures__/dropbox-file';
import extractFlexibleUiContext from '../index';

describe('extractFlexibleUiContext', () => {
  const expectedConfluenceProvider = {
    icon: 'Provider:Confluence',
    label: 'Confluence',
  };

  const expectedJiraProvider = {
    icon: 'Provider:Jira',
    label: 'Jira',
  };

  it('returns flexible ui context for bitbucket pull request', () => {
    const data = extractFlexibleUiContext({
      response: BitbucketPullRequest as JsonLd.Response,
    });

    expect(data).toEqual({
      authorGroup: [{ name: 'Angie Mccarthy', src: 'https://person-url' }],
      collaboratorGroup: [
        { name: 'Angie Mccarthy', src: 'https://person-url' },
      ],
      createdBy: 'Angie Mccarthy',
      createdOn: '2022-07-04T12:04:10.182Z',
      linkIcon: {
        icon: 'BitBucket:PullRequest',
        label:
          'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
      },
      modifiedBy: 'Angie Mccarthy',
      modifiedOn: '2022-07-04T12:05:28.601Z',
      provider: { label: 'Bitbucket', url: 'https://icon-url' },
      sourceBranch: 'source-branch',
      state: { appearance: 'inprogress', text: 'open' },
      targetBranch: 'target-branch',
      title:
        'bitbucket-object-provider: #61 EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
      url: 'https://link-url',
    });
  });

  it('returns flexible ui context for confluence page', () => {
    const data = extractFlexibleUiContext({
      response: ConfluencePage as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          linkIcon: {
            icon: 'FileType:Document',
            label: 'Everything you need to know about ShipIt53!',
          },
          isSupportTheming: true,
          providerName: 'Confluence',
          src: 'https://preview-url',
          title: 'Everything you need to know about ShipIt53!',
          url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
        },
      },
      linkIcon: {
        icon: 'FileType:Document',
        label: 'Everything you need to know about ShipIt53!',
      },
      title: 'Everything you need to know about ShipIt53!',
      snippet: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
      url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
      commentCount: 24,
      subscriberCount: 21,
      provider: expectedConfluenceProvider,
      ownedBy: 'Angie Mccarthy',
      ownedByGroup: [
        {
          name: 'Angie Mccarthy',
          src: 'https://person-url',
        },
      ],
    });
  });

  it('returns flexible ui context for confluence blog', () => {
    const data = extractFlexibleUiContext({
      response: ConfluenceBlog as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          linkIcon: {
            icon: 'FileType:Blog',
            label:
              'Announcing the winners of the Customer Fun Award for ShipIt 53',
          },
          providerName: 'Confluence',
          isSupportTheming: true,
          src: 'https://preview-url',
          title:
            'Announcing the winners of the Customer Fun Award for ShipIt 53',
          url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
        },
      },
      linkIcon: {
        icon: 'FileType:Blog',
        label: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
      },
      snippet:
        'A few weeks ago, we announced a brand new award for ShipIt - the Customer Fun Award. The goal was to generate ideas to create fun experiences in our new product, Canvas.',
      title: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
      url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
      commentCount: 7,
      subscriberCount: 17,
      provider: expectedConfluenceProvider,
      ownedBy: 'Angie Mccarthy',
      ownedByGroup: [
        {
          name: 'Angie Mccarthy',
          src: 'https://person-url',
        },
      ],
    });
  });

  it('returns flexible ui context confluence space', () => {
    const data = extractFlexibleUiContext({
      response: ConfluenceSpace as JsonLd.Response,
    });

    expect(data).toEqual({
      linkIcon: { label: 'ShipIt', url: 'https://icon-url' },
      title: 'ShipIt',
      url: 'https://confluence-url/wiki/spaces/space-id',
      provider: expectedConfluenceProvider,
    });
  });

  it('returns flexible ui context for confluence template', () => {
    const data = extractFlexibleUiContext({
      response: ConfluenceTemplate as JsonLd.Response,
    });

    expect(data).toEqual({
      linkIcon: {
        icon: 'FileType:Template',
        label: 'templateName_4815162342',
      },
      snippet: 'Description for templateName_4815162342',
      title: 'templateName_4815162342',
      url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
      provider: expectedConfluenceProvider,
    });
  });

  it('returns flexible ui context for jira task', () => {
    const data = extractFlexibleUiContext({
      response: JiraTask as JsonLd.Response,
      actionOptions: { hide: true },
    });

    expect(data).toEqual({
      authorGroup: [
        {
          name: 'Fluffy Fluffington',
        },
      ],
      commentCount: 1,
      createdBy: 'Fluffy Fluffington',
      createdOn: '2021-10-19T11:35:10.027+1100',
      linkIcon: { url: 'https://icon-url' },
      modifiedOn: '2021-12-16T10:47:20.054+1100',
      priority: {
        label: 'Major',
        url: 'https://priority-icon-url',
      },
      state: { appearance: 'success', text: '(Awaiting) Deployment' },
      subscriberCount: 2,
      title: 'Flexible UI Task',
      url: 'https://jira-url/browse/id',
      provider: expectedJiraProvider,
    });
  });

  it('returns flexible ui context for jira roadmap', () => {
    const data = extractFlexibleUiContext({
      response: JiraRoadMap as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          download: undefined,
          linkIcon: {
            label: 'Linking Platform',
            url: 'https://icon-url',
          },
          providerName: 'Jira',
          isSupportTheming: true,
          src: 'https://preview-url',
          title: 'Linking Platform',
          url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
        },
      },
      linkIcon: { label: 'Linking Platform', url: 'https://icon-url' },
      title: 'Linking Platform',
      url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
      provider: expectedJiraProvider,
    });
  });

  it('returns flexible ui context for jira timeline', () => {
    const data = extractFlexibleUiContext({
      response: JiraTimeline as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          download: undefined,
          linkIcon: {
            label: 'Linking Platform',
            url: 'https://icon-url',
          },
          providerName: 'Jira',
          isSupportTheming: true,
          src: 'https://preview-url',
          title: 'Linking Platform',
          url: 'https://jira-url/projects/project-id/boards/board-id/timeline',
        },
      },
      linkIcon: { label: 'Linking Platform', url: 'https://icon-url' },
      title: 'Linking Platform',
      url: 'https://jira-url/projects/project-id/boards/board-id/timeline',
      provider: expectedJiraProvider,
    });
  });

  it('returns flexible ui context for atlas project', () => {
    const data = extractFlexibleUiContext({
      response: AtlasProject as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          isSupportTheming: true,
          linkIcon: {
            label: 'The Superman Project',
            url: 'https://icon-url',
          },
          providerName: 'Atlas',
          src: 'https://preview-url',
          title: 'The Superman Project',
          url: 'https://link-url',
        },
        FollowAction: {
          action: {
            action: {
              actionType: 'FollowEntityAction',
              resourceIdentifiers: {
                ari: 'some-id',
              },
            },
            providerKey: 'watermelon-object-provider',
            reload: {
              url: 'https://link-url',
            },
          },
          value: true,
        },
      },
      authorGroup: [
        {
          name: 'Lois Lane',
          src: 'https://person-url',
        },
      ],
      commentCount: 1,
      createdBy: 'Lois Lane',
      dueOn: '2030-12-31',
      linkIcon: {
        label: 'The Superman Project',
        url: 'https://icon-url',
      },
      modifiedOn: '2023-03-05T08:00:00.861423',
      provider: {
        label: 'Atlas',
        url: 'https://icon-url',
      },
      snippet: 'The journey to discover the real identity of Superman?',
      state: {
        appearance: 'success',
        text: 'On track',
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
        PreviewAction: {
          linkIcon: {
            label: 'Figma',
            url: 'https://icon-url',
          },
          isSupportTheming: false,
          providerName: 'Figma',
          src: 'https://preview-url',
          title: 'Flexible Links',
          url: 'https://figma-url/Flexible-Links?node-id=node-id',
        },
      },
      linkIcon: {
        label: 'Figma',
        url: 'https://icon-url',
      },
      modifiedOn: '2021-12-14T05:07:13Z',
      preview: {
        type: 'image',
        url: 'https://image-url',
      },
      title: 'Flexible Links',
      url: 'https://figma-url/Flexible-Links?node-id=node-id',
      provider: {
        url: 'https://icon-url',
        label: 'Figma',
      },
    });
  });

  it('returns flexible ui context for youtube video', () => {
    const data = extractFlexibleUiContext({
      response: YouTubeVideo as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        PreviewAction: {
          linkIcon: {
            label: 'YouTube',
            url: 'https://icon-url',
          },
          isSupportTheming: false,
          providerName: 'YouTube',
          src: 'https://preview-url',
          title: 'The Atlassian Business Model',
          url: 'https://youtube-url/watch?v=video-id',
        },
      },
      linkIcon: {
        label: 'YouTube',
        url: 'https://icon-url',
      },
      modifiedOn: '2015-12-10T14:30:00.000Z',
      preview: {
        type: 'image',
        url: 'https://image-url',
      },
      snippet:
        "Atlassian's product strategy, distribution model, and company culture work in concert to create unique value for its customers and a competitive advantage for the company.",
      title: 'The Atlassian Business Model',
      url: 'https://youtube-url/watch?v=video-id',
      provider: {
        url: 'https://icon-url',
        label: 'YouTube',
      },
    });
  });

  it('returns flexible ui context for dropbox file', () => {
    const data = extractFlexibleUiContext({
      response: DropboxFile as JsonLd.Response,
    });

    expect(data).toEqual({
      actions: {
        DownloadAction: {
          downloadUrl: 'https://download-url',
        },
        PreviewAction: {
          downloadUrl: 'https://download-url',
          linkIcon: {
            label: 'Dropbox',
            render: undefined,
            url: 'https://icon-url',
          },
          isSupportTheming: false,
          providerName: 'Dropbox',
          src: 'https://preview-url',
          title: 'Happy Guy.gif',
          url: 'https://link-url',
        },
      },
      linkIcon: {
        label: 'Dropbox',
        render: undefined,
        url: 'https://icon-url',
      },
      modifiedOn: '2022-06-30T00:06:16Z',
      preview: {
        type: 'image',
        url: 'https://image-url',
      },
      snippet: undefined,
      title: 'Happy Guy.gif',
      url: 'https://link-url',
      provider: {
        url: 'https://icon-url',
        label: 'Dropbox',
      },
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
});
