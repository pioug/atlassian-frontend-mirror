import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../messages';

import { CloseButton } from '../../CloseButton';

// Messages
const cache = createIntlCache();
const intl = createIntl(
  {
    locale: 'en',
    messages: {},
  },
  cache,
);
const messageClose = intl.formatMessage(messages.help_panel_header_close);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('BackButton', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <CloseButton intl={intl} onClick={mockOnClick} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should execute the prop function "mockOnClick" when the close button is clicked', () => {
    const { getByLabelText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <CloseButton intl={intl} onClick={mockOnClick} />,
      </AnalyticsListener>,
    );

    const buttonClose = getByLabelText(messageClose).closest('button');

    expect(buttonClose).not.toBeNull;

    if (buttonClose) {
      fireEvent.click(buttonClose);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
