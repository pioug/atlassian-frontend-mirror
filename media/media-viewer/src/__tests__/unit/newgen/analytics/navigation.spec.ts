import { Identifier } from '@atlaskit/media-client';
import { createNavigatedEvent } from '../../../../analytics/events/ui/navigated';

const identifier: Identifier = {
  id: 'my-id',
  mediaItemType: 'file',
  occurrenceKey: 'my-key',
};

const commonPayload = {
  action: 'navigated',
  actionSubject: 'file',
  eventType: 'ui',
};

describe('createNavigationEvent', () => {
  it('previous mouse click', () => {
    expect(createNavigatedEvent('prev', 'mouse', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'previous',
      attributes: {
        fileAttributes: {
          fileId: 'my-id',
        },
        input: 'button',
      },
    });
  });
  it('next mouse click', () => {
    expect(createNavigatedEvent('next', 'mouse', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'next',
      attributes: {
        fileAttributes: {
          fileId: 'my-id',
        },
        input: 'button',
      },
    });
  });

  it('previous keyboard event', () => {
    expect(createNavigatedEvent('prev', 'keyboard', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'previous',
      attributes: {
        fileAttributes: {
          fileId: 'my-id',
        },
        input: 'keys',
      },
    });
  });
  it('next keyboard event', () => {
    expect(createNavigatedEvent('next', 'keyboard', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'next',
      attributes: {
        fileAttributes: {
          fileId: 'my-id',
        },
        input: 'keys',
      },
    });
  });
});
