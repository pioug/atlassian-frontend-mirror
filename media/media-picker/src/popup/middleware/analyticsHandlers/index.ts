import {
  GasCorePayload,
  GasScreenEventPayload,
  UI_EVENT_TYPE,
  EventType,
} from '@atlaskit/analytics-gas-types';

import handleCloudFetchingEventHandler from './handleCloudFetchingEventHandler';
import editorCloseHandler from './editorCloseHandler';
import editRemoteImageHandler from './editRemoteImageHandler';
import changeServiceHandler from './changeServiceHandler';
import hidePopupHandler from './hidePopupHandler';
import startAuthHandler from './startAuthHandler';
import startFileBrowserHandler from './startFileBrowserHandler';
import fileListUpdateHandler from './fileListUpdateHandler';
import searchGiphyHandler from './searchGiphyHandler';
import editorShowImageHandler from './editorShowImageHandler';
import showPopupHandler from './showPopupHandler';
import failureErrorLoggerHandler from './failureErrorLoggerHandler';

import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
export type BasePayload = GasCorePayload | GasScreenEventPayload;
export type Payload = { action?: string } & BasePayload;
export type HandlerResult = Payload[] | void;
export const buttonClickPayload: GasCorePayload & { action: string } = {
  action: 'clicked',
  actionSubject: 'button',
  eventType: UI_EVENT_TYPE as EventType,
};

export default [
  handleCloudFetchingEventHandler,
  editorCloseHandler,
  editRemoteImageHandler,
  changeServiceHandler,
  hidePopupHandler,
  startAuthHandler,
  startFileBrowserHandler,
  fileListUpdateHandler,
  searchGiphyHandler,
  editorShowImageHandler,
  showPopupHandler,
  failureErrorLoggerHandler,
] as Array<(action: Action, store: MiddlewareAPI<State>) => HandlerResult>;
