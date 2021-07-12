import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../../messages';

import { ArticleLoadingFail } from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageButtonLabel = intl.formatMessage(
  messages.help_article_error_button_label,
);

const mockOnTryAgainButtonClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleLoadingFail', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ArticleLoadingFail
          onTryAgainButtonClick={mockOnTryAgainButtonClick}
          intl={intl}
        />
      </AnalyticsListener>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it should call handleOnClick when the user click the loading error button', () => {
    const { getByText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ArticleLoadingFail
          onTryAgainButtonClick={mockOnTryAgainButtonClick}
          intl={intl}
        />
      </AnalyticsListener>,
    );

    const buttonTryAgain = getByText(messageButtonLabel).closest('button');
    expect(buttonTryAgain).not.toBeNull;

    if (buttonTryAgain) {
      fireEvent.click(buttonTryAgain);
      expect(mockOnTryAgainButtonClick).toHaveBeenCalledTimes(1);
    }
  });
});
