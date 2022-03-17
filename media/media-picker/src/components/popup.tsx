import { MediaClient } from '@atlaskit/media-client';
import * as exenv from 'exenv';
import { UploadComponent } from './component';

import {
  UploadParams,
  PopupUploadEventPayloadMap,
  Popup,
  PopupConfig,
} from '../types';
import { PopupUploadEventEmitter } from './types';
export class PopupImpl
  extends UploadComponent<PopupUploadEventPayloadMap>
  implements PopupUploadEventEmitter, Popup {
  constructor(
    readonly tenantMediaClient: MediaClient,
    {
      container = exenv.canUseDOM ? document.body : undefined,
      uploadParams, // tenant
      proxyReactContext,
      singleSelect,
      plugins,
      useForgePlugins = false,
      featureFlags,
    }: PopupConfig,
  ) {
    super();
  }
  public async show(): Promise<void> {}

  public async cancel(
    uniqueIdentifier?: string | Promise<string>,
  ): Promise<void> {}

  public teardown(): void {}

  public hide(): void {}

  public setUploadParams(uploadParams: UploadParams): void {}

  public emitClosed(): void {}
}
