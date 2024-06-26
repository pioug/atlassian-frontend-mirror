import * as mocks from './bridge-test.mock';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { clearEditorContent } from '@atlaskit/editor-common/commands';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import { isLinkAtPos, isTextAtPos } from '@atlaskit/editor-common/link';
import WebBridgeImpl from '../../../../editor/native-to-web';
import { defaultPadding } from '../../../../web-bridge';

describe('general', () => {
	const bridge: any = new WebBridgeImpl();

	it('should return valid bridge version', () => {
		expect(bridge.currentVersion()).toEqual(process.env._PACKAGE_VERSION_);
	});
});

describe('quick insert should work', () => {
	const bridge: WebBridgeImpl = new WebBridgeImpl();

	beforeEach(() => {
		mocks.mockCalls.length = 0;
		(bridge as any).editorView = {};
	});

	afterEach(() => {
		bridge.editorView = undefined;
	});

	it('should set quick insert items', async () => {
		const itemsToSet = [
			{
				title: 'mochi is fluffy',
				action: (insert: QuickInsertActionInsert) => insert(),
			},
		];
		bridge.setQuickInsertItems(itemsToSet);
		const quickInsertItems = await bridge.quickInsertItems;
		expect(quickInsertItems).toEqual(itemsToSet);
	});
});

describe('lists should work', () => {
	const bridge: any = new WebBridgeImpl();

	const commands = {
		indentList: jest.fn(() => {
			return () => () => {};
		}),
		outdentList: jest.fn(() => {
			return () => () => {};
		}),
		toggleOrderedList: jest.fn(() => {
			return () => () => {};
		}),
		toggleBulletList: jest.fn(() => () => {}),
	};

	const mockPluginInjectionApi = {
		core: {
			actions: {
				execute: () => {},
			},
		},
		list: {
			commands,
		},
	};

	beforeEach(() => {
		mocks.mockCalls.length = 0;
		bridge.editorView = {};
		bridge.listBridgeState = {};
		bridge.setPluginInjectionApi(mockPluginInjectionApi);
	});

	afterEach(() => {
		bridge.editorView = undefined;
		bridge.listBridgeState = undefined;

		(commands.indentList as Function as jest.Mock<{}>).mockClear();
		(commands.outdentList as Function as jest.Mock<{}>).mockClear();
		(commands.toggleOrderedList as Function as jest.Mock<{}>).mockClear();
		(commands.toggleBulletList as Function as jest.Mock<{}>).mockClear();
	});

	it('should call ordered list toggle', () => {
		bridge.onOrderedListSelected();
		expect(commands.toggleOrderedList).toBeCalled();
	});

	it('should call bullet list toggle', () => {
		bridge.onBulletListSelected();
		expect(commands.toggleBulletList).toBeCalled();
	});

	it('should call indent list', () => {
		bridge.onIndentList();
		expect(commands.indentList).toBeCalled();
	});

	it('should call outdent list', () => {
		bridge.onOutdentList();
		expect(commands.outdentList).toBeCalled();
	});
});

