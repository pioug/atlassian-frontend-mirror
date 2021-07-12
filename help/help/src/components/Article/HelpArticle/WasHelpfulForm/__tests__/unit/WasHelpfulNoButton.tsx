import React from 'react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../../../messages';

import { ArticleWasHelpfulNoButton } from '../../WasHelpfulNoButton';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageNo = intl.formatMessage(messages.help_article_rating_option_no);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleContent', () => {
  it('Match snapshot', () => {
    const { container } = render(
      <ArticleWasHelpfulNoButton
        isSelected={false}
        onClick={mockOnClick}
        intl={intl}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('props methods "onWasHelpfulNoButtonClick" and "onClick" should be executed when the user click the button', () => {
    const { getByText } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ArticleWasHelpfulNoButton
          isSelected={false}
          onClick={mockOnClick}
          intl={intl}
        />
      </AnalyticsListener>,
    );

    const buttonNo = getByText(messageNo).closest('button');
    expect(buttonNo).not.toBeNull;

    if (buttonNo) {
      fireEvent.click(buttonNo);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
