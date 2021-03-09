import {
  UIEventPayload,
  UIAttributes,
  WithFileAttributes,
} from '@atlaskit/media-common';
import { Identifier, isFileIdentifier } from '@atlaskit/media-client';
import { NavigationDirection, NavigationSource } from '../../../navigation';

export type NavigatedAttributes = UIAttributes &
  WithFileAttributes & {
    input: 'button' | 'keys';
  };

export type NavigatedEventPayload = UIEventPayload<
  NavigatedAttributes,
  'navigated',
  'file'
> & {
  actionSubjectId: 'next' | 'previous';
};

export type NavigatedInput = 'button' | 'keys';

export const inputFromSource = (source: NavigationSource) => {
  return {
    mouse: 'button',
    keyboard: 'keys',
  }[source] as NavigatedInput;
};

export const createNavigatedEvent = (
  direction: NavigationDirection,
  source: NavigationSource,
  identifier: Identifier,
): NavigatedEventPayload => ({
  eventType: 'ui',
  action: 'navigated',
  actionSubject: 'file',
  actionSubjectId: direction === 'next' ? 'next' : 'previous',
  attributes: {
    fileAttributes: {
      fileId: isFileIdentifier(identifier) ? identifier.id : '',
    },
    input: inputFromSource(source),
  },
});
