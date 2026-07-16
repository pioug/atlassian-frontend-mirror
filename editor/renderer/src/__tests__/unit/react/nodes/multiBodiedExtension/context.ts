import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import {
	getExtensionModuleNodePrivateProps,
	getNodeRenderer,
} from '@atlaskit/editor-common/extensions';
import { useProvider } from '@atlaskit/editor-common/provider-factory';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import { useMultiBodiedExtensionContext } from '../../../../../react/nodes/multiBodiedExtension/context';

jest.mock('memoize-one', () => jest.fn((fn) => fn));

jest.mock('@atlaskit/editor-common/extensions', () => ({
	...jest.requireActual('@atlaskit/editor-common/extensions'),
	ExtensionProvider: jest.fn(),
	getExtensionModuleNodePrivateProps: jest.fn(),
	getNodeRenderer: jest.fn(),
}));

jest.mock('@atlaskit/editor-common/provider-factory', () => ({
	...jest.requireActual('@atlaskit/editor-common/provider-factory'),
	useProvider: jest.fn(),
}));

describe('useMultiBodiedExtensionContext', () => {
	const extensionType = 'testType';
	const extensionKey = 'testKey';
	const node = {
		type: 'multiBodiedExtension' as const,
		extensionType,
		extensionKey,
	};
	const rendererContext = {
		adDoc: {
			type: 'doc',
			version: 1,
			content: [],
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return loading true if provider is not resolved yet', () => {
		(useProvider as jest.Mock).mockReturnValue(new Promise(() => {}));

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.extensionContext).toBeNull();
	});

	it('should return loading true if private props are not resolved yet', async () => {
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockReturnValue(new Promise(() => {}));

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);
		await waitFor(() => {
			expect(result.current.loading).toBe(true);
			expect(result.current.extensionContext).toBeNull();
		});
	});

	it('should return loading true if NodeRenderer is not resolved yet', async () => {
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockResolvedValue(Promise.resolve({}));
		(getNodeRenderer as jest.Mock).mockReturnValue(null);

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);
		await waitFor(() => {
			expect(result.current.loading).toBe(true);
			expect(result.current.extensionContext).toBeNull();
		});
	});

	it('should return correct context when all dependencies are resolved', async () => {
		const mockPrivateProps = { __allowBodiedOverride: true };
		const mockNodeRenderer = jest.fn();
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockReturnValue(
			Promise.resolve(mockPrivateProps),
		);
		(getNodeRenderer as jest.Mock).mockReturnValue(mockNodeRenderer);

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.extensionContext).toEqual({
				NodeRenderer: mockNodeRenderer,
				privateProps: mockPrivateProps,
			});
		});
	});

	it('should return extension handler renderer before resolving provider renderer when the native tabs gate is on', () => {
		setupEditorExperiments('test', { confluence_native_tabs_experiment: true });
		const extensionHandler = jest.fn(() =>
			React.createElement('div', null, 'Extension handler result'),
		);
		(useProvider as jest.Mock).mockReturnValue(new Promise(() => {}));

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({
				extensionHandlers: {
					[extensionType]: extensionHandler,
				},
				extensionType,
				extensionKey,
			}),
		);

		const NodeRenderer = result.current.extensionContext?.NodeRenderer;

		expect(result.current.loading).toBe(false);
		expect(result.current.extensionContext?.privateProps).toEqual({
			__allowBodiedOverride: true,
		});
		expect(NodeRenderer).toBeDefined();
		const HandlerRenderer = NodeRenderer as React.FunctionComponent<{
			doc: typeof rendererContext.adDoc;
			node: typeof node;
		}>;
		HandlerRenderer({ node, doc: rendererContext.adDoc });
		expect(extensionHandler).toHaveBeenCalledWith(node, rendererContext.adDoc, undefined);
		expect(getNodeRenderer).not.toHaveBeenCalled();
	});

	it('should use provider renderer when extension handler is available but the native tabs gate is off', async () => {
		setupEditorExperiments('test', { confluence_native_tabs_experiment: false });
		const mockPrivateProps = { __allowBodiedOverride: false };
		const mockNodeRenderer = jest.fn();
		const extensionHandler = jest.fn(() =>
			React.createElement('div', null, 'Extension handler result'),
		);
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockReturnValue(
			Promise.resolve(mockPrivateProps),
		);
		(getNodeRenderer as jest.Mock).mockReturnValue(mockNodeRenderer);

		const { result } = renderHook(() =>
			useMultiBodiedExtensionContext({
				extensionHandlers: {
					[extensionType]: extensionHandler,
				},
				extensionType,
				extensionKey,
			}),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.extensionContext).toEqual({
				NodeRenderer: mockNodeRenderer,
				privateProps: mockPrivateProps,
			});
			expect(extensionHandler).not.toHaveBeenCalled();
		});
	});
});
