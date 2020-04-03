import {
  WsRemoteUploadEndData,
  WsRemoteUploadFailData,
  WsRemoteUploadProgressData,
  WsRemoteUploadStartData,
} from '../../../wsMessageData';
import { WsUploadEvents } from '../../wsUploadEvents';
import {
  DispatchUploadEvent,
  RemoteUploadActivity,
} from '../../remoteUploadActivity';
import { expectFunctionToHaveBeenCalledWith } from '@atlaskit/media-test-helpers/jestHelpers';
import { WsActivityEvents } from '../../../wsActivity';

describe('RemoteUploadActivity', () => {
  let dispatchEvent: DispatchUploadEvent<keyof WsUploadEvents>;
  let uploadActivity: RemoteUploadActivity;
  let started: WsActivityEvents['Started'];
  let completed: WsActivityEvents['Completed'];

  const tenantFileId = 'some-tenant-file-id';
  const userFileId = 'some-user-file-id';
  const otherTenantFileId = 'some-other-tenant-file-id';
  const currentAmount = 123;
  const totalAmount = 456;
  const reason = 'some-reason';
  const serviceName = 'dropbox';

  beforeEach(() => {
    dispatchEvent = jest.fn<DispatchUploadEvent<keyof WsUploadEvents>, []>();
    uploadActivity = new RemoteUploadActivity(
      tenantFileId,
      serviceName,
      dispatchEvent,
    );

    started = jest.fn<WsActivityEvents['Started'], []>();
    completed = jest.fn<WsActivityEvents['Completed'], []>();
    uploadActivity.on('Started', started);
    uploadActivity.on('Completed', completed);
  });

  it('should skip event that has no type', () => {
    const incorrectData: any = {
      a: 12,
    };

    uploadActivity.processWebSocketData(incorrectData);
    expect(dispatchEvent).toHaveBeenCalledTimes(0);
  });

  it('should skip event that has no uploadId but known type', () => {
    const incorrectRemoteUploadProgressData: any = {
      type: 'RemoteUploadEnd',
      currentAmount,
      totalAmount,
    };

    uploadActivity.processWebSocketData(incorrectRemoteUploadProgressData);
    expect(dispatchEvent).toHaveBeenCalledTimes(0);
  });

  it('should dispatch RemoteUploadStart event', () => {
    const remoteUploadStartData: WsRemoteUploadStartData = {
      type: 'RemoteUploadStart',
      uploadId: tenantFileId,
    };

    uploadActivity.processWebSocketData(remoteUploadStartData);

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(dispatchEvent, [
      'RemoteUploadStart',
      {
        tenantFileId,
        serviceName,
      },
    ]);

    expect(started).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(started, [uploadActivity]);
  });

  it('should dispatch RemoteUploadProgress event', () => {
    const remoteUploadProgressData: WsRemoteUploadProgressData = {
      type: 'RemoteUploadProgress',
      uploadId: tenantFileId,
      currentAmount,
      totalAmount,
    };

    uploadActivity.processWebSocketData(remoteUploadProgressData);

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(dispatchEvent, [
      'RemoteUploadProgress',
      {
        tenantFileId,
        serviceName,
        bytes: currentAmount,
        fileSize: totalAmount,
      },
    ]);
  });

  it('should dispatch RemoteUploadEnd event and complete activity', () => {
    const remoteUploadEndData: WsRemoteUploadEndData = {
      type: 'RemoteUploadEnd',
      uploadId: tenantFileId,
      fileId: userFileId,
    };

    uploadActivity.processWebSocketData(remoteUploadEndData);

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(dispatchEvent, [
      'RemoteUploadEnd',
      {
        tenantFileId,
        userFileId,
        serviceName,
      },
    ]);

    expect(completed).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(completed, [uploadActivity]);
  });

  it('should dispatch RemoteUploadFail event and complete activity', () => {
    const remoteUploadFailData: WsRemoteUploadFailData = {
      type: 'Error',
      error: 'RemoteUploadFail',
      uploadId: tenantFileId,
      reason,
    };
    uploadActivity.processWebSocketData(remoteUploadFailData);

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(dispatchEvent, [
      'RemoteUploadFail',
      {
        tenantFileId,
        serviceName,
        description: reason,
      },
    ]);

    expect(completed).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(completed, [uploadActivity]);
  });

  it('should dispatch RemoteUploadFail event and complete activity with alternative response shape', () => {
    const remoteUploadFailData: WsRemoteUploadFailData = {
      type: 'Error',
      error: 'RemoteUploadFail',
      uploadId: tenantFileId,
      reason: reason,
    };

    uploadActivity.processWebSocketData(remoteUploadFailData);

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(dispatchEvent, [
      'RemoteUploadFail',
      {
        tenantFileId,
        serviceName,
        description: reason,
      },
    ]);

    expect(completed).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(completed, [uploadActivity]);
  });

  it('should not dispatch known event for another uploadId', () => {
    const remoteUploadProgressData: WsRemoteUploadProgressData = {
      type: 'RemoteUploadProgress',
      uploadId: otherTenantFileId,
      currentAmount,
      totalAmount,
    };

    uploadActivity.processWebSocketData(remoteUploadProgressData);
    expect(dispatchEvent).toHaveBeenCalledTimes(0);
  });
});
