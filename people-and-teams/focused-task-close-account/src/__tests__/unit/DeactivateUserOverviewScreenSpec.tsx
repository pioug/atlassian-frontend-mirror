import React from 'react';
import { shallow } from 'enzyme';
import { DeactivateUserOverviewScreen } from '../../components/DeactivateUserOverviewScreen';
import { catherineHirons } from '../../mocks/users';
import accessibleSites from '../../mocks/accessibleSites';
import { DeactivateUserOverviewScreenProps } from '../../components/DeactivateUserOverviewScreen/types';

const defaultProps: Partial<DeactivateUserOverviewScreenProps> = {
  accessibleSites,
  isCurrentUser: false,
  user: catherineHirons,
};

const render = (props = {}) =>
  shallow(<DeactivateUserOverviewScreen {...defaultProps} {...props} />);

test('DeactivateUserOverviewScreen', () => {
  expect(render()).toMatchSnapshot();
});

describe('accessibleSites display', () => {
  test('text displayed is different when no accessibleSites prop is passed', () => {
    expect(
      render({
        accessibleSites: [],
      }),
    ).toMatchSnapshot();
  });

  test('text displayed is different when no accessibleSites prop is passed for current user', () => {
    expect(
      render({
        accessibleSites: [],
        isCurrentUser: true,
      }),
    ).toMatchSnapshot();
  });
});
