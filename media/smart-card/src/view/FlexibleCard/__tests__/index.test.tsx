import React from 'react';
import { render } from '@testing-library/react';
import { CardState } from '@atlaskit/linking-common';
import FlexibleCard from '../index';
import { TitleBlock } from '../components/blocks';

describe('FlexibleCard', () => {
  it('renders flexible card', async () => {
    const title = 'some-name';
    const url = 'http://some-url.com';
    const cardState: CardState = {
      status: 'resolved',
      details: {
        meta: {
          access: 'granted',
          visibility: 'public',
        },
        data: {
          '@type': 'Object',
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          url,
          name: title,
        },
      },
    };

    const { getByTestId } = render(
      <FlexibleCard cardState={cardState} url={url}>
        <TitleBlock />
      </FlexibleCard>,
    );

    const container = await getByTestId('smart-links-container');
    const titleBlock = await getByTestId('smart-block-title-resolved-view');

    expect(container).toBeTruthy();
    expect(titleBlock).toBeTruthy();
    expect(titleBlock.textContent).toEqual(title);
  });
});
