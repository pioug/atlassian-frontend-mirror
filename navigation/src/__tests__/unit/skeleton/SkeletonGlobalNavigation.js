import React from 'react';
import { shallow } from 'enzyme';

import SkeletonGlobalNavigation from '../../../components/js/skeleton/SkeletonGlobalNavigation';

import { WithRootTheme } from '../../../theme/util';
import * as presets from '../../../theme/presets';

test('wraps the content inside a <WithRootTheme />', () => {
  const rootThemeHoc = shallow(
    <SkeletonGlobalNavigation theme={presets.container} />,
  ).first();

  expect(rootThemeHoc.type()).toBe(WithRootTheme);
  expect(rootThemeHoc.prop('provided')).toEqual(presets.container);
});

test('renders a skeleton representation of the global sidebar', () => {
  const globalNavigationStructure = shallow(
    <SkeletonGlobalNavigation theme={presets.container} />,
  )
    .first()
    .children();

  expect(globalNavigationStructure).toMatchSnapshot();
});
