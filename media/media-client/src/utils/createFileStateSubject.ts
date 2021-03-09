import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FileState } from '../models/file-state';

export const createFileStateSubject = (
  initialState?: FileState | Error,
): ReplaySubject<FileState> => {
  const subject = new ReplaySubject<FileState>(1);

  if (initialState instanceof Error) {
    subject.error(initialState);
  } else if (initialState) {
    subject.next(initialState);
  }

  return subject;
};
