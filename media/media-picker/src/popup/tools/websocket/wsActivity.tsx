import { WsMessageData } from './wsMessageData';

export interface WsActivityEvents {
  Started: (activity: WsActivity) => void; // notifies that the activity started
  Completed: (activity: WsActivity) => void; // notifies that the activity finished normally
}

// Represents a piece of work that is done with a websocket.
// If you need to do something with a websocket, you should implement this interface and then
// pass an instance implementing it to a WsConnectionHolder instance.
// When WsConnectionHolder has any activities, it won't close the websocket connection. It closes the connection
// only after all activities have completed.
//
// When some data comes from the websocket, processWebSocketData() is called.
//
// When the connection is lost, connectionLost() is called.
//
// When an activity completes normally, it should emit 'Completed' event.
// The WsConnectionHolder subscribes and unsubscribes from activity events using on() or off() functions.
// Their meaning is the same as for EventEmitter2.
export interface WsActivity {
  processWebSocketData(data: WsMessageData): void; // called when some data comes from the websocket
  connectionLost(): void; // called when the connection is lost, no other activity methods will be called after it

  // These methods are used to subscribe and unsubscribe from activity events (see WsActivityEvents)
  on<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void;
  off<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void;
}
