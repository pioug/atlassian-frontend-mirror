import React, { createRef } from 'react';

import { bind } from 'bind-event-listener';

import { installAuiTopLayerInterop } from '@atlaskit/top-layer/install-aui-top-layer-interop';
import { act, render } from '@atlassian/testing-library/testing-library/react';

type THandler = ((event: KeyboardEvent) => unknown) & { guid?: number };

const originalAjs = Object.getOwnPropertyDescriptor(window, 'AJS');
const cleanups: (() => unknown)[] = [];
let ownerDocument: Document;

function createTestDocument() {
	const frame = createRef<HTMLIFrameElement>();
	render(<iframe ref={frame} title="AUI test document" />);
	const frameDocument = frame.current?.contentDocument;
	if (!frameDocument) {
		throw new Error('Expected an iframe document');
	}
	return frameDocument;
}

beforeEach(() => {
	// Each test gets a page lifetime of its own without resetting modules or adding a reset API.
	ownerDocument = createTestDocument();
});

function setAui(value: unknown) {
	const legacyWindow = ownerDocument.defaultView;
	if (!legacyWindow) {
		throw new Error('Expected an AUI window');
	}
	Object.defineProperty(legacyWindow, 'AJS', { value, configurable: true, writable: true });
}

function installFakeAui({
	format = 'normal',
}: {
	format?: 'normal' | 'minified' | 'early-return';
} = {}) {
	const legacyDocument = ownerDocument;
	const LayerManager = {
		global: {
			getTopLayer: jest.fn<unknown, []>(() => null),
			popUntilTopPersistent: jest.fn(),
		},
	};
	const body = {
		minified:
			'return function(a){a.keyCode===keyCodes.ESCAPE&&(LayerManager.global.popUntilTopPersistent(),a.preventDefault())}',
		normal: `return function(event) {
			if (event.keyCode === keyCodes.ESCAPE) {
				LayerManager.global.popUntilTopPersistent();
				event.preventDefault();
			}
		}`,
		'early-return': `return function(event) {
			if (event.keyCode !== keyCodes.ESCAPE) { return; }
			LayerManager.global.popUntilTopPersistent();
			event.preventDefault();
		}`,
	}[format];
	// Build from source so the tests exercise different function text, including minification.
	// eslint-disable-next-line no-new-func
	const original = new Function('LayerManager', 'keyCodes', body)(LayerManager, {
		ESCAPE: 27,
	}) as THandler;
	original.guid = 17;
	const registration = { handler: original };
	const handlers: { handler: THandler; selector?: string }[] = [registration];
	const jquery = {
		_data: jest.fn<{ keydown: unknown }, [Document, string]>(() => ({ keydown: handlers })),
	};
	const aui = { $: jquery, LayerManager };
	setAui(aui);

	// Like jQuery, snapshot registrations in its document-bubble dispatcher, after capture.
	cleanups.push(
		bind(legacyDocument, {
			type: 'keydown',
			listener(event) {
				handlers.slice().forEach(({ handler }) => handler.call(legacyDocument, event));
			},
		}),
	);
	return { aui, handlers, registration, original, jquery, manager: LayerManager.global };
}

function initialize() {
	installAuiTopLayerInterop(ownerDocument);
}

function dispatchKeydown({
	key = 'Escape',
	keyCode = 27,
	document: eventDocument = ownerDocument,
}: { key?: string; keyCode?: number; document?: Document } = {}) {
	const event = new KeyboardEvent('keydown', { key, keyCode, bubbles: true, cancelable: true });
	act(() => {
		eventDocument.body.dispatchEvent(event);
	});
	return event;
}

afterEach(() => {
	cleanups.splice(0).forEach((cleanup) => cleanup());
	if (originalAjs) {
		Object.defineProperty(window, 'AJS', originalAjs);
	} else {
		Reflect.deleteProperty(window, 'AJS');
	}
});

