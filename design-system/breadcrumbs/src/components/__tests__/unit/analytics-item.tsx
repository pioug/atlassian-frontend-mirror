import React from 'react';
import { mount } from 'enzyme';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
// Because we are mocking the hocs, the default import from this file is null
// thats why we need to import the version without analytics to test the analytics
// context is overridden
import { BreadcrumbsItemWithoutAnalytics as BreadcrumbsItem } from '../../BreadcrumbsItem';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('BreadcrumbsItem', () => {
  it('should override the existing analytics context of Button', () => {
    const wrapper = mount(<BreadcrumbsItem href="/hello" text="Hello" />);

    expect(wrapper.find(Button).prop('analyticsContext')).toEqual({
      componentName: 'breadcrumbsItem',
      packageName,
      packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenCalledWith({
      onClick: {
        action: 'clicked',
        actionSubject: 'breadcrumbsItem',
        attributes: {
          componentName: 'breadcrumbsItem',
          packageName,
          packageVersion,
        },
      },
    });
  });
});
