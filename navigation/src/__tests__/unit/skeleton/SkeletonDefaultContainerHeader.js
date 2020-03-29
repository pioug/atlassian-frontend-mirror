import React from 'react';
import { shallow } from 'enzyme';

import SkeletonDefaultContainerHeader from '../../../components/js/skeleton/SkeletonDefaultContainerHeader';

test('renders a skeleton representation of a container header', () => {
  expect(shallow(<SkeletonDefaultContainerHeader />)).toMatchSnapshot();
});

test('shows a compact version when collapsed', () => {
  expect(
    shallow(<SkeletonDefaultContainerHeader isCollapsed />),
  ).toMatchSnapshot();
});

test('shows a version with hidden avatar', () => {
  expect(
    shallow(<SkeletonDefaultContainerHeader isAvatarHidden />),
  ).toMatchSnapshot();
});
