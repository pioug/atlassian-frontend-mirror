import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { DocumentViewer } from './documentViewer';
import {
	type ComboBoxField,
	type Font,
	type Link,
	type PageAnnotations,
	type PageContent,
	type PageRangeContent,
	type Span,
	type TextField,
} from './types';

// Define the props type locally to avoid circular imports
type DocumentViewerProps = {
	getContent: (pageStart: number, pageEnd: number) => Promise<PageRangeContent>;
	initialPageUrl?: string;
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>;
	zoom: number;
	onSuccess?: () => void;
};

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

// Mock fetch for blob creation
global.fetch = jest.fn(() =>
	Promise.resolve({
		blob: () => Promise.resolve(new Blob()),
	}),
) as jest.Mock;

// Mock getDocument utility
jest.mock('./utils/getDocumentRoot', () => ({
	getDocumentRoot: jest.fn(() => document),
	getScrollElement: jest.fn(() => null),
}));

// Mock useIntersectionObserver
jest.mock('./utils/useIntersectionObserver', () => ({
	useIntersectionObserver: jest.fn((options, callback) => {
		return {
			observedRef: jest.fn(),
			isVisibleRef: { current: true },
		};
	}),
}));

const makeAllIntersectionObserversVisible = async () => {
	const { useIntersectionObserver } = require('./utils/useIntersectionObserver');
	useIntersectionObserver.mock.calls.forEach(([options, callback]: [any, () => void]) => {
		callback();
	});
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('DocumentViewer', () => {
	const mockFont: Font = {
		name: 'Arial',
		size: 12,
		weight: 400,
		is_all_caps: false,
		is_bold_reenforced: false,
		is_cursive: false,
		is_fixed_pitch: false,
		is_italic: false,
		is_non_symbolic: false,
		is_proportional_pitch: false,
		is_sans_serif: false,
		is_serif: false,
		is_small_caps: false,
		is_symbolic: false,
	};

	const mockSpan: Span = {
		x: 10,
		y: 20,
		l: 100,
		h: 15,
		text: 'Sample text',
		fi: 0,
		r: 0,
	};

	const mockTextField: TextField = {
		x: 50,
		y: 100,
		w: 150,
		h: 20,
		f: 12,
		text: 'Form field text',
		multiline: false,
	};

	const mockComboBoxField: ComboBoxField = {
		x: 200,
		y: 150,
		w: 100,
		h: 25,
		f: 14,
		text: 'Combo option',
	};

	const mockUriLink: Link = {
		type: 'uri',
		dest: 'https://example.com',
		x: 300,
		y: 200,
		w: 80,
		h: 15,
	};

	const mockLocalLink: Link = {
		type: 'local',
		p_num: 2,
		x: 400,
		y: 250,
		w: 60,
		h: 18,
	};

	const mockAnnotations: PageAnnotations = {
		text_form_fields: [mockTextField],
		combobox_form_fields: [mockComboBoxField],
	};

	const mockPageContent: PageContent = {
		width: 800,
		height: 600,
		rotation: 0,
		lines: [
			{
				spans: [mockSpan],
				r: 0,
			},
		],
		annotations: mockAnnotations,
		links: [mockUriLink, mockLocalLink],
	};

	const mockPageRangeContent: PageRangeContent = {
		pages: [mockPageContent],
		fonts: [mockFont],
		start_index: 0,
		end_index: 1,
		total_pages: 1,
	};

	const createMockProps = (overrides: Partial<DocumentViewerProps> = {}): DocumentViewerProps => ({
		getContent: jest.fn().mockResolvedValue(mockPageRangeContent),
		getPageImageUrl: jest.fn().mockResolvedValue('mock-image-url'),
		zoom: 1,
		...overrides,
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Basic Rendering', () => {
		it('should render with initial page URL when provided', async () => {
			const props = createMockProps({ initialPageUrl: 'initial-page-url' });
			// Make getContent never resolve to test initial page rendering
			props.getContent = jest.fn(() => new Promise(() => {}));

			render(<DocumentViewer {...props} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());
			expect(screen.getByTestId('document-viewer')).toBeInTheDocument();

			// Should render initial pages
			expect(screen.getByTestId('page-0')).toBeInTheDocument();
			expect(screen.getByTestId('page-1')).toBeInTheDocument();
			expect(screen.getByTestId('page-2')).toBeInTheDocument();
			expect(screen.getByTestId('page-3')).toBeInTheDocument();
		});

		it('should render page with id attribute', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const page = await screen.findByTestId('page-0');
			expect(page).toHaveAttribute('id', 'page-1');
		});
	});

	describe('Content Loading', () => {
		it('should call getContent with correct pagination parameters', async () => {
			const getContentSpy = jest.fn().mockResolvedValue(mockPageRangeContent);
			const props = createMockProps({ getContent: getContentSpy });

			render(<DocumentViewer {...props} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('document-viewer');
			expect(getContentSpy).toHaveBeenCalledWith(0, 50);
		});

		it('should render page content after loading', async () => {
			const getPageImageUrlSpy = jest.fn().mockResolvedValue('mock-image-url');
			const props = createMockProps({ getPageImageUrl: getPageImageUrlSpy });

			render(<DocumentViewer {...props} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());
			await screen.findByTestId('page-0-image');
			expect(getPageImageUrlSpy).toHaveBeenCalled();
		});

		it('should handle multiple pages with lazy loading', async () => {
			const multiPageContent: PageRangeContent = {
				...mockPageRangeContent,
				total_pages: 150,
				end_index: 50,
			};

			const getContentSpy = jest.fn().mockResolvedValue(multiPageContent);
			const props = createMockProps({ getContent: getContentSpy });

			render(<DocumentViewer {...props} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());
			await screen.findByTestId('document-viewer');
			expect(getContentSpy).toHaveBeenCalledWith(0, 50);

			// Should render multiple pages
			expect(screen.getByTestId('page-0')).toBeInTheDocument();
			expect(screen.getByTestId('page-1')).toBeInTheDocument();
			expect(screen.getByTestId('page-2')).toBeInTheDocument();
			expect(screen.getByTestId('page-3')).toBeInTheDocument();
		});

		it('should render preloaded pages when content is not yet available', async () => {
			const props = createMockProps({
				getContent: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
			});

			render(<DocumentViewer {...props} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());
			const firstPage = await screen.findByTestId('page-0');
			expect(firstPage).toBeInTheDocument();

			expect(screen.getByTestId('page-1')).toBeInTheDocument();
			expect(screen.getByTestId('page-2')).toBeInTheDocument();
			expect(screen.getByTestId('page-3')).toBeInTheDocument();
		});
	});

	describe('Zoom Functionality', () => {
		it('should apply zoom factor to CSS custom property', async () => {
			const props = createMockProps({ zoom: 1.5 });
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const documentViewer = await screen.findByTestId('document-viewer');
			expect(documentViewer).toHaveStyle('--document-viewer-zoom: 1.5');
		});

		it('should pass zoom to getPageImageUrl', async () => {
			const getPageImageUrlSpy = jest.fn().mockResolvedValue('mock-url');
			const props = createMockProps({ zoom: 2, getPageImageUrl: getPageImageUrlSpy });

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('page-0-image');
			expect(getPageImageUrlSpy).toHaveBeenCalledWith(expect.any(Number), 2);
		});

		it('should update image dimensions based on zoom', async () => {
			const props = createMockProps({ zoom: 2 });
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const image = await screen.findByTestId('page-0-image');
			expect(image).toHaveAttribute('data-zoom', '2');
		});

		it('should adjust scroll position when zoom changes with custom scroll element', async () => {
			const mockScrollElement = {
				scrollLeft: 100,
				scrollTop: 100,
				clientWidth: 800,
				clientHeight: 600,
			};

			const { getScrollElement } = require('./utils/getDocumentRoot');
			getScrollElement.mockReturnValue(mockScrollElement);

			const { rerender } = render(<DocumentViewer {...createMockProps({ zoom: 1 })} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Change zoom and verify scroll adjustment
			rerender(<DocumentViewer {...createMockProps({ zoom: 2 })} />);

			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// The scroll position should be adjusted based on the zoom change
			// Expected calculation: viewportCenter * scaleDiff
			const expectedScrollLeftAdjustment = (100 + 800 / 2) * (2 / 1 - 1); // 500
			const expectedScrollTopAdjustment = (100 + 600 / 2) * (2 / 1 - 1); // 400

			expect(mockScrollElement.scrollLeft).toBe(100 + expectedScrollLeftAdjustment);
			expect(mockScrollElement.scrollTop).toBe(100 + expectedScrollTopAdjustment);
		});

		it('should not adjust scroll position when no custom scroll element exists', async () => {
			const { getScrollElement } = require('./utils/getDocumentRoot');
			getScrollElement.mockReturnValue(null);

			const { rerender } = render(<DocumentViewer {...createMockProps({ zoom: 1 })} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Change zoom - should not throw any errors when no scroll element
			expect(() => {
				rerender(<DocumentViewer {...createMockProps({ zoom: 2 })} />);
			}).not.toThrow();
		});
	});

	describe('Success Callback', () => {
		it('should call onSuccess when the first page loads', async () => {
			const onSuccessSpy = jest.fn();
			const props = createMockProps({ onSuccess: onSuccessSpy });

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Wait for the first page image to load
			const image = await screen.findByTestId('page-0-image');

			// Manually trigger the onLoad event since it doesn't fire automatically in tests
			const loadEvent = new Event('load');
			image.dispatchEvent(loadEvent);

			// The onSuccess callback should be called when the first page loads
			expect(onSuccessSpy).toHaveBeenCalledTimes(1);
		});

		it('should not call onSuccess when no callback is provided', async () => {
			const props = createMockProps(); // No onSuccess provided

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Wait for the first page image to load
			await screen.findByTestId('page-0-image');

			// Should not throw any errors and render normally
			expect(screen.getByTestId('document-viewer')).toBeInTheDocument();
		});

		it('should only call onSuccess for the first page, not subsequent pages', async () => {
			const onSuccessSpy = jest.fn();
			const multiPageContent: PageRangeContent = {
				...mockPageRangeContent,
				pages: [mockPageContent, mockPageContent, mockPageContent],
				total_pages: 3,
				end_index: 3,
			};

			const props = createMockProps({
				onSuccess: onSuccessSpy,
				getContent: jest.fn().mockResolvedValue(multiPageContent),
			});

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Wait for all page images to load
			const image0 = await screen.findByTestId('page-0-image');
			const image1 = await screen.findByTestId('page-1-image');
			const image2 = await screen.findByTestId('page-2-image');

			// Manually trigger the onLoad event for all images
			const loadEvent = new Event('load');
			image0.dispatchEvent(loadEvent);
			image1.dispatchEvent(loadEvent);
			image2.dispatchEvent(loadEvent);

			// onSuccess should only be called once for the first page
			expect(onSuccessSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Page Component', () => {
		it('should render page', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const page = await screen.findByTestId('page-0');
			expect(page).toBeInTheDocument();
		});

		it('should render SVG with text content', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const textLayer = await screen.findByTestId('page-0-text-layer');
			expect(textLayer).toBeInTheDocument();
			expect(textLayer.textContent).toContain('Sample text');
		});

		it('should render text spans with correct properties', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const tspanElement = await screen.findByText('Sample text');
			expect(tspanElement).toBeInTheDocument();
			expect(tspanElement).toHaveAttribute('x', '10');
			expect(tspanElement).toHaveAttribute('y', '-20');
			expect(tspanElement).toHaveAttribute('textLength', '100');
		});

		it('should render lines with proper test IDs', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await waitFor(() => {
				// Check that the first line of the first page has the correct test ID
				expect(screen.getByTestId('page-0-line-0')).toBeInTheDocument();
			});
		});

		it('should render images with proper alt text', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const image = await screen.findByTestId('page-0-image');
			expect(image).toHaveAttribute('alt', '');
		});

		it('should show spinner while image is loading', async () => {
			const props = createMockProps({
				getPageImageUrl: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
			});
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Should show spinner while image is loading
			const spinner = await screen.findByTestId('spinner-wrapper');
			expect(spinner).toBeInTheDocument();

			// Should not show image yet
			expect(screen.queryByTestId('page-0-image')).not.toBeInTheDocument();
		});

		it('should hide spinner when image loads', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Should show image and not show spinner
			const image = await screen.findByTestId('page-0-image');
			expect(image).toBeInTheDocument();
			expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
		});

		it('should use A4 dimensions as fallback when no content or image dimensions are available', async () => {
			const props = createMockProps({
				getContent: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
				getPageImageUrl: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
			});
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const page = await screen.findByTestId('page-0');
			expect(page).toBeInTheDocument();

			// Should use A4 dimensions (842x595) as fallback
			const expectedWidth = 'calc(var(--document-viewer-zoom) * 842px)';
			const expectedHeight = 'calc(var(--document-viewer-zoom) * 595px)';

			expect(page).toHaveStyle(`width: ${expectedWidth}`);
			expect(page).toHaveStyle(`height: ${expectedHeight}`);
		});

		it('should use content dimensions when available', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const page = await screen.findByTestId('page-0');
			expect(page).toBeInTheDocument();

			// Should use content dimensions (800x600 from mockPageContent)
			const expectedWidth = 'calc(var(--document-viewer-zoom) * 842px)';
			const expectedHeight = 'calc(var(--document-viewer-zoom) * 595px)';

			expect(page).toHaveStyle(`width: ${expectedWidth}`);
			expect(page).toHaveStyle(`height: ${expectedHeight}`);
		});

		it('should use initial dimensions when image is loaded but no content dimensions', async () => {
			const props = createMockProps({
				getContent: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
			});
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const page = await screen.findByTestId('page-0');
			const image = await screen.findByTestId('page-0-image');

			expect(page).toBeInTheDocument();
			expect(image).toBeInTheDocument();

			// Should use initial dimensions when image is loaded but no content
			expect(page).toHaveStyle({
				width: 'calc(var(--document-viewer-zoom) * 842px)',
				height: 'calc(var(--document-viewer-zoom) * 595px)',
			});
		});
	});

	describe('Annotations', () => {
		it('should render text form fields', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const textFormField = await screen.findByTestId('text-form-field-0');
			expect(textFormField).toBeInTheDocument();

			const input = screen.getByDisplayValue('Form field text');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('readonly');
			expect(input).toHaveAttribute('type', 'text');
		});

		it('should render combobox form fields', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const comboboxFormField = await screen.findByTestId('combobox-form-field-0');
			expect(comboboxFormField).toBeInTheDocument();

			const input = screen.getByDisplayValue('Combo option');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('readonly');
			expect(input).toHaveAttribute('type', 'text');
		});

		it('should render empty annotations when no form fields exist', async () => {
			const emptyAnnotationsContent: PageContent = {
				...mockPageContent,
				annotations: {
					text_form_fields: [],
					combobox_form_fields: [],
				},
			};

			const contentWithEmptyAnnotations: PageRangeContent = {
				...mockPageRangeContent,
				pages: [emptyAnnotationsContent],
			};

			const props = createMockProps({
				getContent: jest.fn().mockResolvedValue(contentWithEmptyAnnotations),
			});

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Should not render any form field test IDs when arrays are empty
			expect(screen.queryByTestId('text-form-field-0')).not.toBeInTheDocument();
			expect(screen.queryByTestId('combobox-form-field-0')).not.toBeInTheDocument();
		});

		it('should stop propagation of key up and down events for text form fields', async () => {
			const props = createMockProps();
			const onKeyUpSpy = jest.fn();
			render(
				<div onKeyUp={onKeyUpSpy}>
					<DocumentViewer {...props} />
				</div>,
			);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const textFormField = await screen.findByTestId('text-form-field-0');
			expect(textFormField).toBeInTheDocument();

			const input = screen.getByDisplayValue('Form field text');

			// Check that the input has an onKeyUp handler
			expect(input).toHaveAttribute('readonly');

			// Test that arrow key events can be fired without errors
			await userEvent.keyboard('{arrowleft}');
			await userEvent.keyboard('{arrowright}');
			expect(onKeyUpSpy).toHaveBeenCalledTimes(0);
		});

		it('should stop propagation of key up and down events for combobox form fields', async () => {
			const props = createMockProps();
			const onKeyUpSpy = jest.fn();
			render(
				<div onKeyUp={onKeyUpSpy}>
					<DocumentViewer {...props} />
				</div>,
			);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const comboboxFormField = await screen.findByTestId('combobox-form-field-0');
			expect(comboboxFormField).toBeInTheDocument();

			const input = screen.getByDisplayValue('Combo option');

			// Check that the input has proper attributes
			expect(input).toHaveAttribute('readonly');

			// Test that arrow key events can be fired without errors
			await userEvent.keyboard('{arrowleft}');
			await userEvent.keyboard('{arrowright}');
			expect(onKeyUpSpy).toHaveBeenCalledTimes(0);
		});
	});

	describe('Document Links', () => {
		it('should render URI links', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const uriLink = await screen.findByTestId('document-link-0');
			expect(uriLink).toBeInTheDocument();

			const anchor = uriLink.querySelector('a');
			expect(anchor).toHaveAttribute('href', 'https://example.com');
			expect(anchor).toHaveAttribute('target', '_blank');
			expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should render local page links', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const localLink = await screen.findByTestId('document-link-1');
			expect(localLink).toBeInTheDocument();

			const anchor = localLink.querySelector('a');
			expect(anchor).toHaveAttribute('href', '#page-3'); // p_num 2 + 1 = page-3
		});

		it('should render empty links when no links exist', async () => {
			const emptyLinksContent: PageContent = {
				...mockPageContent,
				links: [],
			};

			const contentWithEmptyLinks: PageRangeContent = {
				...mockPageRangeContent,
				pages: [emptyLinksContent],
			};

			const props = createMockProps({
				getContent: jest.fn().mockResolvedValue(contentWithEmptyLinks),
			});

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			// Should not render any link test IDs when array is empty
			expect(screen.queryByTestId('document-link-0')).not.toBeInTheDocument();
		});
	});

	describe('Image Caching', () => {
		it('should cache image URLs as blob URLs', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('page-0-image');

			// Verify fetch was called to get the blob
			expect(global.fetch).toHaveBeenCalledWith('mock-image-url');
			// Verify blob URL was created
			expect(global.URL.createObjectURL).toHaveBeenCalled();
		});

		it('should reuse cached URLs for same page and zoom', async () => {
			const getPageImageUrlSpy = jest.fn().mockResolvedValue('mock-image-url');
			const props = createMockProps({ getPageImageUrl: getPageImageUrlSpy });

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('page-0-image');

			// Should call getPageImageUrl for each page (multiple calls due to preloading and content loading)
			expect(getPageImageUrlSpy).toHaveBeenCalled();
			expect(getPageImageUrlSpy).toHaveBeenCalledWith(expect.any(Number), 1);
		});
	});

	describe('Span Component', () => {
		it('should not render spans with zero or negative width', async () => {
			const zeroWidthSpan: Span = { ...mockSpan, l: 0 };
			const pageWithZeroWidthSpan: PageContent = {
				...mockPageContent,
				lines: [{ spans: [zeroWidthSpan], r: 0 }],
			};

			const contentWithZeroWidthSpan: PageRangeContent = {
				...mockPageRangeContent,
				pages: [pageWithZeroWidthSpan],
			};

			const props = createMockProps({
				getContent: jest.fn().mockResolvedValue(contentWithZeroWidthSpan),
			});

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			expect(document.querySelector('tspan')).not.toBeInTheDocument();
		});

		it('should render spans with positive width', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const tspanElement = await screen.findByText('Sample text');

			expect(tspanElement).toHaveAttribute('x', '10');
			expect(tspanElement).toHaveAttribute('y', '-20');
			expect(tspanElement).toHaveAttribute('textLength', '100');
		});
	});

	describe('Line Component', () => {
		it('should render lines with rotation', async () => {
			const rotatedPageContent: PageContent = {
				...mockPageContent,
				lines: [
					{
						spans: [mockSpan],
						r: Math.PI / 4, // 45 degrees
					},
				],
			};

			const contentWithRotation: PageRangeContent = {
				...mockPageRangeContent,
				pages: [rotatedPageContent],
			};

			const props = createMockProps({
				getContent: jest.fn().mockResolvedValue(contentWithRotation),
			});

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const line = await screen.findByTestId('page-0-line-0');

			expect(line).toHaveStyle(`transform: rotate(${Math.PI / 4}rad)`);
		});

		it('should handle lines with valid spans', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			const line = await screen.findByTestId('page-0-line-0');
			expect(line).toBeInTheDocument();
		});
	});

	describe('Intersection Observer Integration', () => {
		it('should use intersection observer for lazy loading', async () => {
			const props = createMockProps();
			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('document-viewer');

			// Verify intersection observer was used
			const { useIntersectionObserver } = require('./utils/useIntersectionObserver');
			expect(useIntersectionObserver).toHaveBeenCalled();
		});

		it('should load images when pages become visible', async () => {
			const getPageImageUrlSpy = jest.fn().mockResolvedValue('mock-image-url');
			const props = createMockProps({ getPageImageUrl: getPageImageUrlSpy });

			render(<DocumentViewer {...props} />);
			await waitFor(async () => await makeAllIntersectionObserversVisible());

			await screen.findByTestId('page-0-image');

			// Should call getPageImageUrl when page becomes visible
			expect(getPageImageUrlSpy).toHaveBeenCalled();
		});
	});
});
