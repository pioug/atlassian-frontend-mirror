import React from 'react';

import { AtlassianNavigation } from '../src';
import { SkeletonPrimaryButton } from '../src/skeleton';
import { SkeletonSwitcherButton } from '../src/skeleton-switcher-button';

const skeletonPrimaryItems = [
  <SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
  <SkeletonPrimaryButton isDropdownButton text="Projects" />,
  <SkeletonPrimaryButton
    isDropdownButton
    isHighlighted
    text="Filters &amp; issues"
  />,
  <SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
  <SkeletonPrimaryButton isDropdownButton text="Apps" />,
];

const AtlassianNavigationExample = () => (
  <AtlassianNavigation
    renderProductHome={() => null}
    label="site"
    moreLabel="More"
    primaryItems={skeletonPrimaryItems}
    renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
  />
);

export default AtlassianNavigationExample;
