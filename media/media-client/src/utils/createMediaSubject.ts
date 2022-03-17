import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MediaSubscribableItem } from '../models/media-subscribable';

export function createMediaSubject<T extends MediaSubscribableItem>(
  initialState?: T | Error,
): ReplaySubject<T> {
  const subject = new ReplaySubject<T>(1);

  if (initialState instanceof Error) {
    subject.error(initialState);
  } else if (initialState) {
    subject.next(initialState);
  }

  return subject;
}
