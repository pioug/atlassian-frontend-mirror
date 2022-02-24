import { JsonLd } from 'json-ld-types';

import extractFlexibleUiContext from '../index';

import ConfluenceBlog from './__fixtures__/confluence-blog';
import ConfluencePage from './__fixtures__/confluence-page';
import ConfluenceSpace from './__fixtures__/confluence-space';
import ConfluenceTemplate from './__fixtures__/confluence-template';
import Figma from './__fixtures__/figma';
import JiraRoadMap from './__fixtures__/jira-roadmap';
import JiraTask from './__fixtures__/jira-task';
import YouTubeVideo from './__fixtures__/youtube-video';

describe('extractFlexibleUiContext', () => {
  const expectedConfluenceProvider = {
    icon: 'Provider:Confluence',
    label: 'Confluence',
  };

  const expectedJiraProvider = {
    icon: 'Provider:Jira',
    label: 'Jira',
  };

  it('returns flexible ui context for confluence page', () => {
    const data = extractFlexibleUiContext(ConfluencePage as JsonLd.Response);

    expect(data).toEqual({
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
    });
  });

  it('returns flexible ui context for confluence blog', () => {
    const data = extractFlexibleUiContext(ConfluenceBlog as JsonLd.Response);

    expect(data).toEqual({
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
    });
  });

  it('returns flexible ui context confluence space', () => {
    const data = extractFlexibleUiContext(ConfluenceSpace as JsonLd.Response);

    expect(data).toEqual({
      linkIcon: { label: 'ShipIt', url: 'https://icon-url' },
      title: 'ShipIt',
      url: 'https://confluence-url/wiki/spaces/space-id',
      provider: expectedConfluenceProvider,
    });
  });

  it('returns flexible ui context for confluence template', () => {
    const data = extractFlexibleUiContext(
      ConfluenceTemplate as JsonLd.Response,
    );

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
    const data = extractFlexibleUiContext(JiraTask as JsonLd.Response);

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
    const data = extractFlexibleUiContext(JiraRoadMap as JsonLd.Response);

    expect(data).toEqual({
      linkIcon: { label: 'Linking Platform', url: 'https://icon-url' },
      title: 'Linking Platform',
      url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
      provider: expectedJiraProvider,
    });
  });

  it('returns flexible ui context for figma', () => {
    const data = extractFlexibleUiContext(Figma as JsonLd.Response);

    expect(data).toEqual({
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
    const data = extractFlexibleUiContext(YouTubeVideo as JsonLd.Response);

    expect(data).toEqual({
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
    const data = extractFlexibleUiContext(response);

    expect(data?.title).toEqual(url);
  });
});
