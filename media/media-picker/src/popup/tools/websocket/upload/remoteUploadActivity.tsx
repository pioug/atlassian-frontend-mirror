import { EventEmitter2 } from 'eventemitter2';
import { WsActivity, WsActivityEvents } from '../wsActivity';
import { RemoteUploadBasePayload, WsUploadEvents } from './wsUploadEvents';
import {
  isNotifyMetadata,
  isRemoteUploadEndData,
  isRemoteUploadErrorData,
  isRemoteUploadProgressData,
  isRemoteUploadStartData,
  WsUploadMessageData,
} from '../wsMessageData';
import { ServiceName } from '../../../domain';

export type DispatchUploadEvent<T extends keyof WsUploadEvents> = (
  event: T,
  payload: WsUploadEvents[T],
) => void;

export class RemoteUploadActivity implements WsActivity {
  private readonly eventEmitter = new EventEmitter2();

  constructor(
    private readonly tenantFileId: string,
    private readonly serviceName: ServiceName,
    private readonly dispatchEvent: DispatchUploadEvent<keyof WsUploadEvents>,
  ) {}

  processWebSocketData(data: WsUploadMessageData): void {
    if (!this.shouldProcessWsData(data)) {
      return;
    }

    const basePayload: RemoteUploadBasePayload = {
      // See description around `WsUploadMessageData.uploadId`
      tenantFileId: data.uploadId,
      serviceName: this.serviceName,
    };

    if (isRemoteUploadStartData(data)) {
      this.dispatchEvent('RemoteUploadStart', {
        ...basePayload,
      });
      this.notifyActivityStarted();
    } else if (isRemoteUploadProgressData(data)) {
      this.dispatchEvent('RemoteUploadProgress', {
        bytes: data.currentAmount,
        fileSize: data.totalAmount,
        ...basePayload,
      });
    } else if (isRemoteUploadEndData(data)) {
      this.dispatchEvent('RemoteUploadEnd', {
        userFileId: data.fileId,
        ...basePayload,
      });
      this.notifyActivityCompleted();
    } else if (isRemoteUploadErrorData(data)) {
      this.dispatchEvent('RemoteUploadFail', {
        description: data.reason,
        ...basePayload,
      });
      this.notifyActivityCompleted();
    } else if (isNotifyMetadata(data)) {
      this.dispatchEvent('NotifyMetadata', {
        metadata: data.metadata,
        ...basePayload,
      });
    }
  }

  connectionLost(): void {
    if (this.tenantFileId) {
      this.dispatchEvent('RemoteUploadFail', {
        tenantFileId: this.tenantFileId,
        description: 'Websocket connection lost',
        serviceName: this.serviceName,
      });
    }
  }

  on<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void {
    this.eventEmitter.on(event, handler);
  }

  off<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void {
    this.eventEmitter.off(event, handler);
  }

  private shouldProcessWsData(data: WsUploadMessageData): boolean {
    return (
      !!data.uploadId &&
      !!this.tenantFileId &&
      data.uploadId === this.tenantFileId
    );
  }

  private notifyActivityStarted(): void {
    this.eventEmitter.emit('Started', this);
  }

  private notifyActivityCompleted(): void {
    this.eventEmitter.emit('Completed', this);
  }
}
