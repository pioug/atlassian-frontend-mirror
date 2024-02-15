import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { extractBlockActions } from '../index';
import {
  TEST_DOCUMENT_WITH_ACTIONS,
  TEST_DOCUMENT_WITH_PREVIEW,
  TEST_DOCUMENT,
  TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS,
} from '../../common/__mocks__/jsonld';
import { mockAnalytics } from '../../../utils/mocks';
import { CardAction } from '../../../view/Card/types';

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

  it('should return actions if opts are passed', async () => {
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
    ]);
    render(<IntlProvider locale="en">{props[0].text}</IntlProvider>);
    expect(await screen.findByText('Download')).toBeVisible();
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

  it('should return no actions when actionOptions.hide is true', () => {
    const props = extractBlockActions(
      blockCardProps,
      TEST_DOCUMENT_WITH_PREVIEW,
      {
        handleInvoke,
        analytics: mockAnalytics,
        actionOptions: { hide: true },
      },
      'web',
    );

    expect(props).toEqual([]);
  });

  it('should return actions when actionOptions.hide is false and actionOptions.exclude is empty', () => {
    const props = extractBlockActions(
      blockCardProps,
      TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS,
      {
        handleInvoke,
        analytics: mockAnalytics,
        actionOptions: { hide: false, exclude: [] },
      },
      'web',
    );

    expect(props).toEqual([
      {
        id: 'view-content',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      {
        id: 'download-content',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    ]);
  });

  it('should not return action when excluded in actionOptions', () => {
    const props = extractBlockActions(
      blockCardProps,
      TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS,
      {
        handleInvoke,
        analytics: mockAnalytics,
        actionOptions: { hide: false, exclude: [CardAction.ViewAction] },
      },
      'web',
    );

    expect(props).toEqual([
      {
        id: 'download-content',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    ]);
  });
});
