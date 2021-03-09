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
import { AnalyticsEventPayload } from '../../../types';

export type HandlerResult = Array<AnalyticsEventPayload> | void;

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
