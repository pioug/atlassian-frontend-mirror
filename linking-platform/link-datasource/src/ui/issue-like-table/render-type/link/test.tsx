import React from 'react';

import { render, waitFor } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import SmartLinkClient from '../../../../../examples-helpers/smartLinkCustomClient';

import Link, { LINK_TYPE_TEST_ID } from './index';

mockSimpleIntersectionObserver(); // required to mock smart link internals
describe('Link Type', () => {
  const setup = ({ url = '', ...props }) => {
    return render(
      <SmartCardProvider client={new SmartLinkClient()}>
        <Link url={url} {...props} />
      </SmartCardProvider>,
    );
  };
  it('renders as a smart link', async () => {
    const { getByText, queryByTestId } = setup({
      url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
    });

    await waitFor(() =>
      getByText(
        'EDM-5941: Implement mapping between data type and visual component',
      ),
    );

    const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);

    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      'href',
      'https://product-fabric.atlassian.net/browse/EDM-5941',
    );
  });

  it('renders with the text passed and has correct attributes', async () => {
    const { queryByRole } = setup({
      url: 'https://www.atlassian.com/',
      text: 'Atlassian Website',
    });

    const anchor = queryByRole('link');

    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Atlassian Website');
    expect(anchor).toHaveAttribute('href', 'https://www.atlassian.com/');
    expect(anchor).toHaveAttribute('target', '_blank');
  });

  it('renders with the styles when linkType is passed', async () => {
    const { queryByRole } = setup({
      url: 'https://www.atlassian.com/',
      text: 'Atlassian Website',
      style: {
        appearance: 'key',
      },
    });

    const anchor = queryByRole('link');

    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveStyle({
      fontWeight: '600',
      marginTop: '20px',
      textTransform: 'uppercase',
    });
  });
});
