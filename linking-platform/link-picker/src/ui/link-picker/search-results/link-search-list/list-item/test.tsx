import React from 'react';

import { screen } from '@testing-library/dom';
import MockDate from 'mockdate';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';

import { LinkSearchListItem } from './index';

describe('<LinkSearchListItem />', () => {
  beforeEach(() => {
    MockDate.set('2020-01-01T01:00+0000');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    MockDate.reset();
  });

  const defaultProps = {
    selected: false,
    active: false,
    onFocus: jest.fn(),
    onKeyDown: jest.fn(),
    onSelect: jest.fn(),
  };

  const defaultItem = {
    objectId: 'xyz',
    name: 'Atlassian Home Page',
    url: 'https://atlassian.com',
    iconAlt: 'Confluence Page',
    icon: 'https://home-static.us-east-1.staging.public.atl-paas.net/confluence-page-icon.svg',
    container: 'Jira',
    lastViewedDate: new Date('2019-12-27T01:00+0000'),
    lastUpdatedDate: new Date('2019-12-20T01:00+0000'),
  };

  it('should handle all data (`container`, `lastViewedDate`, `lastUpdatedDate`) being present', async () => {
    render(<LinkSearchListItem {...defaultProps} item={defaultItem} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed 5 days ago$/);
  });

  it('should render absolute `lastViewedDate` if is more than 7 days ago', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2018-12-01T01:00+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(
      /^Jira\s\s\•\s\sViewed December 1, 2018$/,
    );
  });

  it('should render relative `lastViewedDate` in seconds ago', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2020-01-01T00:59:46+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(
      /^Jira\s\s\•\s\sViewed 14 seconds ago$/,
    );
  });

  it('should render relative `lastViewedDate` 1 minute ago', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2020-01-01T00:59+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed 1 minute ago$/);
  });

  it('should render relative `lastViewedDate` in minutes under 59 minutes', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2020-01-01T00:45+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(
      /^Jira\s\s\•\s\sViewed 15 minutes ago$/,
    );
  });

  it('should render relative `lastViewedDate` in hours under 24', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2019-12-31T20:00+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed 5 hours ago$/);
  });

  it('should render relative `lastViewedDate` as yesterday with timestamp if 1 day ago', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2019-12-31T01:00+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed yesterday$/);
  });

  it('should render relative `lastViewedDate` as days if under a week', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2019-12-27T01:00+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed 5 days ago$/);
  });

  it('should render relative `lastViewedDate` as last week if exactly a week', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: new Date('2019-12-25T01:00+0000'),
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sViewed 1 week ago$/);
  });

  it('should fallback to use `lastUpdatedDate` if present and `lastViewedDate` is missing', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: undefined,
      lastUpdatedDate: new Date('2019-12-26T01:00+0000'),
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toMatch(/^Jira\s\s\•\s\sUpdated 6 days ago$/);
  });

  it('should handle missing `container`', async () => {
    const item = {
      ...defaultItem,
      container: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toStrictEqual('Viewed 5 days ago');
  });

  it('should handle missing `lastViewedDate` and missing `lastUpdatedDate`', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: undefined,
      lastUpdatedDate: undefined,
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const subtitle = await screen.findByTestId(
      'link-search-list-item-subtitle',
    );

    expect(subtitle.textContent).toStrictEqual('Jira');
  });

  it('should handle svg icons', async () => {
    const item = {
      ...defaultItem,
      lastViewedDate: undefined,
      lastUpdatedDate: undefined,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-issue-opened" aria-hidden="true"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path></svg>',
    };

    render(<LinkSearchListItem {...defaultProps} item={item} />);

    const icon = await screen.findByTestId('link-search-list-item-icon');

    expect(icon.tagName).toBe('IMG');
    expect(icon.getAttribute('src')).toBe(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGNsYXNzPSJvY3RpY29uIG9jdGljb24taXNzdWUtb3BlbmVkIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggZD0iTTggOS41YTEuNSAxLjUgMCAxMDAtMyAxLjUgMS41IDAgMDAwIDN6Ij48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOCAwYTggOCAwIDEwMCAxNkE4IDggMCAwMDggMHpNMS41IDhhNi41IDYuNSAwIDExMTMgMCA2LjUgNi41IDAgMDEtMTMgMHoiPjwvcGF0aD48L3N2Zz4=',
    );
  });

  it('should render results with a `title` attribute equal to the `name` property', () => {
    const item = {
      ...defaultItem,
      name: 'Some Atlassian Page',
    };
    render(<LinkSearchListItem {...defaultProps} item={item} />);
    expect(screen.getByTitle('Some Atlassian Page')).toBeDefined();
  });
});
