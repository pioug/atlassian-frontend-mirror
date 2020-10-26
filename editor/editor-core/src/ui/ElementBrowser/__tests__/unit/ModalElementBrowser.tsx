import React from 'react';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import ModalElementBrowser from '../../ModalElementBrowser';
import Button from '@atlaskit/button/custom-theme-button';

let testProps = {} as any;

describe('ModalElementBrowser', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    // clean jest.Fn calls for both close/escape test cases.
    testProps = {
      getItems: jest.fn(() => []),
      onInsertItem: jest.fn(),
      onClose: jest.fn(),
      isOpen: true,
    };
    wrapper = mountWithIntl(<ModalElementBrowser {...testProps} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('calls props.onInsertItem on insert click', () => {
    const InsertButton = getButtonWrapper(wrapper, 'insert');
    InsertButton.simulate('click');
    expect(testProps.onInsertItem).toBeCalledTimes(1);
  });
  it('closes the modal on close button click', () => {
    const CancelButton = getButtonWrapper(wrapper, 'close');
    CancelButton.simulate('click');
    expect(testProps.onClose).toBeCalledTimes(1);
  });
  it('closes the modal on escape key down', () => {
    wrapper.simulate('keydown', { key: 'Escape' });
    expect(testProps.onClose).toBeCalledTimes(1);
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
    .find(Button)
    .find({ 'data-testid': `ModalElementBrowser__${buttonId}-button` })
    .first();
};
