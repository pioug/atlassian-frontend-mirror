import React from 'react';
import { shallow } from 'enzyme';

import {
  JoinableSitesProvider,
  prefetchJoinableSites,
} from '../../joinable-sites-data-provider';

import { JoinableSitesResponse } from '../../../../types';

import { createProviderWithCustomFetchData } from '../../../../common/providers/create-data-provider';

describe('joinable-sites-data-providers', () => {
  test('should render using the default provider', () => {
    const wrapper = shallow(
      <JoinableSitesProvider>{(items) => items}</JoinableSitesProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should render using a custom provider', () => {
    const fetchData = () => Promise.resolve({ sites: [] });
    const customProvider = createProviderWithCustomFetchData<
      JoinableSitesResponse
    >('my-joinble-sites-provider', fetchData);
    const wrapper = shallow(
      <JoinableSitesProvider joinableSitesDataProvider={customProvider}>
        {(items) => items}
      </JoinableSitesProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should prefetch using the custom provider if passed down', () => {
    const fetchMethod = jest.fn();

    prefetchJoinableSites({
      fetchMethod,
    } as any);

    expect(fetchMethod).toBeCalledTimes(1);
  });
});
