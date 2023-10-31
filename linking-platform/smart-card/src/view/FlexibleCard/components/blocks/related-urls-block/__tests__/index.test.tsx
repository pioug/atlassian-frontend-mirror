import { JsonLd } from 'json-ld-types';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { fireEvent, render } from '@testing-library/react';

import RelatedUrlsBlock from '../';
import {
  AsanaTask,
  AtlasProject,
  JiraIssue,
} from '../../../../../../../examples-helpers/_jsonLDExamples';
import useRelatedUrls, {
  RelatedUrlsResponse,
} from '../../../../../../state/hooks/use-related-urls';

const mockGetRelatedUrlsResponseDefault: RelatedUrlsResponse = {
  resolvedResults: [AsanaTask, AtlasProject, JiraIssue] as JsonLd.Response[],
};

const mockGetRelatedUrls = jest.fn<Promise<RelatedUrlsResponse>, any[]>();

const mockuseRelatedUrls = () => mockGetRelatedUrls;

const injectableUseRelatedUrls = injectable(useRelatedUrls, mockuseRelatedUrls);

describe('RelatedUrlsBlock', () => {
  const rootTestId = 'smart-block-related-urls';
  const resolvedViewTestId = `${rootTestId}-resolved-view`;
  beforeEach(() => {
    mockGetRelatedUrls.mockReturnValue(
      Promise.resolve<RelatedUrlsResponse>(mockGetRelatedUrlsResponseDefault),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderRelatedUrlsBlock = () =>
    render(
      <DiProvider use={[injectableUseRelatedUrls]}>
        <IntlProvider locale="en">
          <RelatedUrlsBlock url="https://this-url-has-related-urls.com" />,
        </IntlProvider>
      </DiProvider>,
    );

  it('renders related urls list section with title', async () => {
    const { findByTestId } = renderRelatedUrlsBlock();
    const relatedUrlsBlock = await findByTestId(`${resolvedViewTestId}-list`);
    expect(relatedUrlsBlock.textContent).toBe('Last mentioned in');
  });

  it('renders related urls section and expands when title clicked', async () => {
    const { findByTestId, findAllByTestId } = renderRelatedUrlsBlock();
    const expandTitle = await findByTestId(
      `${resolvedViewTestId}-list-expand-title`,
    );
    fireEvent.click(expandTitle);
    const urlItems = await findAllByTestId(`${resolvedViewTestId}-list-item`);
    expect(urlItems.length).toBe(3);
  });

  it('renders related url items correctly', async () => {
    const { findByTestId, findAllByTestId } = renderRelatedUrlsBlock();
    const expandTitle = await findByTestId(
      `${resolvedViewTestId}-list-expand-title`,
    );
    fireEvent.click(expandTitle);

    const icons = await findAllByTestId(`${resolvedViewTestId}-list-item-icon`);
    expect(icons.length).toBe(3);
    const links = await findAllByTestId(`${resolvedViewTestId}-list-item-link`);
    expect(links.length).toBe(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('renders url items with correct href value', async () => {
    const resolvedResults = [
      {
        data: {
          url: 'url-1',
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          '@type': 'Document',
          name: 'title 1',
        },
        meta: { access: 'granted', visibility: 'public' },
      },
      {
        data: {
          url: 'url-2',
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          '@type': 'Document',
          name: 'title 2',
        },
        meta: { access: 'granted', visibility: 'public' },
      },
    ];
    mockGetRelatedUrls.mockReturnValueOnce(
      Promise.resolve({
        resolvedResults:
          resolvedResults as RelatedUrlsResponse['resolvedResults'],
      }),
    );
    const { findByTestId, findAllByTestId } = renderRelatedUrlsBlock();
    const expandTitle = await findByTestId(
      `${resolvedViewTestId}-list-expand-title`,
    );
    fireEvent.click(expandTitle);

    const links = await findAllByTestId(`${resolvedViewTestId}-list-item-link`);
    links.forEach((link, idx) => {
      expect(link.getAttribute('href')).toEqual(resolvedResults[idx].data.url);
      expect(link.textContent).toEqual(resolvedResults[idx].data.name);
    });
  });

  it('renders empty message', async () => {
    mockGetRelatedUrls.mockReturnValueOnce(
      Promise.resolve({
        resolvedResults: [],
      }),
    );
    const { findByTestId } = renderRelatedUrlsBlock();
    const resolvedView = await findByTestId(resolvedViewTestId);
    expect(resolvedView.textContent).toBe(
      'This link is not mentioned anywhere else.',
    );
  });
});
