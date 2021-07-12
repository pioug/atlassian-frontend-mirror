import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { getMockWhatsNewArticleItemList } from '../../../../../../util/testing/mock';

import WhatsNewResultsList from '../../WhatsNewResultsList';
import { WhatsNewResultsList as WhatsNewResultsListInterface } from '../../model/WhatsNewResultsList';

const mockOnWhatsNewArticleItemClick = jest.fn();
const mockOnShowMoreButtonClick = jest.fn();
let WhatsNewResultsListProps: Partial<WhatsNewResultsListInterface>;

describe('WhatsNewResultsList', () => {
  beforeEach(() => {
    WhatsNewResultsListProps = {
      whatsNewArticles: getMockWhatsNewArticleItemList(10),
      onWhatsNewResultItemClick: mockOnWhatsNewArticleItemClick,
      onShowMoreButtonClick: mockOnShowMoreButtonClick,
    };
  });

  it('Should match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <WhatsNewResultsList {...WhatsNewResultsListProps} />
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