describe('links should work', () => {
	const bridge: any = new WebBridgeImpl();
	const mockUpdateLink = jest.fn();
	const mockInsertLink = jest.fn();

	beforeEach(() => {
		mocks.mockCalls.length = 0;
		bridge.editorView = {};
		bridge.setPluginInjectionApi({
			hyperlink: {
				actions: {
					updateLink: mockUpdateLink.mockImplementation(() => () => {}),
					insertLink: mockInsertLink.mockImplementation(() => () => {}),
				},
			},
		});
	});

	afterEach(() => {
		bridge.editorView = undefined;

		mockInsertLink.mockClear();
		(isLinkAtPos as Function as jest.Mock<{}>).mockClear();
		(isTextAtPos as Function as jest.Mock<{}>).mockClear();
		mockUpdateLink.mockClear();
	});

	it('should call insertLinkWithAnalytics when not on text node', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 1, // mock won't resolve pos as text node
					to: 3,
				},
			},
		};

		bridge.onLinkUpdate('text', 'url', INPUT_METHOD.KEYBOARD);

		expect(isLinkAtPos).toHaveBeenCalledWith(1);
		expect(mockInsertLink).toHaveBeenCalledWith(
			INPUT_METHOD.KEYBOARD,
			1,
			3,
			'url',
			undefined,
			'text',
		);
	});

	it('should call updateLink when on text node', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
				},
			},
		};

		bridge.onLinkUpdate('text', 'url');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('url', 'text', 2, undefined);
	});

	it('should call updateLink when on selected text node', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
					to: 4,
				},
			},
		};

		bridge.onLinkUpdate('text', 'url');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('url', 'text', 2, 4);
	});

	it('should call updateLink when providing url only', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
				},
			},
		};

		bridge.onLinkUpdate('', 'url');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('url', 'url', 2, undefined);
	});

	it('should call updateLink when providing url only + selection', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
					to: 4,
				},
			},
		};

		bridge.onLinkUpdate('', 'url');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('url', 'url', 2, 4);
	});

	it('should call updateLink using full link when on a link', () => {
		bridge.editorView = {
			state: {
				doc: {
					resolve: jest.fn(() => ({ textOffset: 1 })),
				},
				selection: {
					from: 6, // mock will resolve pos as link
				},
			},
		};

		bridge.onLinkUpdate('link', 'href');

		expect(isLinkAtPos).toHaveBeenCalledWith(6);
		expect(bridge.editorView.state.doc.resolve).toHaveBeenCalledWith(6);
		expect(mockUpdateLink).toHaveBeenCalledWith('href', 'link', 5, undefined);
	});

	it('should call updateLink when providing no url', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
				},
			},
		};

		bridge.onLinkUpdate('text', '');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('', 'text', 2, undefined);
	});

	it('should call updateLink when providing no url + selection', () => {
		bridge.editorView = {
			state: {
				selection: {
					from: 2, // mock will resolve pos as text node
					to: 4,
				},
			},
		};

		bridge.onLinkUpdate('text', '');

		expect(isLinkAtPos).toHaveBeenCalledWith(2);
		expect(mockUpdateLink).toHaveBeenCalledWith('', 'text', 2, 4);
	});
});

describe('content should work', () => {
	const bridge: any = new WebBridgeImpl();

	beforeEach(() => {
		mocks.mockCalls.length = 0;
		bridge.editorView = {};
	});

	afterEach(() => {
		bridge.editorView = undefined;

		(clearEditorContent as Function as jest.Mock<{}>).mockClear();
	});

	it('should clear content', () => {
		bridge.clearContent();
		expect(clearEditorContent).toHaveBeenCalled();
	});
});

describe('history', () => {
	const bridge: any = new WebBridgeImpl();

	beforeEach(() => {
		bridge.editorView = {};
	});

	it('should call undo', () => {
		bridge.undo();
		expect(mocks.mockPmHistory.undo).toHaveBeenCalled();
	});

	it('should call redo', () => {
		bridge.redo();
		expect(mocks.mockPmHistory.redo).toHaveBeenCalled();
	});
});

describe('ui', () => {
	const bridge: any = new WebBridgeImpl();
	const mockSetKeyboardHeight = jest.fn(() => () => {});

	beforeEach(() => {
		bridge.editorView = {};
		bridge.setPluginInjectionApi({
			base: { actions: { setKeyboardHeight: mockSetKeyboardHeight } },
		});
	});

	it('should set keyboard height', () => {
		bridge.setKeyboardControlsHeight('350');
		expect(mockSetKeyboardHeight).toHaveBeenCalledWith(350);
	});
});

describe('styling', () => {
	let bridge: any;
	let mockRootEl: { style: Partial<CSSStyleDeclaration> };

	beforeEach(() => {
		bridge = new WebBridgeImpl();
		mockRootEl = {
			style: {
				padding: 'auto',
				margin: 'auto',
			},
		};
		jest.spyOn(bridge, 'getRootElement').mockReturnValue(mockRootEl);
		bridge.setPadding(...defaultPadding);
	});

	it('sets padding', () => {
		const expectedPadding = defaultPadding.map((p) => `${p}px`).join(' ');
		expect(mockRootEl.style.padding).toBe(expectedPadding);
	});

	// Setting margin causes a bug in Android Recycled View where the height grows
	// indefinitely https://product-fabric.atlassian.net/browse/FM-2472
	it('does not set margin', () => {
		expect(mockRootEl.style.margin).toBe('auto');
	});
});
