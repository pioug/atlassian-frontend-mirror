import { ReplaySubject } from 'rxjs/ReplaySubject';

import { FileState } from '../models/file-state';

export function createMediaSubject<T extends FileState>(
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
