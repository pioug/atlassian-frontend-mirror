import React from 'react';
import { render } from '@testing-library/react';
import { createIntl, createIntlCache } from 'react-intl-next';

import { messages } from '../../../../../../messages';

import { Loading } from '../../index';

// Messages
const cache = createIntlCache();
const intl = createIntl(
  {
    locale: 'en',
    messages: {},
  },
  cache,
);
const messageLoading = intl.formatMessage(messages.help_loading);

describe('ArticleContent', () => {
  it('Should match snapshot', () => {
    const { container } = render(<Loading intl={intl} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should display Loading component', () => {
    const { queryByLabelText } = render(<Loading intl={intl} />);

    const loadingImg = queryByLabelText(messageLoading);

    expect(loadingImg).not.toBeNull();
  });
});
