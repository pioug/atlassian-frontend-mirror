import React from 'react';
import '@atlaskit/link-test-helpers/jest';
import { render } from '@testing-library/react';

import { Card, Provider, Client } from '@atlaskit/smart-card';
import EmbedCard from '../../../../react/nodes/embedCard';

jest.mock('@atlaskit/smart-card', () => {
  const originalModule = jest.requireActual('@atlaskit/smart-card');
  return {
    ...originalModule,
    Card: jest.fn((props) => <originalModule.Card {...props} />),
  };
});

describe('Renderer - React/Nodes/EmbedCard', () => {
  const url =
    'https://pug.jira-dev.com/wiki/spaces/CE/blog/2017/08/18/3105751050/A+better+REST+API+for+Confluence+Cloud+via+Swagger';

  it('should render Card with frameStyle if provided as SmartLinks prop', () => {
    render(
      <Provider client={new Client('staging')}>
        <EmbedCard
          url={url}
          layout={'full-width'}
          smartLinks={{ frameStyle: 'hide' }}
        />
      </Provider>,
    );
    expect(Card).toBeCalledWith(
      expect.objectContaining({
        frameStyle: 'hide',
        appearance: 'embed',
      }),
      expect.anything(),
    );
  });
});
