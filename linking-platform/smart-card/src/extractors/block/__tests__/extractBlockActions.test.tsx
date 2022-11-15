import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl-next';

import { extractBlockActions } from '../index';
import {
  TEST_DOCUMENT_WITH_ACTIONS,
  TEST_DOCUMENT_WITH_PREVIEW,
  TEST_DOCUMENT,
} from '../../common/__mocks__/jsonld';
import { mockAnalytics } from '../../../utils/mocks';

describe('extractors.block.extractBlockActions', () => {
  let handleInvoke: jest.Mock;
  const blockCardProps = { icon: { url: 'https://my/icon' } };

  beforeEach(() => {
    handleInvoke = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  it('should return empty array if no opts are passed', () => {
    expect(extractBlockActions(blockCardProps, TEST_DOCUMENT)).toEqual([]);
  });

  it('should return actions if opts are passed', () => {
    const props = extractBlockActions(
      blockCardProps,
      TEST_DOCUMENT_WITH_ACTIONS,
      {
        handleInvoke,
        analytics: mockAnalytics,
      },
    );
    expect(props).toEqual([
      {
        id: 'download-content',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      {
        id: 'assign',
        promise: expect.any(Function),
        text: 'assign',
      },
    ]);
    const downloadMessage = mount(
      <IntlProvider locale="en">{props[0].text}</IntlProvider>,
    );
    const downloadMessageProp = downloadMessage
      .find('FormattedMessage')
      .prop('defaultMessage');
    expect(downloadMessageProp).toEqual('Download');
  });

  it('should return preview action when platform is supported', () => {
    const props = extractBlockActions(
      blockCardProps,
      TEST_DOCUMENT_WITH_PREVIEW,
      {
        handleInvoke,
        analytics: mockAnalytics,
      },
      'web',
    );
    expect(props).toEqual([
      {
        id: 'preview-content',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    ]);
  });
});
