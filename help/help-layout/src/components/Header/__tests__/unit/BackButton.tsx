import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../messages';

import { BackButton } from '../../BackButton';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageNavigateBack = intl.formatMessage(messages.help_panel_header_back);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('BackButton', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <BackButton intl={intl} onClick={mockOnClick} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should not be visible if the prop "isVisible" is false', () => {
    const { container } = render(
      <BackButton intl={intl} onClick={mockOnClick} isVisible={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('Should execute the prop function "onClick" and "navigateBack" when the back button is clicked', () => {
    const { getByText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <BackButton intl={intl} onClick={mockOnClick} />
      </AnalyticsListener>,
    );

    const buttonBack = getByText(messageNavigateBack).closest('button');

    expect(buttonBack).not.toBeNull;

    if (buttonBack) {
      fireEvent.click(buttonBack);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
