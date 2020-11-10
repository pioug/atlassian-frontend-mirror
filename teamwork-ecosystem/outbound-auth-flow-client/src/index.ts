import { AuthError } from './error';
import { isOfTypeAuthError } from './types';

export function auth(startUrl: string, windowFeatures?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let authWindow: Window | null = null;
    let authWindowInterval: number;

    const handleAuthWindowMessage = (event: MessageEvent) => {
      if (event.source !== authWindow) {
        return;
      }
      const { data } = event;
      if (typeof data !== 'object') {
        return;
      }

      switch (data.type) {
        case 'outbound-auth:success':
          finish();
          resolve();
          break;

        case 'outbound-auth:failure':
          finish();
          const errorType = data.errorType.toLowerCase();
          if (isOfTypeAuthError(errorType)) {
            reject(new AuthError(data.message, errorType));
          } else {
            reject(new AuthError(data.message));
          }
          break;
      }
    };

    const handleAuthWindowInterval = () => {
      if (authWindow && authWindow.closed) {
        finish();
        reject(
          new AuthError('The auth window was closed', 'auth_window_closed'),
        );
      }
    };

    const start = () => {
      window.addEventListener('message', handleAuthWindowMessage);
      authWindow = window.open(startUrl, startUrl, windowFeatures);
      authWindowInterval = window.setInterval(handleAuthWindowInterval, 500);
    };

    const finish = () => {
      clearInterval(authWindowInterval);
      window.removeEventListener('message', handleAuthWindowMessage);
      if (authWindow) {
        authWindow.close();
        authWindow = null;
      }
    };

    start();
  });
}

export { AuthError } from './error';
