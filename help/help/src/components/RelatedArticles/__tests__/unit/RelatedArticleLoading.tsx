import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import RelatedArticlesLoading from '../../RelatedArticlesLoading';

describe('RelatedArticlesLoading', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <RelatedArticlesLoading />
      </IntlProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
