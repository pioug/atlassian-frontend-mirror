import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { extractClientActions } from '../extractActions';
import {
  TEST_DOCUMENT_WITH_ACTIONS,
  TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS,
  TEST_VIEW_ACTION,
} from '../../__mocks__/jsonld';
import { CardAction } from '../../../../view/Card/types';

describe('extractBlockActionPropsFromJSONLD()', () => {
  const handler = jest.fn();

  it('should return empty array if there are no actions', () => {
    expect(extractClientActions(document as any, handler)).toEqual([]);
  });

  it('should return client actions', async () => {
    const props = extractClientActions(
      TEST_DOCUMENT_WITH_ACTIONS as any,
      handler,
    );
    expect(props).toEqual([
      {
        id: 'download-content',
        text: expect.any(Object),
        promise: expect.any(Function),
      },
    ]);
    render(<IntlProvider locale="en">{props[0].text}</IntlProvider>);
    expect(await screen.findByText('Download')).toBeVisible();
  });

  it('should use action @type when @id is not defined', () => {
    const document = {
      ...TEST_DOCUMENT_WITH_ACTIONS,
      'schema:potentialAction': [TEST_VIEW_ACTION],
    };
    expect(extractClientActions(document as any, handler)).toEqual([
      {
        id: 'view-content',
        text: expect.any(Object),
        promise: expect.any(Function),
      },
    ]);
  });

  it('should not return an excluded action', () => {
    const document = {
      ...TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS,
    };

    expect(
      extractClientActions(document as any, handler, {
        hide: false,
        exclude: [CardAction.ViewAction],
      }),
    ).toEqual([
      {
        id: 'download-content',
        text: expect.any(Object),
        promise: expect.any(Function),
      },
    ]);
  });
});
