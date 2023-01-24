import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { extractActions } from '../extractActions';
import {
  TEST_DOCUMENT_WITH_ACTIONS,
  TEST_NO_ID_ACTION,
} from '../../__mocks__/jsonld';

describe('extractBlockActionPropsFromJSONLD()', () => {
  const handler = jest.fn();

  it('should return empty array if there are no actions', () => {
    expect(extractActions(document as any, handler)).toEqual([]);
  });

  it('should return client and server actions together', async () => {
    const props = extractActions(TEST_DOCUMENT_WITH_ACTIONS as any, handler);
    expect(props).toEqual([
      {
        id: 'download-content',
        text: expect.any(Object),
        promise: expect.any(Function),
      },
      {
        id: 'assign',
        text: 'assign',
        promise: expect.any(Function),
      },
    ]);
    render(<IntlProvider locale="en">{props[0].text}</IntlProvider>);
    expect(await screen.findByText('Download')).toBeVisible();
  });

  it('should use action @type when @id is not defined', () => {
    const document = {
      ...TEST_DOCUMENT_WITH_ACTIONS,
      'schema:potentialAction': [TEST_NO_ID_ACTION],
    };
    expect(extractActions(document as any, handler)).toEqual([
      {
        id: 'DeleteAction',
        text: 'delete',
        promise: expect.any(Function),
      },
    ]);
  });
});
