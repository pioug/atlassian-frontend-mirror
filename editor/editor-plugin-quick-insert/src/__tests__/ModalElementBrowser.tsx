import React from 'react';

import { fireEvent } from '@testing-library/react';
import { createIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/quick-insert';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import ModalElementBrowser from '../ui/ModalElementBrowser/ModalElementBrowser';

let testProps = {} as any;

describe('ModalElementBrowser', () => {
  const testHelpUrl = 'https://helpurl.com';
  const intl = createIntl({
    locale: 'en',
  });

  beforeEach(() => {
    testProps = {
      getItems: jest.fn(() => []),
      onInsertItem: jest.fn(),
      onClose: jest.fn(),
      isOpen: true,
      helpUrl: testHelpUrl,
    };
  });

  it('calls props.onInsertItem on insert click', () => {
    const { getByTestId } = renderWithIntl(
      <ModalElementBrowser {...testProps} />,
    );
    fireEvent.click(getByTestId('ModalElementBrowser__insert-button'));
    expect(testProps.onInsertItem).toBeCalledTimes(1);
  });

  it('closes the modal on close button click', () => {
    const { getByTestId } = renderWithIntl(
      <ModalElementBrowser {...testProps} />,
    );
    fireEvent.click(getByTestId('ModalElementBrowser__close-button'));
    expect(testProps.onClose).toBeCalledTimes(1);
  });

  it('renders a help button when helpUrl is provided', () => {
    const { getByTestId } = renderWithIntl(
      <ModalElementBrowser {...testProps} />,
    );
    const helpButton = getByTestId('ModalElementBrowser__help-button');
    expect(helpButton).toHaveAttribute('href', testHelpUrl);
  });

  it('renders the translated help text', () => {
    const { getByTestId } = renderWithIntl(
      <ModalElementBrowser {...testProps} />,
    );
    const helpButton = getByTestId('ModalElementBrowser__help-button');
    expect(helpButton.textContent).toEqual(intl.formatMessage(messages.help));
  });

  it('does not render a help button when helpUrl is empty', () => {
    const emptyHelpUrlProps = {
      ...testProps,
      helpUrl: undefined,
    };
    const { queryByTestId } = renderWithIntl(
      <ModalElementBrowser {...emptyHelpUrlProps} />,
    );
    const helpButton = queryByTestId('ModalElementBrowser__help-button');
    expect(helpButton).not.toBeInTheDocument();
  });
});
