import { renderHook } from '@testing-library/react-hooks';
import { useScrollToLocalId } from '../useScrollToLocalId';

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

// Mock hash for block ID
Object.defineProperty(window, 'location', {
	value: {
		hash: '#block-test-local-id',
	},
	writable: true,
});

describe('useScrollToLocalId', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset DOM
		document.body.innerHTML = '';
	});

	it('should scroll to element with matching data-local-id when second argument shouldScrollToLocalId is true', () => {
		// Setup DOM
		const containerDiv = document.createElement('div');
		const targetElement = document.createElement('div');
		targetElement.setAttribute('data-local-id', 'test-local-id');
		containerDiv.appendChild(targetElement);
		document.body.appendChild(containerDiv);

		// Setup ref
		const containerRef = { current: containerDiv };

		// Render hook
		renderHook(() => useScrollToLocalId(containerRef, true));

		// Verify scrollIntoView was called
		expect(mockScrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
		});
	});

	it('should not scroll to element with matching data-local-id when second argument shouldScrollToLocalId is false', () => {
		// Setup DOM
		const containerDiv = document.createElement('div');
		const targetElement = document.createElement('div');
		targetElement.setAttribute('data-local-id', 'test-local-id');
		containerDiv.appendChild(targetElement);
		document.body.appendChild(containerDiv);

		// Setup ref
		const containerRef = { current: containerDiv };

		// Render hook
		renderHook(() => useScrollToLocalId(containerRef, false));

		// Verify scrollIntoView was called
		expect(mockScrollIntoView).not.toHaveBeenCalledWith({
			behavior: 'smooth',
		});
	});

	it('should not scroll when no block parameter is present', () => {
		// Setup window without block parameter
		Object.defineProperty(window, 'location', {
			value: { hash: '' },
			writable: true,
		});

		const containerDiv = document.createElement('div');
		const containerRef = { current: containerDiv };

		renderHook(() => useScrollToLocalId(containerRef));

		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it('should not scroll when element is not found', () => {
		const containerDiv = document.createElement('div');
		const containerRef = { current: containerDiv };

		renderHook(() => useScrollToLocalId(containerRef));

		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it('should not scroll when containerRef is null', () => {
		const containerRef = { current: null };

		renderHook(() => useScrollToLocalId(containerRef));

		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});
});
