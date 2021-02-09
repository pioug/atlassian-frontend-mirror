import React from 'react';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import ModalElementBrowser from '../../ModalElementBrowser';
import Button from '@atlaskit/button/custom-theme-button';
import { IntlProvider } from 'react-intl';
import { messages } from '../../messages';

let testProps = {} as any;

describe('ModalElementBrowser', () => {
  let wrapper: ReactWrapper;
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();
  const testHelpUrl = 'https://helpurl.com';

  beforeEach(() => {
    // clean jest.Fn calls for both close/escape test cases.
    testProps = {
      getItems: jest.fn(() => []),
      onInsertItem: jest.fn(),
      onClose: jest.fn(),
      isOpen: true,
      helpUrl: testHelpUrl,
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

  it('renders a help button when helpUrl is provided', () => {
    const HelpButton = getButtonWrapper(wrapper, 'help');
    expect(HelpButton.length).toBe(1);
    expect(HelpButton.props()).toHaveProperty('href', testHelpUrl);
  });

  it('renders the translated help text', () => {
    const HelpButton = getButtonWrapper(wrapper, 'help');
    expect(HelpButton.text()).toEqual(intl.formatMessage(messages.help));
  });

  it('does not render a help button when helpUrl is empty', () => {
    const emptyHelpUrlProps = {
      ...testProps,
      helpUrl: undefined,
    };
    wrapper = mountWithIntl(<ModalElementBrowser {...emptyHelpUrlProps} />);
    const HelpButton = getButtonWrapper(wrapper, 'help');
    expect(HelpButton.length).toBe(0);
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
