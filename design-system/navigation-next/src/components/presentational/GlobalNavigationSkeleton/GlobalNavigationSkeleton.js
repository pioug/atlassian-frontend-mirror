import React from 'react';

import GlobalNavigationSkeletonItem from './GlobalNavigationSkeletonItem';
import {
  Container,
  FirstPrimaryItemWrapper,
  PrimaryItemsList,
  SecondaryItemsList,
} from './primitives';

const GlobalNavigationSkeleton = (props) => {
  const { dataset, theme, ...rest } = props;

  const wrapperStyles = theme.mode.globalNav();

  return (
    <Container styles={wrapperStyles} {...dataset} {...rest}>
      <PrimaryItemsList>
        <FirstPrimaryItemWrapper>
          <GlobalNavigationSkeletonItem />
        </FirstPrimaryItemWrapper>
        <GlobalNavigationSkeletonItem />
        <GlobalNavigationSkeletonItem />
        <GlobalNavigationSkeletonItem />
      </PrimaryItemsList>
      <SecondaryItemsList>
        <GlobalNavigationSkeletonItem />
        <GlobalNavigationSkeletonItem />
        <GlobalNavigationSkeletonItem />
        <GlobalNavigationSkeletonItem />
      </SecondaryItemsList>
    </Container>
  );
};

GlobalNavigationSkeleton.defaultProps = {
  dataset: {
    'data-testid': 'GlobalNavigationSkeleton',
  },
};

export default GlobalNavigationSkeleton;
