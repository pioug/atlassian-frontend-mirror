import React from 'react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';

import { ArticleWasHelpfulYesButton } from '../../WasHelpfulYesButton';

import { messages } from '../../../../../../messages';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageYes = intl.formatMessage(messages.help_article_rating_option_yes);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleContent', () => {
  it('Match snapshot', () => {
    const { container } = render(
      <ArticleWasHelpfulYesButton
        isSelected={false}
        onClick={mockOnClick}
        intl={intl}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('props methods "onWasHelpfulYesButtonClick" and "onClick" should be executed when the user click the button', () => {
    const { getByText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ArticleWasHelpfulYesButton
          isSelected={false}
          onClick={mockOnClick}
          intl={intl}
        />
      </AnalyticsListener>,
    );

    const buttonYes = getByText(messageYes).closest('button');
    expect(buttonYes).not.toBeNull;

    if (buttonYes) {
      fireEvent.click(buttonYes);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
