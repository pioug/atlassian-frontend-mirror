import './GlobalQuickSearchWrapper.test.mock';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ConfluenceQuickSearchContainer from '../../confluence/ConfluenceQuickSearchContainer';
import JiraQuickSearchContainer from '../../jira/JiraQuickSearchContainer';
import { QuickSearchContext } from '../../../api/types';

import GlobalQuickSearch from '../../GlobalQuickSearchWrapper';

describe('GlobalQuickSearchWrapper', () => {
  // Unravels the GlobalQuickSearchWrapper either ConfluenceQuickSearchContainer or JiraQuickSearchContainer
  // can be retrieved via `find()`
  const diveToQuickSearchContainer = (wrapper: ShallowWrapper) => {
    return wrapper.childAt(0).dive().dive();
  };

  it('should render PrefetchedResultsProvider wrapper matching snapshot', () => {
    const wrapper = shallow(
      <GlobalQuickSearch cloudId="123" context="confluence" userId="abc123" />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render AbTestProvider wrapper matching snapshot', () => {
    const wrapper = shallow(
      <GlobalQuickSearch cloudId="123" context="confluence" userId="abc123" />,
    );

    expect(wrapper.childAt(0).dive()).toMatchSnapshot();
  });

  it('should render the confluence container with context confluence', () => {
    const wrapper = shallow(
      <GlobalQuickSearch cloudId="123" context="confluence" userId="abc123" />,
    );

    const featuresProviderWrapper = wrapper.childAt(0).dive().dive();
    expect(
      featuresProviderWrapper.find(ConfluenceQuickSearchContainer).exists(),
    ).toBe(true);
  });

  it('should render the jira container with context jira', () => {
    const wrapper = shallow(
      <GlobalQuickSearch cloudId="123" context="jira" userId="abc123" />,
    );

    const featuresProviderWrapper = wrapper.childAt(0).dive().dive();
    expect(
      featuresProviderWrapper.find(JiraQuickSearchContainer).exists(),
    ).toBe(true);
  });

  it('should pass through the linkComponent prop', () => {
    const MyLinkComponent = () => <div />;

    const wrapper = shallow(
      <GlobalQuickSearch
        cloudId="123"
        context="confluence"
        linkComponent={MyLinkComponent}
        userId="abc123"
      />,
    );

    const confluenceContainer = diveToQuickSearchContainer(wrapper)
      .find(ConfluenceQuickSearchContainer)
      .prop('linkComponent');
    expect(confluenceContainer).toBe(MyLinkComponent);
  });

  describe('onAdvancedSearchCallback', () => {
    [
      {
        product: 'jira',
        Component: JiraQuickSearchContainer,
        category: 'issues',
      },
      {
        product: 'confluence',
        Component: ConfluenceQuickSearchContainer,
        category: 'conent',
      },
    ].forEach(({ product, Component, category }) => {
      it(`should call on advanced callback on ${product} component`, () => {
        const spy = jest.fn();
        const wrapper = shallow(
          <GlobalQuickSearch
            cloudId="123"
            context={product as QuickSearchContext}
            userId="abc123"
            onAdvancedSearch={spy}
          />,
        );

        const container = diveToQuickSearchContainer(wrapper).find(Component);
        const callback = container.prop('onAdvancedSearch');
        expect(callback).toBeInstanceOf(Function);

        const event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
        };

        callback(event, category, 'query', 'sessionId');

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith({
          category,
          query: 'query',
          preventDefault: expect.any(Function),
          originalEvent: event,
          searchSessionId: 'sessionId',
          spaces: [],
        });
      });

      it('should call prevent default and stop propagation', () => {
        const spy = jest.fn((e) => {
          e.preventDefault();
        });
        const wrapper = shallow(
          <GlobalQuickSearch
            cloudId="123"
            context={product as QuickSearchContext}
            userId="abc123"
            onAdvancedSearch={spy}
          />,
        );
        const mockedEvent = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
        };

        const container = diveToQuickSearchContainer(wrapper).find(Component);

        const callback = container.prop('onAdvancedSearch');

        callback(mockedEvent, category, 'query', 'sessionId');

        expect(mockedEvent.preventDefault).toBeCalledTimes(1);
        expect(mockedEvent.stopPropagation).toBeCalledTimes(1);
      });
    });
  });
});
