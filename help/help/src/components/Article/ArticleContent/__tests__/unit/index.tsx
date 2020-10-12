import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { messages } from '../../../../../messages';

import { ArticleContent } from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();
const messageLoading = intl.formatMessage(messages.help_loading);

describe('ArticleContent', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <ArticleContent
        intl={intl}
        isLoading={true}
        title="Title text"
        body="Body text"
        titleLinkUrl="https://www.atlassian.com/"
        onArticleRenderBegin={jest.fn()}
        onArticleRenderDone={jest.fn()}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should display loading state if the prop attribute is "isLoading" is true', () => {
    const { queryByLabelText, queryByText } = render(
      <ArticleContent
        intl={intl}
        isLoading={true}
        title="Title text"
        body="Body text"
        titleLinkUrl="https://www.atlassian.com/"
        onArticleRenderBegin={jest.fn()}
        onArticleRenderDone={jest.fn()}
      />,
    );

    const loadingImg = queryByLabelText(messageLoading);
    const title = queryByText('Title text');

    expect(loadingImg).not.toBeNull();
    expect(title).toBeNull();
  });

  it('should display the article content if the value of the prop isLoading is false', () => {
    const { queryByLabelText, queryByText } = render(
      <ArticleContent
        intl={intl}
        isLoading={false}
        title="Title text"
        body="Body text"
        titleLinkUrl="https://www.atlassian.com/"
        onArticleRenderBegin={jest.fn()}
        onArticleRenderDone={jest.fn()}
      />,
    );

    const loadingImg = queryByLabelText(messageLoading);
    const title = queryByText('Title text');

    expect(loadingImg).toBeNull();
    expect(title).not.toBeNull();
  });
});
