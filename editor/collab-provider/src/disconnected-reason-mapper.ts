// See https://socket.io/docs/v3/client-socket-instance#disconnect for emitted reasons
export const socketIOReasons = {
  IO_CLIENT_DISCONNECT: 'io client disconnect', // The socket was manually disconnected using socket.disconnect()
  IO_SERVER_DISCONNECT: 'io server disconnect', // The server has forcefully disconnected the socket with socket.disconnect()
  TRANSPORT_CLOSED: 'transport close', // The server did not send a PING within the pingInterval + pingTimeout range
  TRANSPORT_ERROR: 'transport error', // The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)
  PING_TIMEOUT: 'ping timeout', // The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)
};

export enum DisconnectReason {
  CLIENT_DISCONNECT = 'CLIENT_DISCONNECT',
  SERVER_DISCONNECT = 'SERVER_DISCONNECT',
  SOCKET_CLOSED = 'SOCKET_CLOSED',
  SOCKET_ERROR = 'SOCKET_ERROR',
  SOCKET_TIMEOUT = 'SOCKET_TIMEOUT',
  UNKNOWN_DISCONNECT = 'UNKNOWN_DISCONNECT',
}
