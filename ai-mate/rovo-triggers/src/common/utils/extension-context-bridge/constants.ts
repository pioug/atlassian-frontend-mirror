/**
 * Feature gate for the extension context bridge; both Host and Client self-gate on it.
 * `fg()` requires a static literal, so call sites inline this value rather than importing it;
 * tests resolve the gate through this constant so the two cannot drift apart.
 */
export const BRIDGE_FEATURE_GATE = 'rovo-ext_context_bridge';

/** Marker on every bridge `postMessage`, so listeners can ignore unrelated messages. */
export const BRIDGE_MESSAGE_MARKER = '__rovoExtContextBridge' as const;

/** Read context flows product -> extension; actions flow extension -> product. */
export const BRIDGE_TO_EXTENSION = 'to-extension' as const;
export const BRIDGE_TO_PRODUCT = 'to-product' as const;

/** Loop-guard sentinel stamped on re-published payloads so they never ping-pong. */
export const BRIDGE_SOURCE = 'rovo-extension-bridge' as const;

/**
 * Control-plane message asking the product to re-send the context it last relayed.
 *
 * Carries no data and is not a bus payload, so it deliberately bypasses the relay allow/deny lists
 * in `./policy` — there is nothing in it to inject. The Host answers by re-sending what it already
 * sent once; a request can never make it relay something the policy would have dropped.
 */
export const BRIDGE_CONTROL_REQUEST_CONTEXT = 'request-context' as const;
