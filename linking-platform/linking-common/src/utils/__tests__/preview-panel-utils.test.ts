import {
	isInIframe,
	isWithinPreviewPanel,
	isWithinPreviewPanelIFrame,
} from '../preview-panel-utils';

let isInIframeSpy: jest.SpyInstance;

describe('isInIframe', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Create a spy for isInIframe
		isInIframeSpy = jest.spyOn(require('../preview-panel-utils'), 'isInIframe');
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

describe('isWithinPreviewPanel', () => {
	const mockLocation = (search: string) => {
		delete (global as any).window.location;
		(global as any).window.location = { search };
	};

	it('should return false when no preview panel indicators are present', () => {
		mockLocation('?someParam=value');
		expect(isWithinPreviewPanel()).toBe(false);
	});

	it('should return false when search is empty', () => {
		mockLocation('');
		expect(isWithinPreviewPanel()).toBe(false);
	});

	it('should return true when previewPanels parameter is present', () => {
		mockLocation('?previewPanels=true');
		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when previewPanels parameter is present with other params', () => {
		mockLocation('?previewPanels=true&otherParam=value');
		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when embeddedConfluenceSource equals confluence-page-preview-panel', () => {
		mockLocation('?embeddedConfluenceSource=confluence-page-preview-panel');
		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return true when embeddedConfluenceSource equals confluence-page-preview-panel with other params', () => {
		mockLocation('?embeddedConfluenceSource=confluence-page-preview-panel&otherParam=value');
		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should return false when embeddedConfluenceSource has different value', () => {
		mockLocation('?embeddedConfluenceSource=other-value');
		expect(isWithinPreviewPanel()).toBe(false);
	});

	it('should return true when both indicators are present', () => {
		mockLocation('?previewPanels=true&embeddedConfluenceSource=confluence-page-preview-panel');
		expect(isWithinPreviewPanel()).toBe(true);
	});

	it('should handle errors gracefully', () => {
		mockLocation('?test=value');
		// Temporarily break URLSearchParams to simulate an error
		const originalURLSearchParams = global.URLSearchParams;
		(global as any).URLSearchParams = () => {
			throw new Error('URLSearchParams error');
		};

		expect(isWithinPreviewPanel()).toBe(false);

		// Restore URLSearchParams
		global.URLSearchParams = originalURLSearchParams;
	});
});

describe('isWithinPreviewPanelIFrame', () => {
	let isInIframeSpy: jest.SpyInstance;
	let isWithinPreviewPanelSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		// Create spies for both functions
		isInIframeSpy = jest.spyOn(require('../preview-panel-utils'), 'isInIframe');
		isWithinPreviewPanelSpy = jest.spyOn(require('../preview-panel-utils'), 'isWithinPreviewPanel');
	});

	it('should return true when both in iframe and in preview panel', () => {
		isInIframeSpy.mockReturnValue(true);
		isWithinPreviewPanelSpy.mockReturnValue(true);

		expect(isWithinPreviewPanelIFrame()).toBe(true);
	});

	it('should return false when not in iframe but in preview panel', () => {
		isInIframeSpy.mockReturnValue(false);
		isWithinPreviewPanelSpy.mockReturnValue(true);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when in iframe but not in preview panel', () => {
		isInIframeSpy.mockReturnValue(true);
		isWithinPreviewPanelSpy.mockReturnValue(false);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when neither in iframe nor in preview panel', () => {
		isInIframeSpy.mockReturnValue(false);
		isWithinPreviewPanelSpy.mockReturnValue(false);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});
});
