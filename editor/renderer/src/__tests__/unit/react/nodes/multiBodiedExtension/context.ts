import { renderHook } from '@testing-library/react-hooks';
import {
	getExtensionModuleNodePrivateProps,
	getNodeRenderer,
} from '@atlaskit/editor-common/extensions';
import { useProvider } from '@atlaskit/editor-common/provider-factory';

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

		const { result, waitForNextUpdate } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);
		await waitForNextUpdate();

		expect(result.current.loading).toBe(true);
		expect(result.current.extensionContext).toBeNull();
	});

	it('should return loading true if NodeRenderer is not resolved yet', async () => {
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockResolvedValue(Promise.resolve({}));
		(getNodeRenderer as jest.Mock).mockReturnValue(null);

		const { result, waitForNextUpdate } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);
		await waitForNextUpdate();

		expect(result.current.loading).toBe(true);
		expect(result.current.extensionContext).toBeNull();
	});

	it('should return correct context when all dependencies are resolved', async () => {
		const mockPrivateProps = { __allowBodiedOverride: true };
		const mockNodeRenderer = jest.fn();
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({}));
		(getExtensionModuleNodePrivateProps as jest.Mock).mockReturnValue(
			Promise.resolve(mockPrivateProps),
		);
		(getNodeRenderer as jest.Mock).mockReturnValue(mockNodeRenderer);

		const { result, waitForNextUpdate } = renderHook(() =>
			useMultiBodiedExtensionContext({ extensionType, extensionKey }),
		);
		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.extensionContext).toEqual({
			NodeRenderer: mockNodeRenderer,
			privateProps: mockPrivateProps,
		});
	});
});
