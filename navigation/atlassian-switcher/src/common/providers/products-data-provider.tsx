import React from 'react';

import { AvailableProductsResponse, ProviderResults } from '../../types';
import { createAvailableProductsProvider } from './default-available-products-provider';
import { ExportedDataProvider, DataProvider } from './create-data-provider';

export type AvailableProductsDataProvider = ExportedDataProvider<
  AvailableProductsResponse
>;
type RealProvider = DataProvider<AvailableProductsResponse>;

const {
  fetchMethod: fetchAvailableProducts,
  ProviderComponent: DefaultDataProviderComponent,
} = createAvailableProductsProvider() as RealProvider;

export const AvailableProductsProvider = ({
  children,
  availableProductsDataProvider,
}: {
  children: (
    availableProducts: ProviderResults['availableProducts'],
  ) => React.ReactNode;
  availableProductsDataProvider?: AvailableProductsDataProvider;
}) => {
  const CustomDataProviderComponent =
    availableProductsDataProvider &&
    availableProductsDataProvider.ProviderComponent;

  const DataProviderComponent =
    CustomDataProviderComponent || DefaultDataProviderComponent;

  return <DataProviderComponent>{children}</DataProviderComponent>;
};

export const prefetchAvailableProducts = (
  customProvider?: AvailableProductsDataProvider,
) => {
  if (customProvider) {
    (customProvider as RealProvider).fetchMethod({});
    return;
  }

  fetchAvailableProducts({});
};

export const resetAvailableProducts = (
  customProvider?: AvailableProductsDataProvider,
) => {
  if (customProvider) {
    (customProvider as RealProvider).fetchMethod.reset();
    return;
  }

  fetchAvailableProducts.reset();
};
