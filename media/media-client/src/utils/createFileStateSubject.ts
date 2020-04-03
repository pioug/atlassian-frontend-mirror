import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FileState } from '../models/file-state';

export const createFileStateSubject = (
  initialState?: FileState,
): ReplaySubject<FileState> => {
  const subject = new ReplaySubject<FileState>(1);

  if (initialState) {
    subject.next(initialState);
  }

  return subject;
};
