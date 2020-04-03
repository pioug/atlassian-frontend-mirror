import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerItemText from '../../../components/js/skeleton/styled/SkeletonContainerItemText';

test('renders an item text skeleton', () => {
  expect(shallow(<SkeletonContainerItemText />)).toMatchSnapshot();
});

test('renders an item text skeleton with custom width', () => {
  expect(
    shallow(<SkeletonContainerItemText textWidth="100%" />),
  ).toMatchSnapshot();
});
