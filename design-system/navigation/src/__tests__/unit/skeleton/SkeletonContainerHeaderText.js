import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerHeaderText from '../../../components/js/skeleton/styled/SkeletonContainerHeaderText';

test('renders a header text skeleton', () => {
  expect(shallow(<SkeletonContainerHeaderText />)).toMatchSnapshot();
});

test('renders a header text skeleton differently when avatar is hidden', () => {
  expect(
    shallow(<SkeletonContainerHeaderText isAvatarHidden />),
  ).toMatchSnapshot();
});
