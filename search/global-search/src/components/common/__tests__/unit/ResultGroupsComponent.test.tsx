import React from 'react';
import { shallow } from 'enzyme';
import ResultGroupsComponent, {
  Props,
  ResultGroupType,
} from '../../ResultGroupsComponent';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from '../../../../__tests__/unit/_test-util';
import { mountWithIntl } from '../../../../__tests__/unit/helpers/_intl-enzyme-test-helper';
import ResultGroup from '../../../ResultGroup';
import { messages } from '../../../../messages';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    resultsGroups: [],
    type: ResultGroupType.PreQuery,
    renderAdvancedSearch: () => <a>link</a>,
    searchSessionId: '0',
    onShowMoreClicked: () => {},
    onSearchMoreAdvancedSearchClicked: () => {},
    query: '',
    ...partialProps,
  };

  return shallow(<ResultGroupsComponent {...props} />);
}

function renderMount(partialProps: Partial<Props>) {
  const props: Props = {
    resultsGroups: [],
    type: ResultGroupType.PreQuery,
    renderAdvancedSearch: () => <a key="advanced-link">link</a>,
    searchSessionId: '0',
    onShowMoreClicked: () => {},
    onSearchMoreAdvancedSearchClicked: () => {},
    query: '',
    ...partialProps,
  };

  return mountWithIntl(<ResultGroupsComponent {...props} />);
}

it('should render passed objects', () => {
  const resultsGroups = [
    {
      items: [makeConfluenceObjectResult(), makeConfluenceObjectResult()],
      key: 'recentlyViewedPages',
      title: messages.confluence_recent_pages_heading,
      totalSize: 2,
      showTotalSize: false,
    },
    {
      items: [makeConfluenceContainerResult()],
      key: 'recentlyViewedSpaces',
      title: messages.confluence_spaces_heading,
      totalSize: 1,
      showTotalSize: false,
    },
    {
      items: [makePersonResult(), makePersonResult(), makePersonResult()],
      key: 'recentlyInteractedPeople',
      title: messages.people_recent_people_heading,
      totalSize: 3,
      showTotalSize: false,
    },
  ];

  const wrapper = render({
    resultsGroups,
  });

  const groups = wrapper.find(ResultGroup);
  expect(groups.length).toBe(3);
  groups.forEach((group, index) => {
    expect(group.props()).toMatchObject({
      analyticsData: { resultCount: 6 },
      sectionIndex: index,
      results: resultsGroups[index].items,
    });
    expect(group.key()).toBe(`${resultsGroups[index].key}-${index}`);
  });
});

it('should filter out empty groups', () => {
  const resultsGroups = [
    {
      items: [makeConfluenceObjectResult(), makeConfluenceObjectResult()],
      key: 'recentlyViewedPages',
      title: messages.confluence_recent_pages_heading,
      totalSize: 2,
      showTotalSize: false,
    },
    {
      items: [],
      key: 'empty',
      title: messages.confluence_search_placeholder,
      totalSize: 0,
      showTotalSize: false,
    },
    {
      items: [],
      key: 'empty2',
      title: messages.confluence_search_placeholder,
      totalSize: 0,
      showTotalSize: false,
    },
    {
      items: [makePersonResult(), makePersonResult(), makePersonResult()],
      key: 'recentlyInteractedPeople',
      title: messages.people_recent_people_heading,
      totalSize: 3,
      showTotalSize: false,
    },
  ];

  const wrapper = render({
    resultsGroups,
  });

  const groups = wrapper.find(ResultGroup);
  expect(groups.length).toBe(2);
  groups
    .map(group => ({
      key: group.key(),
      sectionIndex: group.props().sectionIndex,
    }))
    .forEach(({ key, sectionIndex }, index) => {
      expect(key).toBe(`${resultsGroups[index * 3].key}-${sectionIndex}`);
      expect(sectionIndex).toBe(index);
    });
});

it('should fire pre query screen event', () => {
  const preQueryScreenCounter = {
    name: 'preQueryScreenCounter',
    increment: jest.fn(),
    getCount: jest.fn(() => 101),
  };

  renderMount({
    resultsGroups: [
      {
        items: [makeConfluenceContainerResult()],
        key: 'recentlyViewedSpaces',
        title: messages.confluence_recent_spaces_heading,
        totalSize: 1,
        showTotalSize: false,
      },
    ],
    screenCounter: preQueryScreenCounter,
    type: ResultGroupType.PreQuery,
  });

  expect(preQueryScreenCounter.increment.mock.calls.length).toBe(1);
  expect(preQueryScreenCounter.getCount.mock.calls.length).toBe(1);
});
