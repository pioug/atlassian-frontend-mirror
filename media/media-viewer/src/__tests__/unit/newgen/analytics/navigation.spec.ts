import { Identifier } from '@atlaskit/media-client';
import { createNavigationEvent } from '../../../../newgen/analytics/navigation';
import {
  version as packageVersion,
  name as packageName,
} from '../../../../version.json';

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

const commonAttributes = {
  componentName: 'media-viewer',
  packageName,
  packageVersion,
};

describe('createNavigationEvent', () => {
  it('previous mouse click', () => {
    expect(createNavigationEvent('prev', 'mouse', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'previous',
      attributes: {
        fileId: 'my-id',
        input: 'button',
        ...commonAttributes,
      },
    });
  });
  it('next mouse click', () => {
    expect(createNavigationEvent('next', 'mouse', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'next',
      attributes: {
        fileId: 'my-id',
        input: 'button',
        ...commonAttributes,
      },
    });
  });

  it('previous keyboard event', () => {
    expect(createNavigationEvent('prev', 'keyboard', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'previous',
      attributes: {
        fileId: 'my-id',
        input: 'keys',
        ...commonAttributes,
      },
    });
  });
  it('next keyboard event', () => {
    expect(createNavigationEvent('next', 'keyboard', identifier)).toEqual({
      ...commonPayload,
      actionSubjectId: 'next',
      attributes: {
        fileId: 'my-id',
        input: 'keys',
        ...commonAttributes,
      },
    });
  });
});
