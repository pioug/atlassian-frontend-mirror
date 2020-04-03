import React from 'react';
import { shallow } from 'enzyme';

import SkeletonDefaultContainerHeaderInner from '../../../components/js/skeleton/styled/SkeletonDefaultContainerHeaderInner';

test('renders a header skeleton container', () => {
  expect(shallow(<SkeletonDefaultContainerHeaderInner />)).toMatchSnapshot();
});

test('renders a header skeleton container differently when avatar is hidden', () => {
  expect(
    shallow(<SkeletonDefaultContainerHeaderInner isAvatarHidden />),
  ).toMatchSnapshot();
});
