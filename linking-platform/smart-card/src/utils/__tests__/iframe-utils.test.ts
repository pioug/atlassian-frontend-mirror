import {
	isInIframe,
	isModalWithinPreviewPanelIFrame,
	isWithinPreviewPanel,
	openEmbedModalInParent,
} from '../iframe-utils';

// Mock window.parent.postMessage
const mockPostMessage = jest.fn();

if ((global as any).window) {
	(global as any).window.parent = {
		postMessage: mockPostMessage,
	};
}
let isInIframeSpy: jest.SpyInstance;

describe('isInIframe', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Create a spy for isInIframe
		isInIframeSpy = jest.spyOn(require('../iframe-utils'), 'isInIframe');
	});

	it('should return false when window.top equals window', () => {
		isInIframeSpy.mockReturnValue(false);
		expect(isInIframe()).toBe(false);
	});

	it('should return true when window.top does not equal window', () => {
		isInIframeSpy.mockReturnValue(true);
		expect(isInIframe()).toBe(true);
	});

	it('should return true when accessing window.top throws an error (cross-origin)', () => {
		isInIframeSpy.mockReturnValue(true);
		expect(isInIframe()).toBe(true);
	});
});

describe('openEmbedModalInParent', () => {
	it('should not call postMessage when not in iframe', () => {
		isInIframeSpy.mockReturnValue(false);

		openEmbedModalInParent({ prop: 'value' } as any);

		expect(mockPostMessage).not.toHaveBeenCalled();
	});

	it('should call postMessage with correct format when in iframe', () => {
		isInIframeSpy.mockReturnValue(true);

		const modalProps = {
			url: 'https://example.com',
			prop: 'value',
			func: () => {},
			nested: { value: 'nested' },
		} as any;

		openEmbedModalInParent(modalProps);

		expect(mockPostMessage).toHaveBeenCalledWith(
			{
				type: 'OPEN_EMBED_MODAL',
				payload: {
					modal: {
						url: 'https://example.com',
					},
				},
			},
			'*',
		);
	});

	it('should handle complex modal props with functions and nested objects', () => {
		isInIframeSpy.mockReturnValue(true);

		const modalProps = {
			url: 'https://test-modal.com',
			title: 'Test Modal',
			onClose: () => {},
			onSubmit: () => {},
			config: {
				enabled: true,
				handlers: {
					onSuccess: () => {},
					onError: () => {},
				},
				options: ['option1', 'option2'],
			},
		};

		openEmbedModalInParent(modalProps);

		expect(mockPostMessage).toHaveBeenCalledWith(
			{
				type: 'OPEN_EMBED_MODAL',
				payload: {
					modal: {
						url: 'https://test-modal.com',
					},
				},
			},
			'*',
		);
	});

	it('should handle empty modal props', () => {
		isInIframeSpy.mockReturnValue(true);

		openEmbedModalInParent({});

		expect(mockPostMessage).toHaveBeenCalledWith(
			{
				type: 'OPEN_EMBED_MODAL',
				payload: {
					modal: {
						url: '',
					},
				},
			},
			'*',
		);
	});

	it('should handle modal props with only url', () => {
		isInIframeSpy.mockReturnValue(true);

		const modalProps = {
			url: 'https://simple-url.com',
		};

		openEmbedModalInParent(modalProps);

		expect(mockPostMessage).toHaveBeenCalledWith(
			{
				type: 'OPEN_EMBED_MODAL',
				payload: {
					modal: {
						url: 'https://simple-url.com',
					},
				},
			},
			'*',
		);
	});

	it('should handle modal props without url (fallback to empty string)', () => {
		isInIframeSpy.mockReturnValue(true);

		const modalProps = {
			title: 'No URL Modal',
			description: 'This modal has no URL',
		};

		openEmbedModalInParent(modalProps);

		expect(mockPostMessage).toHaveBeenCalledWith(
			{
				type: 'OPEN_EMBED_MODAL',
				payload: {
					modal: {
						url: '',
					},
				},
			},
			'*',
		);
	});
});

