import React from 'react';
import { prefetchAll } from './common/providers/instance-data-providers';
import {
  prefetchAvailableProducts,
  AvailableProductsDataProvider,
} from './common/providers/products-data-provider';
import {
  prefetchJoinableSites,
  JoinableSitesDataProvider,
} from './cross-join/providers/joinable-sites-data-provider';
import prefetchSwitcherBundles from './common/utils/prefetch-bundles';
import { FeatureFlagProps } from './types';

type PrefetchTriggerProps = {
  cloudId?: string;
  product?: string;
  Container?: React.ReactType;
  availableProductsDataProvider?: AvailableProductsDataProvider;
  joinableSitesDataProvider?: JoinableSitesDataProvider;
} & Partial<FeatureFlagProps>;

export const prefetch = (props: PrefetchTriggerProps) => {
  const { cloudId, product } = props;

  prefetchSwitcherBundles(product);
  prefetchAvailableProducts(props.availableProductsDataProvider);
  prefetchJoinableSites(props.joinableSitesDataProvider);

  if (cloudId) {
    prefetchAll({ cloudId });
  }
};
