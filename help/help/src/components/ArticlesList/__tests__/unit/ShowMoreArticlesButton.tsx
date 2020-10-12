import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { messages } from '../../../../messages';
import ShowMoreArticlesButton from '../../ShowMoreArticlesButton';

const mockOnToggleArticlesList = jest.fn();
const mockMinItemsToDisplay = 3;
const mockMaxItemsToDisplay = 10;

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageShowMore = intl.formatMessage(
  messages.help_article_list_show_more,
  {
    numberOfRelatedArticlesLeft: (
      mockMaxItemsToDisplay - mockMinItemsToDisplay
    ).toString(),
  },
);
const messageShowLess = intl.formatMessage(
  messages.help_article_list_show_less,
);

describe('ShowMoreArticlesButton', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <ShowMoreArticlesButton
          minItemsToDisplay={mockMinItemsToDisplay}
          maxItemsToDisplay={mockMaxItemsToDisplay}
          showMoreToggeled={false}
          onToggleArticlesList={mockOnToggleArticlesList}
        />
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`If the list of aditional Articles is toggled (showMoreToggeled === true), the message in this button should say "show more articles" or something similar`, () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ShowMoreArticlesButton
          minItemsToDisplay={mockMinItemsToDisplay}
          maxItemsToDisplay={mockMaxItemsToDisplay}
          showMoreToggeled={true}
          onToggleArticlesList={mockOnToggleArticlesList}
        />
      </IntlProvider>,
    );

    const showMoreButton = getByText(messageShowMore);

    expect(showMoreButton.textContent).toBe(messageShowMore);
  });

  it(`If the list of aditional Articles isn't toggled (showMoreToggeled === false), the message in this button should say "show less" or something similar`, () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ShowMoreArticlesButton
          minItemsToDisplay={mockMinItemsToDisplay}
          maxItemsToDisplay={mockMaxItemsToDisplay}
          showMoreToggeled={false}
          onToggleArticlesList={mockOnToggleArticlesList}
        />
      </IntlProvider>,
    );

    const showMoreButton = getByText(messageShowLess);

    expect(showMoreButton.textContent).toBe(messageShowLess);
  });
});
