import { FirstInteractionObserver, type OnFirstInteraction } from './firstInteractionObserver';

describe('FirstInteractionObserver', () => {
	let onFirstInteraction: jest.Mock<ReturnType<OnFirstInteraction>, Parameters<OnFirstInteraction>>;

	beforeEach(() => {
		onFirstInteraction = jest.fn();
	});

	function simulateEvent(type: string) {
		const event = new Event(type);
		window.dispatchEvent(event);
	}

	it('should call onFirstInteraction with keydown event', () => {
		new FirstInteractionObserver(onFirstInteraction);

		simulateEvent('keydown');

		expect(onFirstInteraction).toHaveBeenCalledWith(expect.objectContaining({ event: 'keydown' }));
		expect(onFirstInteraction).toHaveBeenCalledTimes(1);
	});

	it('should call onFirstInteraction with wheel event', () => {
		new FirstInteractionObserver(onFirstInteraction);

		simulateEvent('wheel');

		expect(onFirstInteraction).toHaveBeenCalledWith(expect.objectContaining({ event: 'wheel' }));
		expect(onFirstInteraction).toHaveBeenCalledTimes(1);
	});

	it('should call onFirstInteraction with scroll event', () => {
		new FirstInteractionObserver(onFirstInteraction);

		simulateEvent('scroll');

		expect(onFirstInteraction).toHaveBeenCalledWith(expect.objectContaining({ event: 'scroll' }));
		expect(onFirstInteraction).toHaveBeenCalledTimes(1);
	});

	it('should call onFirstInteraction with resize event', () => {
		new FirstInteractionObserver(onFirstInteraction);

		simulateEvent('resize');

		expect(onFirstInteraction).toHaveBeenCalledWith(expect.objectContaining({ event: 'resize' }));
		expect(onFirstInteraction).toHaveBeenCalledTimes(1);
	});

	it('should unbind all events after first interaction', () => {
		new FirstInteractionObserver(onFirstInteraction);

		simulateEvent('keydown');

		// Simulate another event after the first to ensure no more calls
		simulateEvent('wheel');

		expect(onFirstInteraction).toHaveBeenCalledTimes(1);
	});

	it('should unbind events when disconnect is called', () => {
		const observer = new FirstInteractionObserver(onFirstInteraction);

		observer.disconnect();

		simulateEvent('keydown');
		simulateEvent('wheel');

		expect(onFirstInteraction).not.toHaveBeenCalled();
	});
});
