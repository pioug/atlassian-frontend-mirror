import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../messages';

import { ShowMoreButton } from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const buttonLabelShowMore = intl.formatMessage(
  messages.help_show_more_button_label_more,
  {
    numberOfItemsLeft: 9,
    itemsType: 'articles',
  },
);
const buttonLabelShowLess = intl.formatMessage(
  messages.help_show_more_button_label_less,
);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ShowMoreButton', () => {
  it('Should match snapshot', async () => {
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={9}
          maxItemsToDisplay={18}
          showMoreToggeled
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { container } = render(component);

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`Should show display the message ${buttonLabelShowMore} if the showMoreToggeled prop is true`, async () => {
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={9}
          maxItemsToDisplay={18}
          showMoreToggeled
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    const showMoreButtonElm = queryByText(`${buttonLabelShowMore}`);
    expect(showMoreButtonElm).not.toBeNull();
  });

  it(`Should show display the message ${buttonLabelShowLess} if the showMoreToggeled prop is false`, async () => {
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={9}
          maxItemsToDisplay={18}
          showMoreToggeled={false}
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    const showMoreButtonElm = queryByText(`${buttonLabelShowLess}`);
    expect(showMoreButtonElm).not.toBeNull();
  });

  it(`The number of articles to display should be equal to maxItemsToDisplay - minItemsToDisplay`, async () => {
    const minItemsToDisplay = 9;
    const maxItemsToDisplay = 18;
    let buttonLabelShowMore = intl.formatMessage(
      messages.help_show_more_button_label_more,
      {
        numberOfItemsLeft: maxItemsToDisplay - minItemsToDisplay,
        itemsType: 'articles',
      },
    );
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={minItemsToDisplay}
          maxItemsToDisplay={maxItemsToDisplay}
          showMoreToggeled
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    let showMoreButtonElm = queryByText(`${buttonLabelShowMore}`);
    expect(showMoreButtonElm).not.toBeNull();

    buttonLabelShowMore = intl.formatMessage(
      messages.help_show_more_button_label_more,
      {
        numberOfItemsLeft: 9999,
        itemsType: 'articles',
      },
    );

    showMoreButtonElm = queryByText(`${buttonLabelShowMore}`);
    expect(showMoreButtonElm).toBeNull();
  });

  it(`The number of articles to display should be 0 if minItemsToDisplay > maxItemsToDisplay`, async () => {
    const minItemsToDisplay = 18;
    const maxItemsToDisplay = 9;
    let buttonLabelShowMore = intl.formatMessage(
      messages.help_show_more_button_label_more,
      {
        numberOfItemsLeft: 0,
        itemsType: 'articles',
      },
    );
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={minItemsToDisplay}
          maxItemsToDisplay={maxItemsToDisplay}
          showMoreToggeled
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    let showMoreButtonElm = queryByText(`${buttonLabelShowMore}`);
    expect(showMoreButtonElm).not.toBeNull();
  });

  it(`Should call handleOnClick when the user click the button`, async () => {
    const minItemsToDisplay = 18;
    const maxItemsToDisplay = 9;
    let buttonLabelShowMore = intl.formatMessage(
      messages.help_show_more_button_label_more,
      {
        numberOfItemsLeft: 0,
        itemsType: 'articles',
      },
    );
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <ShowMoreButton
          intl={intl}
          itemsType="articles"
          minItemsToDisplay={minItemsToDisplay}
          maxItemsToDisplay={maxItemsToDisplay}
          showMoreToggeled
          onToggle={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    let showMoreButtonElm = queryByText(`${buttonLabelShowMore}`);
    expect(showMoreButtonElm).not.toBeNull();

    if (showMoreButtonElm) {
      fireEvent.click(showMoreButtonElm);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
