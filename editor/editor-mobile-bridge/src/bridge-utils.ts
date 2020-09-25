import { IS_DEV, IS_TEST } from './utils';

/**
 * Send an event to which ever bridge it can find.
 * @param bridgeName {string} bridge name
 * @param eventName {string} event name
 * @param props {object} arguments passed
 *
 * For this to work on both bridges their interfaces need to match.
 *
 * We have two main identifiers we use, bridgeName and eventName.
 * For iOS this looks like:
 *  window.webkit.messageHandlers.<bridgeName>.postMessage({
 *    name: eventName,
 *    ...<props>
 *  })
 *
 * And for Android:
 * Props object is spread as args.
 *  window.<bridgeName>.<eventName>(...<props>)
 */
export function sendToBridge<K extends CombinedBridgeNames>(
  bridgeName: K,
  eventName: BridgeEventName<K>,
  props = {},
) {
  if (window.webkit) {
    // iOS implementation
    const bridge = window.webkit.messageHandlers[bridgeName];
    if (bridge) {
      bridge.postMessage({ name: eventName, ...props });
    }
  } else {
    // Android implementation
    const bridge = window[bridgeName];
    if (bridge && eventName in bridge) {
      const args = Object.values(props);

      try {
        // @ts-ignore
        bridge[eventName](...args);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(
          `Could not call ${bridgeName}.${eventName}() with args: ${JSON.stringify(
            args,
          )}`,
        );
      }
    }
  }

  if (IS_DEV || IS_TEST) {
    // Expose a log of `call` invocations for testing
    // via packages/editor/editor-mobile-bridge/src/__tests__/integration/_utils.ts
    // - getBridgeOutput
    const logs = window.logBridge;
    if (logs) {
      const logName = `${bridgeName}:${eventName}`;
      logs[logName] = logs[logName] || [];
      logs[logName] = logs[logName].concat(props);
    }
  }
}
