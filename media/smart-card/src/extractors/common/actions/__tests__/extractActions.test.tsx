import React from 'react';
import { mount } from 'enzyme';
import { FormattedMessage, IntlProvider } from 'react-intl';

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

  it('should return client and server actions together', () => {
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
    const downloadMessage = mount(
      <IntlProvider locale="en">{props[0].text}</IntlProvider>,
    );
    const downloadMessageProp = downloadMessage
      .find(FormattedMessage)
      .prop('defaultMessage');
    expect(downloadMessageProp).toEqual('Download');
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
