import React from 'react';
import { shallow } from 'enzyme';
import JiraAdvancedSearch, { Props } from '../../JiraAdvancedSearch';
import * as Utils from '../../../SearchResultsUtil';
import Button from '@atlaskit/button/custom-theme-button';
import { JiraEntityTypes } from '../../../SearchResultsUtil';

const defaultProps: Props = {
  query: 'query',
};

const renderComponent = (overriddenProps?: Partial<Props>) => {
  const props = { ...defaultProps, ...overriddenProps };
  return shallow(<JiraAdvancedSearch {...props} />);
};

describe('JiraAdvancedSearch', () => {
  let getJiraAdvancedSearchUrlMock: jest.SpyInstance<string>;
  beforeEach(() => {
    getJiraAdvancedSearchUrlMock = jest.spyOn(
      Utils,
      'getJiraAdvancedSearchUrl',
    );
    getJiraAdvancedSearchUrlMock.mockImplementation(({ entityType: x }) => x);
  });

  afterEach(() => {
    getJiraAdvancedSearchUrlMock.mockReset();
  });

  it('should render buttons with possible choices', () => {
    const wrapper = renderComponent();
    const advancedSearchLinks = wrapper.find(Button);
    expect(advancedSearchLinks.length).toBe(5);
    expect(advancedSearchLinks.map((link) => link.props().href)).toMatchObject([
      JiraEntityTypes.Issues,
      JiraEntityTypes.Boards,
      JiraEntityTypes.Projects,
      JiraEntityTypes.Filters,
      JiraEntityTypes.People,
    ]);
  });

  it('should filter out boards without software permission', () => {
    const wrapper = renderComponent({
      appPermission: {
        hasSoftwareAccess: false,
        hasCoreAccess: true,
        hasOpsAccess: true,
        hasServiceDeskAccess: true,
      },
    });

    const advancedSearchLinks = wrapper.find(Button);
    expect(advancedSearchLinks.length).toBe(4);
    expect(advancedSearchLinks.map((link) => link.props().href)).toMatchObject([
      JiraEntityTypes.Issues,
      JiraEntityTypes.Projects,
      JiraEntityTypes.Filters,
      JiraEntityTypes.People,
    ]);
  });

  it('should call onclick when any advanced link clicked', () => {
    const spy = jest.fn();
    const wrapper = renderComponent({
      onClick: spy,
    });
    const advancedSearchLinks = wrapper.find(Button);
    expect(advancedSearchLinks.length).toBe(5);

    advancedSearchLinks.first().simulate('click');
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][1]).toBe('issues');
  });
});
