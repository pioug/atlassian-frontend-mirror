import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { messages } from '../../../../../../messages';
import { WhatsNewResultsError } from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageButtonLabel = intl.formatMessage(
  messages.help_search_error_button_label,
);

const mockOnSearch = jest.fn();

describe('WhatsNewResultsError', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <WhatsNewResultsError intl={intl} onSearch={mockOnSearch} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should match snapshot', () => {
    const { queryByText } = render(
      <WhatsNewResultsError intl={intl} onSearch={mockOnSearch} />,
    );

    const buttonLabel = queryByText(messageButtonLabel);
    expect(buttonLabel).not.toBeNull();

    if (buttonLabel) {
      const button = buttonLabel.closest('button');
      expect(button).not.toBeNull();

      if (button) {
        expect(mockOnSearch).toHaveBeenCalledTimes(0);
        fireEvent.click(button);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      }
    }
  });
});
