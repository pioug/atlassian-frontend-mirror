import { Server, WebSocket } from 'mock-socket';
import { Database } from 'kakapo';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators/delay';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { concatMap } from 'rxjs/operators/concatMap';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import uuid from 'uuid/v4';

import {
  notifyMetadataPayload,
  remoteUploadStartPayload,
  remoteUploadProgressPayload,
  remoteUploadEndPayload,
} from './messages';

import { WebSocketServer } from './types';
import { createCollectionItem, MediaDatabaseSchema } from '../database';
import { defaultBaseUrl } from '../../mediaClientProvider';
import { smallImage } from '../../dataURIs/smallImageURI';
import { getWsUrl, mapDataUriToBlob } from '../../utils';
import { WsDirection, logWsMessage } from '../../utils/logging';
import { getFakeFileSize } from '../../utils/mockData';

const DELAY_MESSAGS_MS = 200;
const DELAY_MESSAGES_SLOW_MS = 1000;
const DELAY_MESSAGES_VARIATION = 500;

type WsMessage = any & {
  type: string;
};

/**
 * Returns an Observable emitting messages coming from a mocked websocket server.
 * Only listens to the latest connection and maps all non-empty messages to JSON.
 *
 * @param wsServer Server
 * @returns Observable emitting websocket messages (referencing the currently active socket)
 */
function getUpstreamMessages(
  wsServer: Server,
): Observable<{ socket: WebSocket; message: WsMessage }> {
  return Observable.create((observer: Observer<WebSocket>) =>
    wsServer.on('connection', (socket: WebSocket) => observer.next(socket)),
  ).pipe(
    switchMap((socket: WebSocket) =>
      Observable.create(
        (observer: Observer<string | Blob | ArrayBuffer | ArrayBufferView>) =>
          socket.on(
            'message',
            (data: string | Blob | ArrayBuffer | ArrayBufferView) =>
              observer.next(data),
          ),
      ).pipe(
        // ignore empty messages
        filter((data: any) => typeof data === 'string' && data.length > 0),
        // parse messages as JSON
        map((data: string) => ({ socket, message: JSON.parse(data) })),
      ),
    ),
  );
}

function createUserFile(
  database: Database<MediaDatabaseSchema>,
  fileId: string,
  name: string,
  collection: string,
) {
  database.push(
    'collectionItem',
    // backend initially creates cloud files
    // having mediaType=unknown and mimeType=binary/octet-stream
    createCollectionItem({
      name,
      mediaType: 'unknown',
      mimeType: 'binary/octet-stream',
      collectionName: collection,
      blob: mapDataUriToBlob(smallImage),
      id: fileId,
      processingStatus: 'pending',
    }),
  );
}

function sendDownstreamMessage(
  wsUrl: string,
  socket: WebSocket,
  database: Database<MediaDatabaseSchema>,
  message: WsMessage,
): void {
  const { type, ...payload } = message;

  // logs every message in console
  logWsMessage({
    url: wsUrl,
    dir: WsDirection.Downstream,
    type,
    payload,
    database,
  });

  socket.send(JSON.stringify(message));
}

/**
 * Given an Observable of websocket upstream messages, generates the corresponding downstream messages as follow:
 * 1. NotifyMetadata
 * 2. RemoteUploadStart
 * 3. RemoteUploadProgress
 * 4. RemoteUploadEnd
 *
 * Induces a small delay (on avg. DELAY_MESSAGS_MS or DELAY_MESSAGES_SLOW_MS) between each message.
 *
 * @param wsUrl URL of the websocket server
 * @param database Kakapo database
 * @param isSlowServer boolean to set to true to simulate a slower websocket server
 */
function generateDownstreamMessages(
  wsUrl: string,
  database: Database<MediaDatabaseSchema>,
  isSlowServer?: boolean,
) {
  const delayMessages = isSlowServer
    ? DELAY_MESSAGES_SLOW_MS
    : DELAY_MESSAGS_MS;

  return (messages: Observable<{ socket: WebSocket; message: WsMessage }>) =>
    messages.pipe(
      filter(({ message: { type } }) => type === 'fetchFile'),
      mergeMap(({ socket, message }) => {
        const {
          params: { fileName, collection, jobId: tenantFileId },
        } = message;

        const userFileId = uuid();
        const fileSize = getFakeFileSize();

        // create user file in database
        createUserFile(database, userFileId, fileName, collection);

        return from([
          notifyMetadataPayload(tenantFileId, fileSize),
          remoteUploadStartPayload(tenantFileId),
          remoteUploadProgressPayload(tenantFileId, fileSize),
          remoteUploadEndPayload(tenantFileId, userFileId),
        ]).pipe(
          concatMap((message) =>
            of(message).pipe(
              tap((message) =>
                sendDownstreamMessage(wsUrl, socket, database, message),
              ),
              delay(delayMessages + Math.random() * DELAY_MESSAGES_VARIATION),
            ),
          ),
        );
      }),
    );
}

export type RemoteUploadActivityServerParams = {
  database: Database<MediaDatabaseSchema>;
  isSlowServer?: boolean;
};

export class RemoteUploadActivityServer implements WebSocketServer {
  private wsServer: Server;
  private msgSubscription: Subscription;

  constructor(params: RemoteUploadActivityServerParams) {
    const { database, isSlowServer } = params;
    const wsUrl = getWsUrl(defaultBaseUrl, '/picker/ws/');

    this.wsServer = new Server(wsUrl);
    this.msgSubscription = getUpstreamMessages(this.wsServer)
      .pipe(
        tap(({ message: { type, ...payload } }) =>
          logWsMessage({
            url: wsUrl,
            dir: WsDirection.Upstream,
            type,
            payload,
            database,
          }),
        ),
        generateDownstreamMessages(wsUrl, database, isSlowServer),
      )
      .subscribe();
  }

  start() {
    this.wsServer.start();
  }

  stop() {
    this.msgSubscription.unsubscribe();
    this.wsServer.stop();
  }
}
