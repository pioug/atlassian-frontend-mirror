import { createSocketIOSocket } from '@atlaskit/collab-provider/socket-io-provider';
import { useEffect } from 'react';
import WebBridgeImpl from '../../../src/editor/native-to-web';

const startCollab = (
  url: string,
  documentAri: string,
  bridge: WebBridgeImpl,
) => {
  const socket = createSocketIOSocket(
    `${url}/session/ari:cloud:confluence:collab-test:blog/${documentAri}`,
  );

  const onSubmitPromise = ({ name, uuid, args }: any) => {
    if (name === 'getCollabConfig') {
      bridge.onPromiseResolved(
        uuid,
        JSON.stringify({ baseUrl: url, documentAri }),
      );
    }
  };

  const onConnect = () => {
    // Convenience
    (socket as any).emitter.onAny((event: string, ...args: any[]) => {
      bridge.onCollabEvent(event, JSON.stringify(args[0]));
    });
    socket.on('connect', () => {
      bridge.onCollabEvent('connect', socket.id);
    });
    socket.connect();
  };

  const onDisconnect = () => {
    socket.close();
  };

  const onChange = ({ event, jsonArgs }: any) => {
    socket.emit(event, JSON.parse(jsonArgs)[0]);
  };

  (window as any).messageHandler.on('emitCollabChanges', onChange);
  (window as any).messageHandler.on('connectToCollabService', onConnect);
  (window as any).messageHandler.on(
    'disconnectFromCollabService',
    onDisconnect,
  );
  (window as any).messageHandler.on('submitPromise', onSubmitPromise);

  return () => {
    socket.close();
  };
};

const useCollab = (bridge: WebBridgeImpl) => {
  useEffect(() => {
    const enabled = isCollabEnabled();
    const params = getParams();
    const documentAri = params.get('documentAri') || 'test-document-editor-hud';
    const collabUrl =
      params.get('collabUrl') ||
      'https://pf-collab-service--app.ap-southeast-2.dev.atl-paas.net/ccollab';

    if (enabled) {
      return startCollab(collabUrl, documentAri, bridge);
    }
  }, [bridge]);
};

const getParams = () => {
  const url = (window.parent || window).document.location.search;
  return new URLSearchParams(url);
};

export const isCollabEnabled = () => getParams().get('collabEnabled');

export default useCollab;
