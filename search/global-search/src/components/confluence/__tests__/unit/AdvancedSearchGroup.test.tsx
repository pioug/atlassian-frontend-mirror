import React from 'react';
import { shallow } from 'enzyme';
import { ResultData } from '@atlaskit/quick-search';
import AdvancedSearchGroup, { Props } from '../../AdvancedSearchGroup';
import SearchConfluenceItem from '../../../SearchConfluenceItem';
import SearchPeopleItem from '../../../SearchPeopleItem';
import { FormattedMessage } from 'react-intl';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    ...partialProps,
  };

  return shallow(<AdvancedSearchGroup {...props} />);
}

it('should render advanced search text when no query is entered', () => {
  const wrapper = render({ query: '' });
  expect(wrapper.find(SearchConfluenceItem).prop('text')).toMatchObject({
    type: FormattedMessage,
    props: {
      id: 'global_search.confluence.advanced_search',
    },
  });
});

it('should render advanced search text when a query is entered', () => {
  const wrapper = render({ query: 'foo foo' });
  expect(wrapper.find(SearchConfluenceItem).prop('text')).toMatchObject({
    type: FormattedMessage,
    props: {
      id: 'global_search.confluence.advanced_search_for',
      values: { query: 'foo foo' },
    },
  });
});

[
  { entity: 'content', Component: SearchConfluenceItem },
  { entity: 'people', Component: SearchPeopleItem },
].forEach(({ entity, Component }) => {
  it('should trigger on click', () => {
    const spy = jest.fn();
    const wrapper = render({ query: 'foo foo', onClick: spy });
    const callback = wrapper.find(Component).prop('onClick');
    const mockedEvent = { preventDefault() {} };
    const mockedResultData = {
      event: mockedEvent,
      resultId: 'id',
    };
    if (callback) {
      callback(mockedResultData as ResultData);
    }

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(mockedEvent, entity);
  });
});
