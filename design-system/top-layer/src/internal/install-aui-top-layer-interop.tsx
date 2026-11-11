import { bind } from 'bind-event-listener';

/**
 * AUI (Atlassian User Interface) is the legacy UI library built on jQuery and exposed
 * through window.AJS. Its document Escape handler calls preventDefault even with no open layer. This
 * prevents the browser from dismissing native popovers, including top-layer tooltips.
 *
 * Skip that one AUI callback when its layer stack is empty. Other keyboard handlers
 * still run normally and can still cancel the event.
 */
// Share initialization across separately loaded copies of this module.
const initializationMarker = Symbol.for('@atlaskit/top-layer/install-aui-top-layer-interop');

type TLegacyEvent = { keyCode?: number };
type TLegacyHandler = ((this: unknown, event: TLegacyEvent, ...args: unknown[]) => unknown) & {
	guid?: number;
};
type TRegistration = { handler: TLegacyHandler; selector?: unknown };
type TAuiWindow = Window & {
	AJS?: {
		$?: { _data?: (element: Document, key: string) => { keydown?: unknown } | undefined };
		LayerManager?: { global?: { getTopLayer?: () => unknown } };
	};
};

function isAuiEscapeRegistration(value: unknown): value is TRegistration {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const registration = value as TRegistration;

	// AUI listens on document itself. A selector would target matching child elements instead.
	if (registration.selector !== undefined || typeof registration.handler !== 'function') {
		return false;
	}

	// AUI does not export its Escape callback, so this fingerprint is a heuristic.
	// It matches Jira's AUI 6.0.5 and Confluence's 7.10.6. These property names survive
	// local-variable minification.
	const source = Function.prototype.toString.call(registration.handler);

	return (
		source.includes('popUntilTopPersistent') &&
		source.includes('preventDefault') &&
		source.includes('keyCode') &&
		source.includes('ESCAPE')
	);
}

function tryPatchAuiEscapeHandler({
	ownerDocument,
}: {
	ownerDocument: Document;
}): 'not-ready' | 'patched' | 'unsupported' {
	try {
		const ownerWindow = ownerDocument.defaultView as TAuiWindow | null;
		const jquery = ownerWindow?.AJS?.$;
		const manager = ownerWindow?.AJS?.LayerManager?.global;
		const getTopLayer = manager?.getTopLayer;

		if (typeof jquery?._data !== 'function' || typeof getTopLayer !== 'function') {
			return 'not-ready';
		}

		// AUI registers its Escape handler before exposing LayerManager.global. Once these
		// APIs exist, an incompatible handler should be left alone without further retries.

		// jQuery's private event registry contains the callback and its listener metadata.
		// It lets us replace AUI's callback without removing other document keydown handlers.
		const handlers = jquery._data(ownerDocument, 'events')?.keydown;

		if (!Array.isArray(handlers)) {
			return 'unsupported';
		}

		const matches = handlers.filter(isAuiEscapeRegistration);

		// If we cannot identify the callback uniquely, leave every handler unchanged.
		if (matches.length !== 1) {
			return 'unsupported';
		}

		const registration = matches[0];
		const original = registration.handler;

		// Only replace a normal, writable property. Do not invoke a custom setter or write
		// into a frozen registration.
		const descriptor = Object.getOwnPropertyDescriptor(registration, 'handler');

		if (!descriptor?.writable) {
			return 'unsupported';
		}

		/**
		 * The original callback still refers to the AUI instance it was created with. Only
		 * trust that same instance and method when deciding whether it has anything to close.
		 * AUI returns null for an empty stack; an unexpected value such as undefined must
		 * preserve its original behavior rather than being treated as an empty stack.
		 */
		const wrapped: TLegacyHandler = function wrapped(this: unknown, event, ...args) {
			try {
				if (
					event.keyCode === 27 &&
					ownerWindow?.AJS?.$ === jquery &&
					ownerWindow?.AJS?.LayerManager?.global === manager &&
					manager?.getTopLayer === getTopLayer &&
					getTopLayer.call(manager) === null
				) {
					return;
				}
			} catch {
				// A changed or unavailable legacy API must retain AUI's existing behavior.
			}

			// Keep this outside the catch: original errors must propagate without a second call.
			return original.call(this, event, ...args);
		};

		// Keep the callback's guid for compatibility with code that reads it. jQuery's .off()
		// uses the registration's own guid, which is preserved by replacing only its handler.
		wrapped.guid = original.guid;
		registration.handler = wrapped;

		return 'patched';
	} catch {
		// Missing, ambiguous or incompatible AUI/jQuery internals leave the handler unchanged.
		return 'unsupported';
	}
}

/**
 * Called by gated product bootstrap. One setup per document lasts for the page lifetime,
 * so repeated initialization does not install competing wrappers.
 * If AUI is not ready, one listener retries on Escape. Once AUI is available, retries stop
 * whether the patch succeeds or the handler is unsupported.
 */
export function installAuiTopLayerInterop(document: Document | null): void {
	if (!document || initializationMarker in document) {
		return;
	}

	// Repeated bootstrap calls must reuse this setup even while AUI is still loading.
	try {
		Object.defineProperty(document, initializationMarker, { value: true });
	} catch {
		// If the document cannot hold our marker, leave AUI unchanged.
		return;
	}

	if (tryPatchAuiEscapeHandler({ ownerDocument: document }) !== 'not-ready') {
		return;
	}

	const stopRetrying = bind(document, {
		type: 'keydown',
		listener(event) {
			if (event.key !== 'Escape' && event.keyCode !== 27) {
				return;
			}

			// Capture runs before jQuery collects callbacks to invoke during bubbling.
			// Installing here lets this same Escape event use the replacement callback.
			if (tryPatchAuiEscapeHandler({ ownerDocument: document }) !== 'not-ready') {
				// AUI is available; a successful patch or an unsupported handler ends retries.
				stopRetrying();
			}
		},
		options: { capture: true },
	});
}
