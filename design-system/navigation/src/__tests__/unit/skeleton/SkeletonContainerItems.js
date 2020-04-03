import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerItems from '../../../components/js/skeleton/SkeletonContainerItems';

test('renders a skeleton representation of a container item', () => {
  expect(shallow(<SkeletonContainerItems />)).toMatchSnapshot();
});

test('collapses its children container items', () => {
  expect(shallow(<SkeletonContainerItems isCollapsed />)).toMatchSnapshot();
});

test('passes down custom styles', () => {
  expect(
    shallow(<SkeletonContainerItems itemTextWidth="100%" />),
  ).toMatchSnapshot();
});
