jest.mock('../is-in-iframe', () => ({
	isInIframe: jest.fn(jest.requireActual('../is-in-iframe').isInIframe),
}));
jest.mock('../is-within-preview-panel', () => ({
	isWithinPreviewPanel: jest.fn(
		jest.requireActual('../is-within-preview-panel').isWithinPreviewPanel,
	),
}));

import { isInIframe } from '../is-in-iframe';
import { isWithinPreviewPanel } from '../is-within-preview-panel';
import { isWithinPreviewPanelIFrame } from '../is-within-preview-panel-i-frame';

const isInIframeMock = isInIframe as jest.MockedFunction<typeof isInIframe>;
const isWithinPreviewPanelMock = isWithinPreviewPanel as jest.MockedFunction<
	typeof isWithinPreviewPanel
>;

describe('isInIframe', () => {
	const originalWindowTop = Object.getOwnPropertyDescriptor(window, 'top');

	afterEach(() => {
		if (originalWindowTop) {
			Object.defineProperty(window, 'top', originalWindowTop);
		}
	});

	it('should return false when window.top equals window', () => {
		Object.defineProperty(window, 'top', { configurable: true, value: window });
		expect(isInIframe()).toBe(false);
	});

	it('should return true when window.top does not equal window', () => {
		Object.defineProperty(window, 'top', { configurable: true, value: {} });
		expect(isInIframe()).toBe(true);
	});

	it('should return true when accessing window.top throws an error (cross-origin)', () => {
		Object.defineProperty(window, 'top', {
			configurable: true,
			get() {
				throw new Error('cross-origin');
			},
		});
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
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return true when both in iframe and in preview panel', () => {
		isInIframeMock.mockReturnValue(true);
		isWithinPreviewPanelMock.mockReturnValue(true);

		expect(isWithinPreviewPanelIFrame()).toBe(true);
	});

	it('should return false when not in iframe but in preview panel', () => {
		isInIframeMock.mockReturnValue(false);
		isWithinPreviewPanelMock.mockReturnValue(true);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when in iframe but not in preview panel', () => {
		isInIframeMock.mockReturnValue(true);
		isWithinPreviewPanelMock.mockReturnValue(false);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});

	it('should return false when neither in iframe nor in preview panel', () => {
		isInIframeMock.mockReturnValue(false);
		isWithinPreviewPanelMock.mockReturnValue(false);

		expect(isWithinPreviewPanelIFrame()).toBe(false);
	});
});
