import React from 'react';
import { shallow } from 'enzyme';

import {
  AvailableProductsProvider,
  prefetchAvailableProducts,
} from '../../products-data-provider';

import { AvailableProductsResponse } from '../../../../types';

import { createProvider } from '../../create-data-provider';

describe('products-data-providers', () => {
  test('should render using the default provider', () => {
    const wrapper = shallow(
      <AvailableProductsProvider>{(items) => items}</AvailableProductsProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should render using a custom provider', () => {
    const customProvider = createProvider<AvailableProductsResponse>(
      'my-provider',
      'my-new-endpoint',
    );
    const wrapper = shallow(
      <AvailableProductsProvider availableProductsDataProvider={customProvider}>
        {(items) => items}
      </AvailableProductsProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should prefetch using the custom provider if passed down', () => {
    const fetchMethod = jest.fn();

    prefetchAvailableProducts({
      fetchMethod,
    } as any);

    expect(fetchMethod).toBeCalledTimes(1);
  });
});