it.each(['normal', 'minified', 'early-return'] as const)(
	'does not cancel Escape for the %s handler when AUI has no layers',
	(format) => {
		const { registration, original, manager, jquery } = installFakeAui({ format });
		initialize();

		expect(registration.handler).not.toBe(original);
		expect(registration.handler.guid).toBe(original.guid);
		expect(dispatchKeydown().defaultPrevented).toBe(false);
		expect(manager.popUntilTopPersistent).not.toHaveBeenCalled();

		const installedHandler = registration.handler;
		initialize();
		expect(registration.handler).toBe(installedHandler);
		expect(jquery._data).toHaveBeenCalledTimes(1);
	},
);

it('reuses initialization marked by another copy of the module', () => {
	const { jquery, registration, original } = installFakeAui();
	Object.defineProperty(
		ownerDocument,
		Symbol.for('@atlaskit/top-layer/install-aui-top-layer-interop'),
		{
			value: true,
		},
	);
	const addListener = jest.spyOn(ownerDocument, 'addEventListener');
	cleanups.push(() => addListener.mockRestore());

	initialize();

	expect(jquery._data).not.toHaveBeenCalled();
	expect(registration.handler).toBe(original);
	expect(addListener).not.toHaveBeenCalled();
});

it.each([{}, undefined, false, { length: 0 }])(
	'preserves AUI dismissal unless its empty-stack result is null (%s)',
	(topLayer) => {
		const { manager } = installFakeAui();
		manager.getTopLayer.mockReturnValue(topLayer);
		initialize();
		expect(dispatchKeydown().defaultPrevented).toBe(true);
		expect(manager.popUntilTopPersistent).toHaveBeenCalledTimes(1);
	},
);

it('leaves non-Escape handlers and registration order unchanged', () => {
	const { handlers, registration, manager } = installFakeAui();
	const before = { handler: jest.fn() };
	const after = { handler: jest.fn() };
	handlers.unshift(before);
	handlers.push(after);
	initialize();
	expect(dispatchKeydown({ key: 'Enter', keyCode: 13 }).defaultPrevented).toBe(false);
	expect(manager.getTopLayer).not.toHaveBeenCalled();
	expect(handlers).toEqual([before, registration, after]);
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	expect(before.handler).toHaveBeenCalledTimes(2);
	expect(after.handler).toHaveBeenCalledTimes(2);
});

it('preserves cancellation by an unrelated handler', () => {
	const { handlers } = installFakeAui();
	handlers.push({ handler: (event) => event.preventDefault() });
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
});

it('patches AUI loaded after initialization before the first Escape reaches its dispatcher', () => {
	setAui(undefined);
	initialize();
	const { manager } = installFakeAui();
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	expect(manager.popUntilTopPersistent).not.toHaveBeenCalled();
});

it('leaves an incompatible jQuery event registry untouched', () => {
	const { registration, original, jquery } = installFakeAui();
	jquery._data.mockReturnValue({ keydown: null });
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(jquery._data).toHaveBeenCalledTimes(1);
});

it('leaves AUI unchanged when its exposed layer manager is missing', () => {
	const { aui, registration, original } = installFakeAui();
	setAui({ ...aui, LayerManager: undefined });
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
});

it('leaves multiple matching handlers untouched', () => {
	const { handlers, original, registration } = installFakeAui();
	handlers.push({ handler: original });
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
});

it('leaves an unrelated Escape handler unchanged', () => {
	const { handlers, registration, original } = installFakeAui();
	const extraWork = jest.fn();
	const keyCodes = { ESCAPE: 27 };
	function unrelated(event: KeyboardEvent) {
		if (event.keyCode === keyCodes.ESCAPE) {
			extraWork();
			event.preventDefault();
		}
	}
	const unrelatedRegistration = { handler: unrelated };
	handlers.push(unrelatedRegistration);
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(extraWork).toHaveBeenCalledTimes(1);
	expect(unrelatedRegistration.handler).toBe(unrelated);
	expect(registration.handler).not.toBe(original);
});

it('does not change a delegated registration', () => {
	const { registration, handlers, original } = installFakeAui();
	handlers[0].selector = '.legacy-control';
	initialize();
	expect(registration.handler).toBe(original);
	expect(dispatchKeydown().defaultPrevented).toBe(true);
});