describe('isWithinPreviewPanel', () => {
	let originalURLSearchParams: typeof URLSearchParams;

	beforeEach(() => {
		// Store original URLSearchParams
		originalURLSearchParams = global.URLSearchParams;
	});

	afterEach(() => {
		// Restore original URLSearchParams
		global.URLSearchParams = originalURLSearchParams;
	});

	it('should return false when no preview panel indicators are present', () => {
		// Mock URLSearchParams to return empty search params
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockReturnValue(false),
			get: jest.fn().mockReturnValue(null),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(false);
	});

	it('should return true when previewPanels parameter is present', () => {
		// Mock URLSearchParams to return search params with previewPanels
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockImplementation((key: string) => key === 'previewPanels'),
			get: jest.fn().mockReturnValue(null),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when previewPanels parameter is present with other params', () => {
		// Mock URLSearchParams to return search params with previewPanels
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockImplementation((key: string) => key === 'previewPanels'),
			get: jest.fn().mockReturnValue(null),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when embeddedConfluenceSource equals confluence-page-preview-panel', () => {
		// Mock URLSearchParams to return search params with embeddedConfluenceSource
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockReturnValue(false),
			get: jest
				.fn()
				.mockImplementation((key: string) =>
					key === 'embeddedConfluenceSource' ? 'confluence-page-preview-panel' : null,
				),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when embeddedConfluenceSource equals confluence-page-preview-panel with other params', () => {
		// Mock URLSearchParams to return search params with embeddedConfluenceSource
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockReturnValue(false),
			get: jest
				.fn()
				.mockImplementation((key: string) =>
					key === 'embeddedConfluenceSource' ? 'confluence-page-preview-panel' : null,
				),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return false when embeddedConfluenceSource has different value', () => {
		// Mock URLSearchParams to return search params with different embeddedConfluenceSource value
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockReturnValue(false),
			get: jest
				.fn()
				.mockImplementation((key: string) =>
					key === 'embeddedConfluenceSource' ? 'other-value' : null,
				),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(false);
	});

	it('should return true when both indicators are present', () => {
		// Mock URLSearchParams to return search params with both indicators
		global.URLSearchParams = jest.fn().mockImplementation(() => ({
			has: jest.fn().mockImplementation((key: string) => key === 'previewPanels'),
			get: jest
				.fn()
				.mockImplementation((key: string) =>
					key === 'embeddedConfluenceSource' ? 'confluence-page-preview-panel' : null,
				),
		})) as any;

		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should handle malformed URL search parameters gracefully', () => {
		// Mock URLSearchParams to throw an error
		global.URLSearchParams = jest.fn().mockImplementation(() => {
			throw new Error('Invalid URL');
		});

		expect(isWithinPreviewPanel()).toBe(false);
	});
});

describe('isModalWithinPreviewPanelIFrame', () => {
	let isInIframeSpy: jest.SpyInstance;
	let isWithinPreviewPanelSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		// Create spies for both functions
		isInIframeSpy = jest.spyOn(require('../iframe-utils'), 'isInIframe');
		isWithinPreviewPanelSpy = jest.spyOn(require('../iframe-utils'), 'isWithinPreviewPanel');
	});

	it('should return true when both in iframe and in preview panel', () => {
		isInIframeSpy.mockReturnValue(true);
		isWithinPreviewPanelSpy.mockReturnValue(true);

		expect(isModalWithinPreviewPanelIFrame()).toBe(true);
	});

	it('should return false when not in iframe but in preview panel', () => {
		isInIframeSpy.mockReturnValue(false);
		isWithinPreviewPanelSpy.mockReturnValue(true);

		expect(isModalWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when in iframe but not in preview panel', () => {
		isInIframeSpy.mockReturnValue(true);
		isWithinPreviewPanelSpy.mockReturnValue(false);

		expect(isModalWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when neither in iframe nor in preview panel', () => {
		isInIframeSpy.mockReturnValue(false);
		isWithinPreviewPanelSpy.mockReturnValue(false);

		expect(isModalWithinPreviewPanelIFrame()).toBe(false);
	});
});
