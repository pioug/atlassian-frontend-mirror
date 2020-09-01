import React from 'react';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import ModalElementBrowser from '../ModalElementBrowser';

const testProps = {
  getItems: jest.fn(() => []),
  onInsertItem: jest.fn(),
  onClose: jest.fn(),
  isOpen: true,
};

describe('ModalElementBrowser', () => {
  it('matches snapshot', () => {
    const wrapper = mountWithIntl(<ModalElementBrowser {...testProps} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
  it('calls props.onInsertItem on insert click', () => {
    const wrapper = mountWithIntl(<ModalElementBrowser {...testProps} />);
    const InsertButton = getButtonWrapper(wrapper, 'insert');
    InsertButton.simulate('click');
    expect(testProps.onInsertItem).toBeCalledTimes(1);
    wrapper.unmount();
  });
  it('closes the modal on cancel button click', () => {
    const wrapper = mountWithIntl(<ModalElementBrowser {...testProps} />);
    const CancelButton = getButtonWrapper(wrapper, 'cancel');
    CancelButton.simulate('click');
    expect(testProps.onClose).toBeCalledTimes(1);
    wrapper.unmount();
  });
});

const getButtonWrapper = (
  wrapper: ReactWrapper<any, any>,
  buttonId: string,
): ReactWrapper => {
  /**
   * Multiple elements are found with same data attribute as Button component
   * has nested child components that share the same data-testid prop.
   */
  return wrapper
    .find('Button')
    .find({ 'data-testid': `ModalElementBrowser__${buttonId}-button` })
    .first();
};
