import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { IntlProvider } from 'react-intl';

import { getMockWhatsNewArticleItem } from '../../../../../../../util/testing/mock';

import { WhatsNewResultListItem } from '../../index';
import { messages } from '../../../../../../../messages';
import { WHATS_NEW_ITEM_TYPES } from '../../../../../../../model/WhatsNew';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageTypeWhatsNewNewFeature = intl.formatMessage(
  messages.help_whats_new_filter_select_option_new,
);
const messageTypeWhatsNewFix = intl.formatMessage(
  messages.help_whats_new_filter_select_option_fix,
);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('WhatsNewResultListItem', () => {
  it('Should match snapshot', () => {
    const mockWhatsNewArticleItem = getMockWhatsNewArticleItem('1');
    const { container } = render(
      <WhatsNewResultListItem
        intl={intl}
        {...mockWhatsNewArticleItem}
        onClick={mockOnClick}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`Should display the type "New Feature" if the type isn't defined `, () => {
    const mockWhatsNewArticleItem = getMockWhatsNewArticleItem('1');
    const { queryByText } = render(
      <WhatsNewResultListItem
        intl={intl}
        {...mockWhatsNewArticleItem}
        onClick={mockOnClick}
      />,
    );

    const TypeHelpArticleElm = queryByText(messageTypeWhatsNewNewFeature);

    expect(TypeHelpArticleElm).not.toBeNull();
  });

  it(`Should display the correct type text if the type is defined `, () => {
    const mockWhatsNewArticleItem = getMockWhatsNewArticleItem(
      '1',
      WHATS_NEW_ITEM_TYPES.FIX,
    );
    const { queryByText } = render(
      <WhatsNewResultListItem
        intl={intl}
        {...mockWhatsNewArticleItem}
        onClick={mockOnClick}
      />,
    );

    const TypeHelpArticleElm = queryByText(messageTypeWhatsNewFix);

    expect(TypeHelpArticleElm).not.toBeNull();
  });

  it(`mockOnClick should be executed when the user clicks in the component`, () => {
    const mockWhatsNewArticleItem = getMockWhatsNewArticleItem('1');
    const { queryByRole } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <WhatsNewResultListItem
          intl={intl}
          {...mockWhatsNewArticleItem}
          onClick={mockOnClick}
        />
        ,
      </AnalyticsListener>,
    );

    const button = queryByRole('button');

    expect(button).not.toBeNull();
    if (button) {
      expect(mockOnClick).toHaveBeenCalledTimes(0);
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
