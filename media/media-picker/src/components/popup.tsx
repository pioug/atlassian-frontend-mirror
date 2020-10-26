import { MediaClient } from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { Store } from 'redux';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as exenv from 'exenv';
import App, { AppProxyReactContext } from '../popup/components/app';
import { showPopup } from '../popup/actions/showPopup';
import { getFilesInRecents } from '../popup/actions/getFilesInRecents';
import { getForgePlugins } from '../popup/actions';
import { State } from '../popup/domain';
import { hidePopup } from '../popup/actions/hidePopup';
import { cancelUpload } from '../popup/actions/cancelUpload';
import { failureErrorLogger } from '../popup/actions/failureErrorLogger';
import { createStore } from '../store';
import { UploadComponent } from './component';

import { defaultUploadParams } from '../domain/uploadParams';
import {
  UploadParams,
  PopupUploadEventPayloadMap,
  Popup,
  PopupConfig,
} from '../types';
import { PopupUploadEventEmitter } from './types';

import { createPopupUserAuthProvider } from './popup-auth';

export class PopupImpl
  extends UploadComponent<PopupUploadEventPayloadMap>
  implements PopupUploadEventEmitter, Popup {
  private readonly container?: HTMLElement;
  private readonly store: Store<State>;
  private tenantUploadParams: UploadParams;
  private proxyReactContext?: AppProxyReactContext;
  private useForgePlugins?: boolean;
  private featureFlags?: MediaFeatureFlags;

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
    this.proxyReactContext = proxyReactContext;
    this.useForgePlugins = useForgePlugins;
    this.featureFlags = featureFlags;

    const userAuthProvider = createPopupUserAuthProvider(
      tenantMediaClient.stargate,
      tenantMediaClient.config,
    );
    const userMediaClient = new MediaClient({
      authProvider: userAuthProvider,
    });
    const tenantUploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };

    this.store = createStore(this, tenantMediaClient, userMediaClient, {
      proxyReactContext,
      singleSelect,
      uploadParams: tenantUploadParams,
      plugins,
      featureFlags,
    });

    this.tenantUploadParams = tenantUploadParams;

    const popup = this.renderPopup();
    if (!popup) {
      return;
    }

    this.container = popup;
    if (container) {
      container.appendChild(popup);
    }
  }

  public async show(): Promise<void> {
    const { dispatch } = this.store;
    dispatch(getFilesInRecents());
    if (this.useForgePlugins) {
      dispatch(getForgePlugins());
    }
    dispatch(showPopup());
  }

  public async cancel(
    uniqueIdentifier?: string | Promise<string>,
  ): Promise<void> {
    if (!uniqueIdentifier) {
      return;
    }
    this.store.dispatch(cancelUpload({ tenantFileId: await uniqueIdentifier }));
  }

  public teardown(): void {
    if (!this.container) {
      return;
    }

    try {
      unmountComponentAtNode(this.container);
      this.container.remove();
    } catch (error) {
      const { dispatch } = this.store;
      dispatch(
        failureErrorLogger({
          error,
          info: '`ChildNode#remove()` polyfill is not available in client',
        }),
      );
    }
  }

  public hide(): void {
    this.store.dispatch(hidePopup());
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.tenantUploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  public emitClosed(): void {
    this.emit('closed', undefined);
  }

  private renderPopup(): HTMLElement | undefined {
    if (!exenv.canUseDOM) {
      return;
    }
    const container = document.createElement('div');

    render(
      <App
        store={this.store}
        proxyReactContext={this.proxyReactContext}
        tenantUploadParams={this.tenantUploadParams}
        useForgePlugins={this.useForgePlugins}
        featureFlags={this.featureFlags}
      />,
      container,
    );
    return container;
  }
}
