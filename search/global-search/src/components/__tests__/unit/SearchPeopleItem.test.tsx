import React from 'react';
import { shallow } from 'enzyme';
import { CancelableEvent } from '@atlaskit/quick-search';
import SearchPeopleItem, { Props } from '../../SearchPeopleItem';
import AdvancedSearchResult from '../../AdvancedSearchResult';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: 'query',
    icon: <div />,
    text: 'text',
    ...partialProps,
  };

  return shallow(<SearchPeopleItem {...props} />);
}

it('should render the text', () => {
  const wrapper = render({ text: 'cucumber' });
  expect(wrapper.prop('text')).toEqual('cucumber');
});

it('should render the icon', () => {
  const wrapper = render({ icon: <span /> });
  expect(wrapper.prop('icon')).toEqual(<span />);
});

it('should append the url encoded query', () => {
  const wrapper = render({ query: 'test query' });
  expect(wrapper.prop('href')).toEqual('/people/search?q=test%20query');
});

it('should call onClick', () => {
  const spy = jest.fn();
  const wrapper = render({ query: 'test query', onClick: spy });
  const advnacedComponent = wrapper.find(AdvancedSearchResult);
  expect(advnacedComponent.exists()).toBe(true);
  const onClick = advnacedComponent.prop('onClick');
  const resultData = {
    resultId: 'resultId',
    event: { preventDefault() {} } as CancelableEvent,
    type: 'people',
  };
  if (onClick) {
    onClick(resultData);
  }
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(resultData);
});
