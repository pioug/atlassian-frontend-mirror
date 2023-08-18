export const APS_STARGATE_PATH = '/gateway/wss/fps';

/**
 * Reconnect retries need to have a more spread out starting delay,
 * to reduce the chances of reconnect storms as much as possible.
 */
export const reconnectBackoffOptions = () => {
  return {
    delayFirstAttempt: true,
    startingDelay: 500 + Math.random() * 3 * 60 * 1000,
    timeMultiple: 2,
    numOfAttempts: Infinity,
    maxDelay: 60 * 5 * 1000,
  };
};

/**
 * Retries made to establish the first connection can have a shorter
 * starting delay. This will allow the client to fallback to the secondary
 * protocol quickly.
 */
export const firstConnectBackoffOptions = (isFallback: boolean) => {
  return {
    delayFirstAttempt: false,
    startingDelay: 200,
    timeMultiple: 2,
    numOfAttempts: isFallback ? Infinity : 3,
    maxDelay: 60 * 1 * 1000,
  };
};

// "sequenceNumber" is usually obtained from consumed messages. Here, we're getting its value based on the
// timestamp when the connection is established to cover the scenario where zero messages are received as part
// of the connection.
export const getTimestampBasedSequenceNumber = () => {
  return Math.floor(new Date().getTime() / 1000); // timestamp in seconds
};
