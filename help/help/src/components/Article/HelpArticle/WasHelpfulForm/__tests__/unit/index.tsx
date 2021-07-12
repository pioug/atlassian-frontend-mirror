import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { messages } from '../../../../../../messages';

import ArticleWasHelpfulForm from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageNo = intl.formatMessage(messages.help_article_rating_option_no);
const messageYes = intl.formatMessage(messages.help_article_rating_option_yes);

const mockOnWasHelpfulYesButtonClick = jest.fn();
const mockOnWasHelpfulNoButtonClick = jest.fn();

describe('ArticleWasHelpfulForm', () => {
  it('Match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <ArticleWasHelpfulForm
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
        />
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('onWasHelpfulYesButtonClick prop function is called when the user clicks the button in WasHelpfulYesButton component', () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ArticleWasHelpfulForm
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
        />
      </IntlProvider>,
    );

    const buttonYes = getByText(messageYes).closest('button');
    const buttonNo = getByText(messageNo).closest('button');

    expect(buttonYes).not.toBeNull;
    expect(buttonNo).not.toBeNull;

    if (buttonNo && buttonYes) {
      fireEvent.click(buttonYes);
      expect(mockOnWasHelpfulYesButtonClick).toHaveBeenCalledTimes(1);

      fireEvent.click(buttonNo);
      expect(mockOnWasHelpfulNoButtonClick).toHaveBeenCalledTimes(1);
    }
  });

  it('Only one button should be selected. When the user clicks the button "yes", el button "No" should be unselected and vice versa', () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ArticleWasHelpfulForm
          onWasHelpfulNoButtonClick={mockOnWasHelpfulNoButtonClick}
          onWasHelpfulYesButtonClick={mockOnWasHelpfulYesButtonClick}
        />
      </IntlProvider>,
    );

    const buttonYes = getByText(messageYes).closest('button');
    const buttonNo = getByText(messageNo).closest('button');

    expect(buttonYes).not.toBeNull();
    expect(buttonNo).not.toBeNull();

    if (buttonNo && buttonYes) {
      const buttonNoCssClass = buttonNo.className;
      const buttonYesCssClass = buttonYes.className;

      fireEvent.click(buttonYes);
      expect(buttonYes.className).not.toBe(buttonYesCssClass);
      expect(buttonNoCssClass).toBe(buttonNoCssClass);

      fireEvent.click(buttonNo);
      expect(buttonYes.className).toBe(buttonYesCssClass);
      expect(buttonNo.className).not.toBe(buttonNoCssClass);
    }
  });
});
