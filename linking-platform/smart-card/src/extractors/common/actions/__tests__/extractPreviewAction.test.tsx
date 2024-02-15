import { JsonLd } from 'json-ld-types';
import { extractPreviewAction } from '../extractPreviewAction';
import { mockAnalytics, mocks } from '../../../../utils/mocks';
import { CardAction } from '../../../../view/Card/types';

describe('extractPreviewAction', () => {
  it('returns preview action', () => {
    const handleInvoke = jest.fn();
    const opts = {
      analytics: mockAnalytics,
      handleInvoke,
      extensionKey: 'mock-extension-key',
      source: 'block' as const,
    };
    const action = extractPreviewAction({
      ...opts,
      viewProps: { icon: {} },
      jsonLd: mocks.success.data as JsonLd.Data.BaseData,
    });
    action?.promise();

    expect(action).toEqual({
      id: 'preview-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });
    expect(handleInvoke).toHaveBeenLastCalledWith({
      action: {
        promise: expect.any(Function),
        type: 'PreviewAction',
      },
      key: 'mock-extension-key',
      source: 'block',
      type: 'client',
    });
  });

  it('should not return preview action is excluded', () => {
    const handleInvoke = jest.fn();
    const opts = {
      analytics: mockAnalytics,
      handleInvoke,
      extensionKey: 'mock-extension-key',
      source: 'block' as const,
      actionOptions: {
        hide: false,
        exclude: [CardAction.PreviewAction],
      },
    };
    const action = extractPreviewAction({
      ...opts,
      viewProps: { icon: {} },
      jsonLd: mocks.success.data as JsonLd.Data.BaseData,
    });

    expect(action).toEqual(undefined);
  });
});
