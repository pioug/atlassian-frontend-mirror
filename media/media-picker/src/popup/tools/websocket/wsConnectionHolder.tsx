import { Auth } from '@atlaskit/media-core';
import { WsConnection } from './wsConnection';
import { WsActivity } from './wsActivity';
import { WsMessageData } from './wsMessageData';

// Responsible for creating a websocket connection when necessary and holding it until all activities are finished
export class WsConnectionHolder {
  private wsConnection?: WsConnection;
  private activities: Array<WsActivity> = [];

  constructor(private readonly auth: Auth) {}

  openConnection(activity: WsActivity): void {
    activity.on('Completed', this.onActivityCompleted);
    this.activities.push(activity);

    if (!this.wsConnection) {
      this.wsConnection = new WsConnection(
        this.auth,
        this.onWebSocketDataReceived,
        this.onConnectionLost,
      );
    }
  }

  send(data: any) {
    if (!this.wsConnection) {
      throw new Error('WebSocket connection has been closed');
    }
    this.wsConnection.send(data);
  }

  private onActivityCompleted = (activity: WsActivity) => {
    const index = this.activities.indexOf(activity);
    if (index !== -1) {
      this.activities.splice(index, 1);
    }

    // Where we don't have any activities left, we should close the connection
    if (this.activities.length === 0 && this.wsConnection) {
      this.closeConnection();
    }
  };

  private onWebSocketDataReceived = (data: WsMessageData) => {
    this.activities.forEach((activity) => {
      activity.processWebSocketData(data);
    });
  };

  private onConnectionLost = () => {
    this.closeConnection();
  };

  private closeConnection(): void {
    this.activities.forEach((activity) => {
      activity.off('Completed', this.onActivityCompleted);
      activity.connectionLost();
    });

    this.activities = [];

    if (this.wsConnection) {
      this.wsConnection.teardown();
      this.wsConnection = undefined;
    }
  }
}
