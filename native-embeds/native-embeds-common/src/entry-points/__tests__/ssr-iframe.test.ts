import {
	adoptSsrIframe,
	findSsrHostClientId,
	findSsrIframe,
	getSsrEmbedChildClientId,
	getSsrEmbedHostClientId,
	getSsrIframeBridgeIds,
	parkSsrIframe,
	releaseSsrIframe,
	resetSsrIframeRegistryForTests,
	SSR_IFRAME_ATTR,
	SSR_IFRAME_CHILD_ID_ATTR,
	SSR_IFRAME_HOST_ID_ATTR,
} from '../ssr-iframe';

type WithMoveBefore = { moveBefore?: (node: Node, child: Node | null) => void };

const renderSsrIframe = (macroId: string) => {
	const placeholder = document.createElement('div');
	const iframe = document.createElement('iframe');
	iframe.title = 'Embedded whiteboard';
	iframe.setAttribute(SSR_IFRAME_ATTR, macroId);
	iframe.setAttribute(SSR_IFRAME_CHILD_ID_ATTR, getSsrEmbedChildClientId(macroId));
	iframe.setAttribute(SSR_IFRAME_HOST_ID_ATTR, getSsrEmbedHostClientId('123'));
	placeholder.appendChild(iframe);
	document.body.appendChild(placeholder);
	return { placeholder, iframe };
};

describe('ssr-iframe', () => {
	const proto = Element.prototype as unknown as WithMoveBefore;
	const original = proto.moveBefore;

	beforeEach(() => {
		// jsdom has no moveBefore; emulate it with insertBefore (which jsdom does not reload).
		proto.moveBefore = function (this: Element, node: Node, child: Node | null) {
			this.insertBefore(node, child);
		};
	});

	afterEach(() => {
		proto.moveBefore = original;
		resetSsrIframeRegistryForTests();
		document.body.innerHTML = '';
	});

	it('derives deterministic bridge IDs', () => {
		expect(getSsrEmbedChildClientId('m1')).toBe(getSsrEmbedChildClientId('m1'));
		expect(getSsrEmbedHostClientId('42')).toBe('native-embed-ssr-host-42');
	});

	it('finds an SSR iframe in its placeholder and reads its bridge IDs', () => {
		const { iframe } = renderSsrIframe('m1');
		expect(findSsrIframe('m1')).toBe(iframe);
		expect(getSsrIframeBridgeIds(iframe)).toEqual({
			childClientId: getSsrEmbedChildClientId('m1'),
			hostClientId: getSsrEmbedHostClientId('123'),
		});
		expect(findSsrHostClientId()).toBe(getSsrEmbedHostClientId('123'));
	});

	it('parks the iframe outside its placeholder so the placeholder can be removed', () => {
		const { placeholder, iframe } = renderSsrIframe('m1');
		expect(parkSsrIframe('m1', iframe)).toBe(true);
		placeholder.remove();
		expect(iframe.isConnected).toBe(true);
		expect(findSsrIframe('m1')).toBe(iframe);
	});

	it('adopts a parked iframe into the client container and removes the parking slot', () => {
		const { placeholder, iframe } = renderSsrIframe('m1');
		parkSsrIframe('m1', iframe);
		const slot = iframe.parentElement;
		placeholder.remove();

		const container = document.createElement('div');
		document.body.appendChild(container);
		expect(adoptSsrIframe('m1', container)).toBe(iframe);
		expect(iframe.parentElement).toBe(container);
		expect(slot?.isConnected).toBe(false);
	});

	it('does nothing without moveBefore support (iframe would reload)', () => {
		proto.moveBefore = undefined;
		delete proto.moveBefore;
		const { iframe } = renderSsrIframe('m1');
		expect(parkSsrIframe('m1', iframe)).toBe(false);
		expect(adoptSsrIframe('m1', document.createElement('div'))).toBeUndefined();
	});

	it('releases a parked iframe nobody adopted', () => {
		const { placeholder, iframe } = renderSsrIframe('m1');
		parkSsrIframe('m1', iframe);
		placeholder.remove();
		releaseSsrIframe('m1');
		expect(iframe.isConnected).toBe(false);
		expect(findSsrIframe('m1')).toBeUndefined();
	});
});
