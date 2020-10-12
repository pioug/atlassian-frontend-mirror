import React from 'react';
import { ConfluenceSpaceFilter as SpaceFilter } from '../../SpaceFilter';
import { shallow } from 'enzyme';

const onFilterChanged = jest.fn();
let updateFn: () => any;
let createAnalyticsEvent: () => any;

const render = () => {
  return shallow(
    <SpaceFilter
      spaceTitle="Test space"
      spaceAvatar="test.png"
      spaceKey="TEST"
      searchSessionId="searchSessionId"
      onFilterChanged={onFilterChanged}
      createAnalyticsEvent={createAnalyticsEvent}
    />,
  );
};

describe('ConfluenceSpaceFilter', () => {
  beforeEach(() => {
    updateFn = jest.fn(() => ({
      fire: jest.fn(),
    }));
    createAnalyticsEvent = jest.fn(() => ({
      update: updateFn,
    }));
  });

  it('should render space filter correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });
  it('should call onFilterChanged when clicked', () => {
    const wrapper = render();
    wrapper.find('WithItemFocus(Item)').at(0).simulate('click');
    expect(onFilterChanged).toHaveBeenCalled();
  });

  it('should fire an analytics event when shown', () => {
    render();
    expect(updateFn).toHaveBeenCalledWith({
      action: 'shown',
      actionSubject: 'filter',
      actionSubjectId: 'spaceFilterButton',
      attributes: {
        componentName: 'GlobalQuickSearch',
        packageName: 'global-search',
        packageVersion: '0.0.0',
        searchSessionId: 'searchSessionId',
      },
      eventType: 'ui',
      source: 'globalSearchDrawer',
    });
  });
});
