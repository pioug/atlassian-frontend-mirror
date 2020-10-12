import React from 'react';

import { shallow } from 'enzyme';
import { ResultGroup, Props } from '../../ResultGroup';
import { makeConfluenceObjectResult } from '../../../__tests__/unit/_test-util';
import ResultList from '../../ResultList';
import { ResultItemGroup } from '@atlaskit/quick-search';

const mockedIntl: ReactIntl.InjectedIntl = {} as ReactIntl.InjectedIntl;

function render(partialProps: Partial<Props>) {
  const props: Props = {
    title: 'some title',
    results: [],
    sectionIndex: 0,
    totalSize: 0,
    showTotalSize: false,
    showMoreButton: false,
    onSearchMoreAdvancedSearch: undefined,
    onShowMoreClicked: () => {},
    query: '',
    ...partialProps,
  };

  return shallow(<ResultGroup {...props} intl={mockedIntl} />);
}

describe('<ResultGroup />', () => {
  it('should render nothing when there are no results', () => {
    const wrapper = render({ results: [] });

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should render a result list when there are results', () => {
    const wrapper = render({ results: [makeConfluenceObjectResult()] });

    expect(wrapper.find(ResultList).exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a result list even with no titles', () => {
    const wrapper = render({
      results: [makeConfluenceObjectResult()],
      title: '',
    });

    expect(wrapper.find(ResultItemGroup)).toHaveLength(0);
    expect(wrapper.find(ResultList).exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render total if showTotalSize is true but there is no title', () => {
    const wrapper = render({
      results: [makeConfluenceObjectResult()],
      showTotalSize: true,
      totalSize: 9999,
      title: '',
    });

    expect(wrapper.find(ResultItemGroup)).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render total if showTotalSize is false and there is a title', () => {
    const wrapper = render({
      results: [makeConfluenceObjectResult()],
      showTotalSize: false,
      totalSize: 9999,
      title: 'Some title',
    });

    const title = wrapper.find(ResultItemGroup).prop('title');
    expect(title).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render total if showTotalSize is true and there is a title', () => {
    const wrapper = render({
      results: [makeConfluenceObjectResult()],
      showTotalSize: true,
      totalSize: 9999,
      title: 'Some title',
    });

    const title = wrapper.find(ResultItemGroup).prop('title');
    expect(title).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
