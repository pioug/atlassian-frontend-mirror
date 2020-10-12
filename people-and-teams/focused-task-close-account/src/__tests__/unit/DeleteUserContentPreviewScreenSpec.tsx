import React from 'react';
import { shallow } from 'enzyme';
import { DeleteUserContentPreviewScreen } from '../../components/DeleteUserContentPreviewScreen';
import { catherineHirons } from '../../mocks/users';
import { DeleteUserContentPreviewScreenProps } from '../../components/DeleteUserContentPreviewScreen/types';

const defaultProps: DeleteUserContentPreviewScreenProps = {
  isCurrentUser: false,
  user: catherineHirons,
  preferenceSelection: (name: string) => jest.fn(),
};

const render = (props = {}) =>
  shallow(<DeleteUserContentPreviewScreen {...defaultProps} {...props} />);

describe('DeleteUserContentPreviewScreen', () => {
  test('renders snapshot for personal accounts when isCurrentUser is true', () => {
    const wrapper = render({ isCurrentUser: true });
    expect(wrapper).toMatchSnapshot();
  });
  test('renders snapshot for unmanaged accounts when isCurrentUser is false', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });
  test('componentDidMount calls the preferenceSelection prop', () => {
    const spyPreferenceSelection = jest.fn();
    render({ preferenceSelection: spyPreferenceSelection });
    expect(spyPreferenceSelection).toHaveBeenCalledTimes(1);
  });
});

describe('handleClickSelection', () => {
  test('changes the isSelected parameter of the element', () => {
    const wrapper = render();
    const divWrapper = wrapper.find('.nameSectionCard');
    divWrapper.simulate('click');
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
  test('calls "preferenceSelection" prop', () => {
    const preferenceSelection = jest.fn();
    const wrapper = render({ preferenceSelection });
    const divWrapper = wrapper.find('.nameSectionCard');
    divWrapper.simulate('click');
    wrapper.update();
    expect(preferenceSelection).toHaveBeenCalled();
  });
});
