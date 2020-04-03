import { Auth, isClientBasedAuth } from '@atlaskit/media-core';

import { WsConnectionHolder } from './wsConnectionHolder';

// Helper class that provides a WsConnectionHolder instance for a given client.
export class WsProvider {
  private connectionHolders: { [tag: string]: WsConnectionHolder } = {};

  getWsConnectionHolder(auth: Auth): WsConnectionHolder {
    const tag = WsProvider.mapAuthToTag(auth);
    const stored = this.connectionHolders[tag];
    if (stored) {
      return stored;
    }

    return this.createAndRemember(auth, tag);
  }

  private createAndRemember(auth: Auth, tag: string): WsConnectionHolder {
    const holder = new WsConnectionHolder(auth);
    this.connectionHolders[tag] = holder;

    return holder;
  }

  private static mapAuthToTag(auth: Auth): string {
    if (isClientBasedAuth(auth)) {
      return `${auth.clientId}-${auth.token}`;
    } else {
      return `${auth.asapIssuer}-${auth.token}`;
    }
  }
}