it('does not change a frozen registration', () => {
	const { registration, original } = installFakeAui();
	Object.freeze(registration);
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
});

it('falls back to the original handler when the stack lookup throws', () => {
	const { manager } = installFakeAui();
	manager.getTopLayer.mockImplementation(() => {
		throw new Error('legacy lookup failed');
	});
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(manager.popUntilTopPersistent).toHaveBeenCalledTimes(1);
});

it('retains original behavior if the exposed AUI manager changes', () => {
	const { aui, manager } = installFakeAui();
	initialize();
	setAui({ ...aui, LayerManager: { global: { getTopLayer: () => null } } });
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(manager.popUntilTopPersistent).toHaveBeenCalledTimes(1);
});

it('retains original behavior if a legacy global getter throws', () => {
	const { registration, original } = installFakeAui();
	Object.defineProperty(ownerDocument.defaultView, 'AJS', {
		configurable: true,
		get() {
			throw new Error('AUI unavailable');
		},
	});
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
});

it('propagates original errors without invoking it again', () => {
	const { manager, registration } = installFakeAui();
	manager.getTopLayer.mockReturnValue({});
	const error = new Error('original handler failed');
	manager.popUntilTopPersistent.mockImplementation(() => {
		throw error;
	});
	initialize();
	expect(() => registration.handler(new KeyboardEvent('keydown', { keyCode: 27 }))).toThrow(error);
	expect(manager.popUntilTopPersistent).toHaveBeenCalledTimes(1);
});

it('does not overwrite a later third-party wrapper during repeated initialization', () => {
	const { registration, manager } = installFakeAui();
	initialize();
	const retained = registration.handler;
	const thirdParty: THandler = (event) => retained(event);
	registration.handler = thirdParty;
	initialize();
	expect(registration.handler).toBe(thirdParty);
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	manager.getTopLayer.mockReturnValue({});
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(manager.popUntilTopPersistent).toHaveBeenCalledTimes(1);
});

it('shares one retry listener per document and removes it after AUI loads', () => {
	const addListener = jest.spyOn(ownerDocument, 'addEventListener');
	const removeListener = jest.spyOn(ownerDocument, 'removeEventListener');
	cleanups.push(
		() => addListener.mockRestore(),
		() => removeListener.mockRestore(),
	);
	initialize();
	initialize();
	expect(addListener).toHaveBeenCalledTimes(1);
	expect(addListener).toHaveBeenCalledWith('keydown', expect.any(Function), { capture: true });

	const { jquery } = installFakeAui();
	expect(dispatchKeydown({ key: 'Enter', keyCode: 13 }).defaultPrevented).toBe(false);
	expect(jquery._data).not.toHaveBeenCalled();
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function), { capture: true });
	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	expect(jquery._data).toHaveBeenCalledTimes(1);
});

it('stops retrying when AUI loads with an ambiguous handler', () => {
	setAui(undefined);
	const removeListener = jest.spyOn(ownerDocument, 'removeEventListener');
	cleanups.push(() => removeListener.mockRestore());
	initialize();

	const { handlers, original, registration, jquery } = installFakeAui();
	handlers.push({ handler: original });
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(registration.handler).toBe(original);
	expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function), { capture: true });

	initialize();
	expect(dispatchKeydown().defaultPrevented).toBe(true);
	expect(jquery._data).toHaveBeenCalledTimes(1);
});

it('initializes separate documents independently', () => {
	const firstDocument = ownerDocument;
	const first = installFakeAui();
	initialize();
	ownerDocument = createTestDocument();
	const second = installFakeAui();
	initialize();
	expect(dispatchKeydown({ document: firstDocument }).defaultPrevented).toBe(false);
	expect(dispatchKeydown().defaultPrevented).toBe(false);
	expect(first.jquery._data).toHaveBeenCalledWith(firstDocument, 'events');
	expect(second.jquery._data).toHaveBeenCalledWith(ownerDocument, 'events');
});

it('does nothing when there is no browser document', () => {
	const { jquery } = installFakeAui();
	installAuiTopLayerInterop(null);
	expect(jquery._data).not.toHaveBeenCalled();
});
