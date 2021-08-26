import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import Dataloader from 'dataloader';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { from } from 'rxjs/observable/from';
import { map } from 'rxjs/operators/map';
import { Interpreter } from 'xstate';

import { FileState, mapMediaItemToFileState } from '../../models/file-state';
import { DataloaderKey, DataloaderResult } from '../createFileDataLoader';
import { createFileStateSubject } from '../createFileStateSubject';
import { isEmptyFile } from '../detectEmptyFile';
import { getPollingOptions, PollingFunction } from '../polling';
import { MobileUploadError } from './error';
import {
  StateMachineContext,
  StateMachineEvent,
  StateMachineTypestate,
} from './stateMachine/types';

export const createMobileFileStateSubject = (
  service: Interpreter<
    StateMachineContext,
    any,
    StateMachineEvent,
    StateMachineTypestate
  >,
): ReplaySubject<FileState> => {
  const subject = new ReplaySubject<FileState>(1);

  from(service.start())
    .pipe(map((state) => state.context.currentFileState))
    .subscribe(subject);

  return subject;
};

export const createMobileDownloadFileStream = (
  dataloader: Dataloader<DataloaderKey, DataloaderResult>,
  id: string,
  collectionName?: string,
  occurrenceKey?: string,
  featureFlags?: MediaFeatureFlags,
): ReplaySubject<FileState> => {
  const subject = createFileStateSubject();
  const poll = new PollingFunction(getPollingOptions(featureFlags));

  // ensure subject errors if polling exceeds max iterations or uncaught exception in executor
  poll.onError = (error: Error) => subject.error(error);

  poll.execute(async () => {
    const response = await dataloader.load({
      id,
      collectionName,
    });

    if (!response) {
      throw new MobileUploadError('emptyItems', id, {
        collectionName,
        occurrenceKey,
      });
    }

    if (isEmptyFile(response)) {
      throw new MobileUploadError('zeroVersionFile', id, {
        collectionName,
        occurrenceKey,
      });
    }

    const fileState = mapMediaItemToFileState(id, response);
    subject.next(fileState);

    switch (fileState.status) {
      case 'processing':
        // the only case for continuing polling, otherwise this function is run once only
        poll.next();
        break;
      case 'processed':
        subject.complete();
        break;
    }
  });

  return subject;
};
