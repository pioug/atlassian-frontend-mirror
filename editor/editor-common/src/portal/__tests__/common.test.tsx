import React from 'react';

import { getPortalProviderAPI } from '../common';
import type { PortalManager } from '../PortalManager';

jest.mock('../../core-utils/is-ssr', () => ({
	isSSR: jest.fn(),
}));

jest.mock('../../core-utils/is-ssr-streaming', () => ({
	isSSRStreaming: jest.fn(),
}));

const { isSSR } = jest.requireMock('../../core-utils/is-ssr');
const { isSSRStreaming } = jest.requireMock('../../core-utils/is-ssr-streaming');

function createMockPortalManager(): PortalManager {
	return {
		registerPortal: jest.fn().mockReturnValue(() => {}),
		destroy: jest.fn(),
		getBuckets: jest.fn().mockReturnValue([]),
		registerPortalRenderer: jest.fn(),
		unregisterPortalRenderer: jest.fn(),
	} as unknown as PortalManager;
}

describe('getPortalProviderAPI', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('render() in non-SSR environment', () => {
		beforeEach(() => {
			isSSR.mockReturnValue(false);
			isSSRStreaming.mockReturnValue(false);
		});

		it('creates a portal using createPortal when no onBeforeReactDomRender callback is given', () => {
			const portalManager = createMockPortalManager();
			const api = getPortalProviderAPI(portalManager);

			const container = document.createElement('div');
			document.body.appendChild(container);

			const children = jest.fn().mockReturnValue(<span>content</span>);
			api.render(children, container, 'key-1');

			expect(children).toHaveBeenCalled();
			expect(portalManager.registerPortal).toHaveBeenCalledWith('key-1', expect.anything(), false);

			document.body.removeChild(container);
		});

		it('creates a portal using PortalRenderWrapper when onBeforeReactDomRender callback is given', () => {
			const portalManager = createMockPortalManager();
			const api = getPortalProviderAPI(portalManager);

			const container = document.createElement('div');
			document.body.appendChild(container);

			const children = jest.fn().mockReturnValue(<span>content</span>);
			const onBefore = jest.fn();
			api.render(children, container, 'key-2', onBefore);

			expect(portalManager.registerPortal).toHaveBeenCalledWith('key-2', expect.anything(), false);

			document.body.removeChild(container);
		});
	});

	describe('render() in SSR streaming environment', () => {
		beforeEach(() => {
			isSSR.mockReturnValue(true);
			isSSRStreaming.mockReturnValue(true);
		});

		it('sets container.innerHTML and does NOT call portalManager.registerPortal', () => {
			const portalManager = createMockPortalManager();
			const api = getPortalProviderAPI(portalManager);

			const container = document.createElement('div');

			const children = jest.fn().mockReturnValue(<span>ssr-content</span>);
			api.render(children, container, 'key-ssr');

			// In SSR mode renderComponentHTML returns '' because process.env.REACT_SSR is not set in jest
			expect(container.innerHTML).toBe('');
			expect(portalManager.registerPortal).not.toHaveBeenCalled();
		});
	});

	describe('remove()', () => {
		it('calls the portal disposer and removes from map in non-SSR mode', () => {
			isSSR.mockReturnValue(false);
			isSSRStreaming.mockReturnValue(false);

			const disposer = jest.fn();
			const portalManager = createMockPortalManager();
			(portalManager.registerPortal as jest.Mock).mockReturnValue(disposer);

			const api = getPortalProviderAPI(portalManager);
			const container = document.createElement('div');
			document.body.appendChild(container);

			const children = jest.fn().mockReturnValue(<span>x</span>);
			api.render(children, container, 'key-remove');
			api.remove('key-remove');

			expect(disposer).toHaveBeenCalled();

			document.body.removeChild(container);
		});

		it('does nothing (returns early) in SSR streaming mode', () => {
			isSSR.mockReturnValue(true);
			isSSRStreaming.mockReturnValue(true);

			const disposer = jest.fn();
			const portalManager = createMockPortalManager();
			(portalManager.registerPortal as jest.Mock).mockReturnValue(disposer);

			const api = getPortalProviderAPI(portalManager);
			const container = document.createElement('div');

			const children = jest.fn().mockReturnValue(<span>x</span>);
			api.render(children, container, 'key-ssr-remove');

			api.remove('key-ssr-remove');

			expect(disposer).not.toHaveBeenCalled();
		});
	});

	describe('destroy()', () => {
		it('clears portals and calls portalManager.destroy', () => {
			isSSR.mockReturnValue(false);
			isSSRStreaming.mockReturnValue(false);

			const portalManager = createMockPortalManager();
			const api = getPortalProviderAPI(portalManager);

			api.destroy();

			expect(portalManager.destroy).toHaveBeenCalled();
		});
	});
});
