import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerNavigation from '../../../components/js/skeleton/SkeletonContainerNavigation';

import { WithRootTheme } from '../../../theme/util';
import * as presets from '../../../theme/presets';

const DummyContainerHeader = () => <div />;

test('wraps the content inside a <WithRootTheme />', () => {
  const rootThemeHoc = shallow(
    <SkeletonContainerNavigation
      theme={presets.container}
      containerHeaderComponent={DummyContainerHeader}
    />,
  ).first();

  expect(rootThemeHoc.type()).toBe(WithRootTheme);
  expect(rootThemeHoc.prop('provided')).toEqual(presets.container);
});

test('renders a skeleton representation of the container sidebar', () => {
  const containerNavigationStructure = shallow(
    <SkeletonContainerNavigation
      theme={presets.container}
      containerHeaderComponent={DummyContainerHeader}
    />,
  )
    .first()
    .children();

  expect(containerNavigationStructure).toMatchSnapshot();
});

test('shows the global sidebar items when collapsed', () => {
  const containerNavigationStructure = shallow(
    <SkeletonContainerNavigation
      theme={presets.container}
      containerHeaderComponent={DummyContainerHeader}
      isCollapsed
    />,
  )
    .first()
    .children();

  expect(containerNavigationStructure).toMatchSnapshot();
});
